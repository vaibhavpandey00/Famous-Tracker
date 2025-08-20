import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { celebrityEditSchema } from '../utils/schema.client';

export default function EditCelebrityModal({ celebrity, isOpen, onClose, onSave }) {

    // ADD THIS GUARD CLAUSE
    if (!isOpen || !celebrity) {
        return null;
    }

    const [ formData, setFormData ] = useState(celebrity);
    const [ errors, setErrors ] = useState({});

    // When the celebrity prop changes, reset the form data
    useEffect(() => {
        setFormData(celebrity);
        setErrors({}); // Clear previous errors
    }, [ celebrity ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [ name ]: value }));
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            location: { ...prev.location, [ name ]: value }
        }));
    };

    // A more complex handler for array of objects like 'socials'
    const handleSocialChange = (index, e) => {
        const { name, value } = e.target;
        const newSocials = [ ...formData.socials ];
        newSocials[ index ][ name ] = value;
        setFormData(prev => ({ ...prev, socials: newSocials }));
    };

    const addSocial = () => {
        setFormData(prev => ({
            ...prev,
            socials: [ ...(prev.socials || []), { platform: '', link: '' } ]
        }));
    };

    const removeSocial = (index) => {
        const newSocials = formData.socials.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, socials: newSocials }));
    };

    const handleSave = () => {
        // 1. Validate the form data using the Zod schema
        const validationResult = celebrityEditSchema.safeParse(formData);

        if (!validationResult.success) {
            // If validation fails, format errors and set them in state
            const formattedErrors = validationResult.error.format();
            setErrors(formattedErrors);
            console.error("Validation failed:", formattedErrors);
            return; // Stop the save process
        }

        // 2. If validation succeeds, call the onSave prop
        console.log("Validation successful. Saving data:", validationResult.data);
        onSave(validationResult.data); // Send the validated data back
        onClose(); // Close the modal
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Celebrity Details</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body - Form */}
                <div className="p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName || ''} onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName._errors[ 0 ]}</p>}
                        </div>

                        {/* Categories (Example with simple input, could be a multi-select) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Categories (comma-separated)</label>
                            <input type="text" name="categories" value={formData.categories?.join(', ') || ''}
                                onChange={(e) => setFormData(p => ({ ...p, categories: e.target.value.split(',').map(s => s.trim()) }))}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                            {errors.categories && <p className="text-red-500 text-xs mt-1">{errors.categories._errors[ 0 ]}</p>}
                        </div>

                        {/* Team & League */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Team</label>
                            <input type="text" name="team" value={formData.team || ''} onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">League</label>
                            <input type="text" name="league" value={formData.league || ''} onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>

                        {/* Location */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-x-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">City</label>
                                <input type="text" name="city" value={formData.location?.city || ''} onChange={handleLocationChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">State</label>
                                <input type="text" name="state" value={formData.location?.state || ''} onChange={handleLocationChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Country</label>
                                <input type="text" name="country" value={formData.location?.country || ''} onChange={handleLocationChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                            </div>
                        </div>

                        {/* Socials */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Social Media</label>
                            {/* Show max followers count */}
                            <div className="flex gap-4">
                                <div className="mb-3">{formData.maxFollowerCount}</div>
                                <div className="mb-3">{formData.maxFollowerDisplay}</div>
                            </div>

                            <div className="space-y-3">
                                {formData.socials?.map((social, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input type="text" name="platform" placeholder="Platform (e.g., Instagram)" value={social.platform} onChange={(e) => handleSocialChange(index, e)} className="block w-1/3 border-gray-300 rounded-md shadow-sm" />
                                        <input type="text" name="link" placeholder="https://..." value={social.link} onChange={(e) => handleSocialChange(index, e)} className="block w-2/3 border-gray-300 rounded-md shadow-sm" />
                                        <button onClick={() => removeSocial(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={addSocial} className="mt-3 flex items-center gap-2 text-sm text-blue-600 font-semibold hover:text-blue-800">
                                <Plus size={16} /> Add Social Link
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end items-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                    <button onClick={handleSave}
                        className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}