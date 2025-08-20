import React, { useEffect } from 'react'
import CelebrityList from './CelebrityList';

const ManageCelebrities = ({ celebCount, celebToFind, setCelebToFind, celebrities, onSearch }) => {

    useEffect(() => {
        const firstName = celebToFind.firstName.toLowerCase().replace(/\s+/g, '_');
        const middleName = celebToFind.middleName.toLowerCase().replace(/\s+/g, '_');
        const lastName = celebToFind.lastName.toLowerCase().replace(/\s+/g, '_');
        const cityPart = celebToFind.city.toLowerCase().replace(/\s+/g, '_');
        const statePart = celebToFind.state.toLowerCase().replace(/\s+/g, '_');

        const parts = [ firstName, middleName, lastName, cityPart, statePart ].filter(Boolean);
        setCelebToFind(prev => ({ ...prev, normalizedName: parts.join('_') }));

    }, [ celebToFind.firstName, celebToFind.middleName, celebToFind.lastName, celebToFind.city, celebToFind.state ]);

    return <>
        {/* Form to search for celebrities */}
        <div className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 mb-4">

            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b py-3">
                <h2 className="text-2xl font-semibold">Manage Celebrities</h2>
                <p className="text-sm text-gray-600">{celebCount > 0 ? celebCount : "No"} celebrities found</p>
            </div>

            <h1 className="text-base font-semibold">Celebrity Name *</h1>
            <div className="flex gap-4">
                <input required type="text"
                    placeholder="First Name"
                    value={celebToFind.firstName}
                    onChange={(e) => setCelebToFind({ ...celebToFind, firstName: e.target.value })}
                    className="flex-1 border border-gray-200 rounded-lg p-2"
                />
                <input type="text"
                    placeholder="Middle Name"
                    value={celebToFind.middleName}
                    onChange={(e) => setCelebToFind({ ...celebToFind, middleName: e.target.value })}
                    className="flex-1 border border-gray-200 rounded-lg p-2"
                />
                <input required type="text"
                    placeholder="Last Name"
                    value={celebToFind.lastName}
                    onChange={(e) => setCelebToFind({ ...celebToFind, lastName: e.target.value })}
                    className="flex-1 border border-gray-200 rounded-lg p-2"
                />
            </div>

            <h1 className="text-base font-semibold">Location *</h1>
            <div className="flex gap-4">
                <input required type="text"
                    placeholder="City"
                    value={celebToFind.city}
                    onChange={(e) => setCelebToFind({ ...celebToFind, city: e.target.value })}
                    className="flex-1 border border-gray-200 rounded-lg p-2"
                />
                <input required type="text"
                    placeholder="State"
                    value={celebToFind.state}
                    onChange={(e) => setCelebToFind({ ...celebToFind, state: e.target.value })}
                    className="flex-1 border border-gray-200 rounded-lg p-2"
                />
            </div>

            <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={onSearch}
            >Search</button>
        </div>

        {/* Render the celebrities found in the database */}
        {
            celebrities.length > 0 && <CelebrityList celebrities={celebrities} />
        }

    </>
}

export default ManageCelebrities