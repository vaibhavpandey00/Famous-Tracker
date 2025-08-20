import { json, redirect, unstable_createFileUploadHandler, unstable_parseMultipartFormData } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { getAdminDashboardData, adminAddCelebrity, invalidateAdminCache } from "../utils/adminUtils.server";
import { bulkImportSchema } from "../utils/schemas.server";
import { useCallback, useEffect, useState } from "react";
import logger from "../utils/logger.client";
import { downloadSampleFile } from "../utils/adminUtils.client";
import {
    Info,
    Shield,
    CheckCircle2,
    AlertTriangle,
    X,
    Upload,
    Download,
    Database,
    FileJson,
    FileText,
    CheckCircle,
    RefreshCw,
    AlertCircle,
    Star,
    Trash2,
    ArrowRight,
    SkipForward,
    XCircle
} from 'lucide-react';
import AddGlobalCelebrities from "../components/AddGlobalCelebrities"
import ManageCelebrities from "../components/ManageCelebrities";
import prisma from "../db.server";
import { promises as fs } from "fs";
import * as os from "os";

export const loader = async ({ params }) => {
    const { AUTH_CODE } = params;

    const a_valid_code = process.env.ADMIN_AUTH_CODE;

    if (AUTH_CODE !== a_valid_code) {
        return redirect("/app");
    }

    const shopData = await getAdminDashboardData();

    // If authentication is successful, you can load data for the dashboard.
    const loaderData = {
        user: "Admin",
        serverUptime: "69.98%",
        shopsCreatedThisMonth: shopData.shopsCreatedThisMonth,
        activeShops: shopData.activeShops,
        inActiveShops: shopData.inActiveShops,
        totalShops: shopData.totalShops,
        celebCount: shopData.celebCount
    };

    // Return the data as JSON to the component.
    return json({ loaderData });
};

export const action = async ({ request }) => {
    const contentType = request.headers.get("Content-Type") || "";

    if (contentType.includes("application/json")) {
        const data = await request.json();
        console.log("Handling JSON request for action:", data.Action);

        switch (data.Action) {
            case "createCelebrityRecord":
                delete data.Action;
                console.log("Creating single celeb record...");
                const newCeleb = await adminAddCelebrity(data);
                return newCeleb ? { success: true } : { success: false };

            case "deleteCelebrityRecord":
                console.log("Deleting Celeb Record...");
                // Add your delete logic here
                break;

            case "searchCelebrityRecord":

                delete data.Action;

                const { findCelebMatch } = await import("../utils/adminUtils.server");

                console.log("Searching Celeb Record...");
                console.log("Celeb Name: ", data.fullName);
                console.log("Normalized Celeb Name: ", data.normalizedName);

                const celebMatch = await findCelebMatch(data.fullName, data.normalizedName);

                if (celebMatch) {
                    return { celebMatch, success: true, type: "findCeleb" };
                }
                return { success: false, type: "findCeleb" };

            default:
                console.error("Unknown action:", data.Action);
                break;
        }
        return null;
    }

    if (contentType.includes("multipart/form-data")) {
        console.log("Handling file upload for bulk import...");

        const uploadHandler = unstable_createFileUploadHandler({
            directory: os.tmpdir(),
        });

        const formData = await unstable_parseMultipartFormData(request, uploadHandler);
        const file = formData.get("celebFile");

        if (!file || typeof file.filepath !== 'string') {
            return json({ error: "File upload failed." }, { status: 400 });
        }

        const filePath = file.filepath;

        // // Log file information
        // console.log("Original filename:", file.name);
        // console.log("File type:", file.type);
        // console.log("File size:", file.size);
        // console.log("Temporary file path:", filePath);

        // // Alternative without path module:
        // const lastSlash = filePath.lastIndexOf('/') !== -1 ? filePath.lastIndexOf('/') : filePath.lastIndexOf('\\');
        // console.log("Temporary filename:", filePath.substring(lastSlash + 1));
        // console.log("Temporary directory used:", filePath.substring(0, lastSlash));

        // More efficient approach - check for existing records first

        try {
            const fileContent = await fs.readFile(filePath, "utf-8");
            const jsonData = JSON.parse(fileContent);

            const validationResult = bulkImportSchema.safeParse(jsonData);
            if (!validationResult.success) {
                console.error("Zod Validation Errors:", validationResult.error.flatten());
                return json({
                    message: "Invalid JSON data format.",
                    details: validationResult.error.flatten(),
                    success: false
                }, { status: 400 });
            }

            const validatedData = validationResult.data;

            // Get all normalizedNames from the input data
            const normalizedNames = validatedData.map(celeb => celeb.normalizedName);

            // Find existing records to avoid duplicates
            const existingCelebrities = await prisma.globalCelebrity.findMany({
                where: {
                    normalizedName: {
                        in: normalizedNames
                    }
                },
                select: {
                    normalizedName: true
                }
            });

            const existingNames = new Set(existingCelebrities.map(celeb => celeb.normalizedName));

            // Filter out duplicates
            const newCelebrities = validatedData.filter(celeb => !existingNames.has(celeb.normalizedName));
            const duplicatesCount = validatedData.length - newCelebrities.length;

            if (newCelebrities.length === 0) {
                return json({
                    message: "No new celebrities to import. All records already exist.",
                    success: true,
                    imported: 0,
                    skipped: duplicatesCount,
                    total: validatedData.length
                });
            }

            // Add createdAt to newCelebrities
            const now = new Date();
            const toInsert = newCelebrities.map(celeb => {
                // preserve existing createdAt (parse string -> Date), otherwise set to now
                let createdAtValue = celeb.createdAt ?? now;
                if (typeof createdAtValue === "string") {
                    const parsed = new Date(createdAtValue);
                    // if parsed is invalid, fallback to now
                    createdAtValue = isNaN(parsed.getTime()) ? now : parsed;
                }
                return {
                    ...celeb,
                    createdAt: createdAtValue
                };
            });

            // Now create the new records (no skipDuplicates needed)
            const result = await prisma.globalCelebrity.createMany({
                data: toInsert
            });

            // Invalidate admin cache
            invalidateAdminCache();

            return json({
                message: `Successfully imported ${result.count} celebrities. ${duplicatesCount} duplicates were skipped.`,
                success: true,
                imported: result.count,
                skipped: duplicatesCount,
                total: validatedData.length
            });

        } catch (error) {
            console.error("Import failed:", error);
            return json({
                message: "An unexpected error occurred during import.",
                success: false,
                error: error.message
            }, { status: 500 });
        } finally {
            if (filePath) {
                try {
                    await fs.unlink(filePath);
                } catch (unlinkError) {
                    console.error("Failed to cleanup temp file:", unlinkError);
                }
            }
        }
    }
};

const CustomToast = ({ toast, onClose }) => {
    const [ isFadingOut, setIsFadingOut ] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => onClose(toast.id), 300);
        }, 4000);

        return () => clearTimeout(timer);
    }, [ toast.id, onClose ]);

    const handleClose = () => {
        setIsFadingOut(true);
        setTimeout(() => onClose(toast.id), 300);
    };

    // Determine toast styling based on type
    const getToastConfig = (type) => {
        switch (type) {
            case 'success':
                return {
                    bgColor: 'bg-green-500',
                    Icon: CheckCircle2
                };
            case 'error':
                return {
                    bgColor: 'bg-red-500',
                    Icon: AlertTriangle
                };
            case 'warning':
                return {
                    bgColor: 'bg-yellow-500',
                    Icon: AlertTriangle
                };
            case 'info':
                return {
                    bgColor: 'bg-blue-500',
                    Icon: Info
                };
            default:
                return {
                    bgColor: 'bg-gray-500',
                    Icon: Info
                };
        }
    };

    const { bgColor, Icon } = getToastConfig(toast.type);

    return (
        <div className={`flex items-center text-white p-4 rounded-lg shadow-lg mb-4 transition-all duration-300 transform ${isFadingOut ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'} ${bgColor}`}>
            <Icon size={24} className="mr-3" />
            <p className="flex-grow font-medium">{toast.message}</p>
            <button onClick={handleClose} className="ml-4 p-1 rounded-full hover:bg-white/20">
                <X size={18} />
            </button>
        </div>
    );
};

export default function AdminDashboard() {
    const { loaderData } = useLoaderData();
    const fetcher = useFetcher();

    const [ dashboardData, setDashboardData ] = useState({
        user: "",
        shopsCreatedThisMonth: 0,
        serverUptime: "0%",
        activeShops: [],
        activeShopsCount: 0,
        inActiveShops: [],
        inActiveShopsCount: 0,
        totalShops: 0,
        celebCount: 0
    });

    const [ formData, setFormData ] = useState({
        fullName: "",
        normalizedName: "",
        categories: [],
        subcategories: [],
        socials: [ { platform: "", link: "" } ],
        location: { city: "", state: "", country: "" },
        league: "",
        team: "",
        position: "",
        maxFollowerCount: 0,
        maxFollowerDisplay: "",
        notableAchievements: [ "" ],
        notes: ""
    });

    const [ celebToFind, setCelebToFind ] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        city: "",
        state: "",
        normalizedName: ""
    });

    const [ celebrities, setCelebrities ] = useState([]);
    const [ activeTab, setActiveTab ] = useState("overview");
    const [ toasts, setToasts ] = useState([]);
    const [ files, setFiles ] = useState([]);
    const [ isDragOver, setIsDragOver ] = useState(false);
    const [ isProcessing, setIsProcessing ] = useState(false);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prevToasts => [ ...prevToasts, { id, message, type } ]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    useEffect(() => {
        if (loaderData) {
            loaderData.activeShopsCount = loaderData.activeShops.length;
            loaderData.inActiveShopsCount = loaderData.inActiveShops.length;
            setDashboardData(loaderData);
        }
    }, [ loaderData ]);

    useEffect(() => {
        // Check if the submission is finished (`state` is "idle") and if there's data
        if (fetcher.state === "idle" && fetcher.data) {
            // Check the `success` flag returned from the action
            if (fetcher.data.success) {
                // Check if this is a bulk import response (has imported/skipped counts)
                if (fetcher.data.hasOwnProperty('imported') || fetcher.data.count) {
                    // This is a file upload response
                    const importedCount = fetcher.data.imported || fetcher.data.count || 0;
                    const skippedCount = fetcher.data.skipped || 0;
                    const errorCount = fetcher.data.errors || 0;

                    // Create detailed success message
                    let message = `Import completed: ${importedCount} imported`;
                    if (skippedCount > 0) {
                        message += `, ${skippedCount} skipped (duplicates)`;
                    }
                    if (errorCount > 0) {
                        message += `, ${errorCount} errors`;
                    }

                    addToast(message, importedCount > 0 ? 'success' : 'warning');

                    // Update the single file status to success
                    setFiles(prev => prev.map(file =>
                        file.status === 'uploading'
                            ? {
                                ...file,
                                status: importedCount > 0 ? 'success' : 'warning',
                                celebrityCount: importedCount,
                                skippedCount: skippedCount,
                                errorCount: errorCount,
                                preview: fetcher.data.celebrities || [],
                                errorDetails: fetcher.data.errorDetails || []
                            }
                            : file
                    ));
                }
                else if (fetcher.data.hasOwnProperty('celebMatch')) {
                    // This is a celebrity search response
                    const celebData = fetcher.data.celebMatch;

                    // Normalize the data to always be an array
                    if (Array.isArray(celebData)) {
                        // If it's already an array, set it directly
                        setCelebrities(celebData);
                    } else {
                        // If it's a single object, wrap it in an array
                        setCelebrities([ celebData ]);
                    }
                    addToast('Celebrity fetched successfully!', 'success');
                }
                else {
                    // Single celebrity creation
                    addToast('Celebrity created successfully!', 'success');
                }
            } else {
                // Handle error responses
                const errorMessage = fetcher.data.message || 'An error occurred.';
                addToast(errorMessage, 'error');

                // Mark the single file as error
                setFiles(prev => prev.map(file =>
                    file.status === 'uploading'
                        ? {
                            ...file,
                            status: 'error',
                            errorMessage: errorMessage,
                            errorDetails: fetcher.data.details || fetcher.data.errorDetails || []
                        }
                        : file
                ));
            }
            setIsProcessing(false);
        }
    }, [ fetcher.state, fetcher.data, addToast ]);

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    };

    const handleFiles = async (fileList) => {
        // Only take the first file
        const file = fileList[ 0 ];

        if (!file) return;

        // Check if it's JSON
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            addToast('Please upload JSON files only.', 'error');
            return;
        }

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            addToast(`File is too large. Max size is 2MB.`, 'error');
            return;
        }

        try {
            // Read the file to count records
            const fileContent = await readFileAsText(file);
            const jsonData = JSON.parse(fileContent);

            // Count records - assuming it's an array of celebrity objects
            const recordCount = Array.isArray(jsonData) ? jsonData.length : 0;

            if (recordCount === 0) {
                addToast('No records found in the JSON file.', 'warning');
                return;
            }

            // Replace any existing file (single file only)
            const fileData = {
                id: Date.now(),
                name: file.name,
                size: file.size,
                status: 'ready',
                file: file,
                recordCount: recordCount
            };

            setFiles([ fileData ]);
            addToast(`File loaded with ${recordCount} records`, 'info');

        } catch (error) {
            console.error('Error reading file:', error);
            addToast('Invalid JSON file format.', 'error');
        }
    };

    // Helper function to read file as text
    const readFileAsText = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    };

    const clearFile = () => {
        setFiles([]);
    };

    const uploadFile = () => {
        const fileToUpload = files.find(f => f.status === 'ready');
        if (!fileToUpload) return;

        // Update status to uploading
        setFiles(prev => prev.map(f =>
            f.id === fileToUpload.id
                ? { ...f, status: 'uploading' }
                : f
        ));

        setIsProcessing(true);

        // Create form data and submit
        const formData = new FormData();
        formData.append('celebFile', fileToUpload.file);

        fetcher.submit(formData, {
            method: 'post',
            encType: 'multipart/form-data'
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = [ "Bytes", "KB", "MB", "GB" ]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[ i ]
    }

    const handleCelebSearch = () => {
        if (!celebToFind.firstName && !celebToFind.lastName && !celebToFind.city && !celebToFind.state) return;

        // Extract data from celebToFind state and build a normalized name
        const firstName = celebToFind.firstName.toLowerCase().trim();
        const middleName = celebToFind.middleName.toLowerCase().trim();
        const lastName = celebToFind.lastName.toLowerCase().trim();
        // Only add middle name if it's not empty
        const fullName = `${firstName} ${middleName ? middleName + " " : ""}${lastName}`.trim();

        const dataToSend = {
            Action: "searchCelebrityRecord",
            fullName: fullName,
            normalizedName: celebToFind.normalizedName
        };

        // logger.log("Sending data to server: ", dataToSend);
        fetcher.submit(dataToSend, {
            method: "post",
            encType: "application/json",
        });
    }

    const handleFormSubmit = (getEvent) => {
        formData.Action = getEvent;

        const dataToSend = JSON.stringify(formData);
        fetcher.submit(dataToSend, {
            method: "post",
            encType: "application/json",
        });
    }

    return (
        <div className="font-sans p-4 sm:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
                {/* --- Dashboard Header --- */}
                <div className="flex items-center mb-6 pb-4 border-b">
                    <Shield size={32} className="text-blue-600" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 ml-4">Admin Dashboard</h1>
                </div>

                {/* This div holds and positions all the toast notifications */}
                <div className="fixed bottom-5 right-5 z-50 w-full max-w-xs">
                    {toasts.map(toast => (
                        <CustomToast key={toast.id} toast={toast} onClose={removeToast} />
                    ))}
                </div>

                {/* --- Dashboard Analytics Section --- */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Dashboard Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-blue-100 p-4 rounded-lg shadow">
                            <h3 className="font-semibold text-blue-800">Welcome</h3>
                            <p className="text-2xl font-bold text-blue-900 mt-2">{dashboardData.user}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg shadow">
                            <h3 className="font-semibold text-green-800">Total New Logins (30d)</h3>
                            <p className="text-2xl font-bold text-green-900 mt-2">{dashboardData.shopsCreatedThisMonth}</p>
                        </div>
                        <div className="bg-purple-100 p-4 rounded-lg shadow">
                            <h3 className="font-semibold text-purple-800">Server Uptime</h3>
                            <p className="text-2xl font-bold text-purple-900 mt-2">{dashboardData.serverUptime}</p>
                        </div>
                        <div className="bg-indigo-100 p-4 rounded-lg shadow">
                            <h3 className="font-semibold text-indigo-800">Active Shops</h3>
                            <p className="text-2xl font-bold text-indigo-900 mt-2">{dashboardData.activeShopsCount}</p>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded-lg shadow">
                            <h3 className="font-semibold text-yellow-800">Inactive Shops</h3>
                            <p className="text-2xl font-bold text-yellow-900 mt-2">{dashboardData.inActiveShopsCount}</p>
                        </div>
                        <div className="bg-pink-100 p-4 rounded-lg shadow">
                            <h3 className="font-semibold text-pink-800">Total Shops</h3>
                            <p className="text-2xl font-bold text-pink-900 mt-2">{dashboardData.totalShops}</p>
                        </div>
                    </div>
                </div>

                {/* --- Manage Global Celebrities Section --- */}
                <div className="mt-10">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b">Manage Global Celebrities</h2>

                    {/* Tab buttons */}
                    <div className="flex rounded-t-xl gap-8 p-4">
                        <button
                            className={`font-semibold text-base ${activeTab === "overview" ? "text-blue-600" : ""}`}
                            onClick={() => setActiveTab("overview")}
                        >Manage</button>
                        <button
                            className={`font-semibold text-base ${activeTab === "add" ? "text-blue-600" : ""}`}
                            onClick={() => setActiveTab("add")}
                        >Add</button>
                        <button
                            className={`font-semibold text-base ${activeTab === "upload" ? "text-blue-600" : ""}`}
                            onClick={() => setActiveTab("upload")}
                        >Upload</button>
                    </div>

                    {activeTab === "overview" && (
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4">
                            <ManageCelebrities
                                celebCount={dashboardData.celebCount}
                                celebToFind={celebToFind}
                                setCelebToFind={setCelebToFind}
                                celebrities={celebrities}
                                onSearch={handleCelebSearch} />
                        </div>
                    )}

                    {activeTab === "add" && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-3">
                                <AddGlobalCelebrities
                                    formData={formData}
                                    setFormData={setFormData}
                                    onSubmit={() => handleFormSubmit("createCelebrityRecord")}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "upload" && (
                        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
                            <div className="max-w-5xl mx-auto">

                                {/* Upload Form */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Upload className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">File Upload</h3>
                                                    <p className="text-sm text-gray-600">Drag and drop JSON file or click to browse</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={downloadSampleFile}
                                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                            >
                                                <Download className="h-4 w-4" />
                                                <span>Download Sample</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                                                }`}
                                        >
                                            <div className="space-y-4">
                                                <div className="flex justify-center">
                                                    <div className={`p-4 rounded-full ${isDragOver ? "bg-blue-100" : "bg-gray-100"}`}>
                                                        <FileJson className={`h-12 w-12 ${isDragOver ? "text-blue-600" : "text-gray-400"}`} />
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                                        Drop your JSON file here
                                                    </h4>
                                                    <p className="text-gray-600 mb-4">
                                                        Drag and drop a single JSON file here, or use the file input below
                                                    </p>
                                                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                                                        <span>• JSON format only</span>
                                                        <span>• Max 2MB per file</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <label htmlFor="celebFile" className="block text-sm font-medium text-gray-700 mb-2">
                                                            Select JSON File
                                                        </label>
                                                        <input
                                                            type="file"
                                                            id="celebFile"
                                                            name="celebFile"
                                                            accept=".json,application/json"
                                                            onChange={(e) => handleFiles(Array.from(e.target.files || []))}
                                                            disabled={isProcessing}
                                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-600 file:to-purple-600 file:text-white hover:file:from-blue-700 hover:file:to-purple-700 file:cursor-pointer file:transition-all file:duration-200 disabled:opacity-50"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Show selected file with clear option */}
                                        {files.length > 0 && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-start space-x-3">
                                                        <div className="flex-shrink-0 mt-0.5">
                                                            <FileText className="h-5 w-5 text-gray-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <span className="text-sm font-medium text-gray-900 truncate">
                                                                    {files[ 0 ].name}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    ({formatFileSize(files[ 0 ].size)})
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center space-x-3">
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                                    <Database className="h-3 w-3 mr-1" />
                                                                    {files[ 0 ].recordCount || 0} records
                                                                </span>
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                                    Ready to upload
                                                                </span>
                                                            </div>

                                                            <p className="text-xs text-gray-500 mt-1">
                                                                File is loaded and ready for bulk import
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={clearFile}
                                                        className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                                    >
                                                        <X className="h-4 w-4" />
                                                        <span>Clear</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Upload Button */}
                                {files.length > 0 && files[ 0 ].status === 'ready' && (
                                    <div className="text-center mb-8">
                                        <button
                                            type="button"
                                            onClick={uploadFile}
                                            disabled={isProcessing}
                                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            <Upload className="h-5 w-5" />
                                            <span>Upload File</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}

                                {/* File Status Display */}
                                {files.length > 0 && files[ 0 ].status !== 'ready' && (
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                                        <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <FileText className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">File Status</h3>
                                                    <p className="text-sm text-gray-600">Review your uploaded file</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-4 flex-1">
                                                    <div className="flex-shrink-0">
                                                        {files[ 0 ].status === "uploading" && (
                                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                                <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                                                            </div>
                                                        )}
                                                        {files[ 0 ].status === "success" && (
                                                            <div className="p-2 bg-green-100 rounded-lg">
                                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                            </div>
                                                        )}
                                                        {files[ 0 ].status === "warning" && (
                                                            <div className="p-2 bg-yellow-100 rounded-lg">
                                                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                                            </div>
                                                        )}
                                                        {files[ 0 ].status === "error" && (
                                                            <div className="p-2 bg-red-100 rounded-lg">
                                                                <AlertCircle className="h-5 w-5 text-red-600" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <h4 className="text-sm font-semibold text-gray-900 truncate">{files[ 0 ].name}</h4>
                                                            <span className="text-xs text-gray-500">{formatFileSize(files[ 0 ].size)}</span>

                                                            {/* Success badges */}
                                                            {(files[ 0 ].status === "success" || files[ 0 ].status === "warning") && (
                                                                <div className="flex items-center space-x-2">
                                                                    {files[ 0 ].celebrityCount > 0 && (
                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                                            <Star className="h-3 w-3 mr-1" />
                                                                            {files[ 0 ].celebrityCount} imported
                                                                        </span>
                                                                    )}
                                                                    {files[ 0 ].skippedCount > 0 && (
                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                                            <SkipForward className="h-3 w-3 mr-1" />
                                                                            {files[ 0 ].skippedCount} skipped
                                                                        </span>
                                                                    )}
                                                                    {files[ 0 ].errorCount > 0 && (
                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                                            <XCircle className="h-3 w-3 mr-1" />
                                                                            {files[ 0 ].errorCount} errors
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {files[ 0 ].status === "uploading" && <p className="text-sm text-blue-600">Processing file...</p>}

                                                        {files[ 0 ].status === "success" && (
                                                            <div>
                                                                <p className="text-sm text-green-600 mb-2">Import completed successfully!</p>
                                                                {files[ 0 ].preview && files[ 0 ].preview.length > 0 && (
                                                                    <div className="bg-gray-50 rounded-lg p-3">
                                                                        <p className="text-xs font-medium text-gray-700 mb-2">Preview of imported celebrities:</p>
                                                                        <div className="space-y-1">
                                                                            {files[ 0 ].preview.map((celebrity, index) => (
                                                                                <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                                                                                    <Star className="h-3 w-3 text-yellow-500" />
                                                                                    <span className="font-medium">{celebrity.fullName}</span>
                                                                                    {celebrity.categories && celebrity.categories.length > 0 && (
                                                                                        <span className="text-gray-400">• {celebrity.categories[ 0 ]}</span>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                            {files[ 0 ].celebrityCount && files[ 0 ].celebrityCount > 3 && (
                                                                                <p className="text-xs text-gray-500 italic">
                                                                                    ...and {files[ 0 ].celebrityCount - 3} more celebrities
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {files[ 0 ].status === "warning" && (
                                                            <div>
                                                                <p className="text-sm text-yellow-600 mb-2">Import completed with warnings</p>
                                                                {files[ 0 ].preview && files[ 0 ].preview.length > 0 && (
                                                                    <div className="bg-yellow-50 rounded-lg p-3">
                                                                        <p className="text-xs font-medium text-yellow-700 mb-2">Preview of imported celebrities:</p>
                                                                        <div className="space-y-1">
                                                                            {files[ 0 ].preview.map((celebrity, index) => (
                                                                                <div key={index} className="flex items-center space-x-2 text-xs text-yellow-600">
                                                                                    <Star className="h-3 w-3 text-yellow-500" />
                                                                                    <span className="font-medium">{celebrity.fullName}</span>
                                                                                    {celebrity.categories && celebrity.categories.length > 0 && (
                                                                                        <span className="text-yellow-400">• {celebrity.categories[ 0 ]}</span>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {files[ 0 ].status === "error" && (
                                                            <div>
                                                                <p className="text-sm text-red-600 mb-2">{files[ 0 ].errorMessage}</p>
                                                                {files[ 0 ].errorDetails && files[ 0 ].errorDetails.length > 0 && (
                                                                    <div className="bg-red-50 rounded-lg p-3">
                                                                        <p className="text-xs font-medium text-red-700 mb-2">Error Details:</p>
                                                                        <div className="space-y-1">
                                                                            {files[ 0 ].errorDetails.map((error, index) => (
                                                                                <div key={index} className="text-xs text-red-600">
                                                                                    <span className="font-medium">{error.celebrity || `Entry ${index + 1}`}:</span> {error.error}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2 ml-4">
                                                    <button
                                                        type="button"
                                                        onClick={clearFile}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* JSON Format Guide */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-8">
                                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-indigo-100 rounded-lg">
                                                <FileJson className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">JSON Format Requirements</h3>
                                                <p className="text-sm text-gray-600">Structure your celebrity data correctly</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                            <pre className="text-gray-800">
                                                {`[
    {
        "fullName": "Celebrity Name",                           // Required
        "normalizedName": "firstName_lastName_city_state",      // Required must be all lowercase and no spaces
        "categories": ["CELEBRITY", "ACTOR"],                   // Optional array
        "subcategories": ["ACTOR"],                             // Optional array
        "socials": [                                            // Optional array
            {
                "platform": "Instagram",
                "link": "https://instagram.com/username"
            }
        ],
        "location": {                                           // Optional object
            "city": "Los Angeles",
            "state": "California", 
            "country": "USA"
        },
        "league": "NBA",                                        // Optional (for athletes)
        "team": "Lakers",                                       // Optional (for athletes)
        "position": "Point Guard",                              // Optional (for athletes)
        "notableAchievements": [                                // Optional array
            "Academy Award Winner"
        ],
        "maxFollowerCount": 15000000,                           // Optional number
        "maxFollowerDisplay": "15M",                            // Optional string
        "notes": "Additional information"                       // Optional string
    }
]`}
                                            </pre>
                                        </div>

                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">Required Fields:</h4>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    <li>
                                                        • <code className="bg-gray-100 px-1 rounded">fullName</code> - Celebrity's full name
                                                    </li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">Optional Fields:</h4>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    <li>• All other fields are optional</li>
                                                    <li>
                                                        • Arrays can be empty: <code className="bg-gray-100 px-1 rounded">[]</code>
                                                    </li>
                                                    <li>
                                                        • Objects can be empty: <code className="bg-gray-100 px-1 rounded">{`{}`}</code>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}