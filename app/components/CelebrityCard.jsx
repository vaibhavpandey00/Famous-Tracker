import { Pencil, Trash2, Users, MapPin, Tag } from 'lucide-react';

export default function CelebrityCard({ celeb, onEdit, onDelete }) {
  const locationString = [celeb.location?.city, celeb.location?.state, celeb.location?.country]
    .filter(Boolean) // Remove any null/undefined parts from location
    .join(', ');

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        {/* Main Info Section */}
        <div className="flex-1 pr-4">
          <p className="text-xs font-semibold uppercase text-blue-600">
            {celeb.categories?.join(' • ')}
          </p>
          <h3 className="text-xl font-bold text-gray-800 mt-1">{celeb.fullName}</h3>
          {celeb.team && celeb.league && (
            <p className="text-md text-gray-500">{`${celeb.team} • ${celeb.league}`}</p>
          )}

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-3 text-sm text-gray-600">
            {celeb.maxFollowerDisplay && (
              <span className="flex items-center gap-2">
                <Users size={16} className="text-gray-400" />
                <strong>{celeb.maxFollowerDisplay}</strong> Followers
              </span>
            )}
            {locationString && (
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400" />
                {locationString}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(celeb.id)}
            className="p-2 text-gray-500 rounded-md hover:bg-gray-100 hover:text-gray-800 transition-colors"
            aria-label="Edit"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => onDelete(celeb.id)}
            className="p-2 text-red-500 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors"
            aria-label="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}