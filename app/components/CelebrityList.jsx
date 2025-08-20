import { useState } from 'react';
import CelebrityCard from './CelebrityCard';
import EditCelebrityModal from '../components/EditCelebrityModal';

export default function CelebrityList({ celebrities }) {
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ selectedCeleb, setSelectedCeleb ] = useState(null);

  const handleEdit = (id) => {
    const celebToEdit = celebrities.find(c => c.id === id);

    if (celebToEdit) {
      setSelectedCeleb(celebToEdit);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id) => {
    console.log("Deleting celebrity with ID:", id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCeleb(null);
  };

  const handleSaveCelebrity = (updatedData) => {
    console.log("Data to be saved via fetcher:", updatedData);
    // Here you would call your Remix fetcher to submit the data
    // fetcher.submit(updatedData, { method: 'post', action: '/path-to-your-action' });
  };

  if (!celebrities || celebrities.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-700">No Celebrities Found</h3>
        <p className="text-sm text-gray-500 mt-1">
          Your search did not return any results. Try a different name.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4 bg-gray-50 rounded-2xl">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-2xl font-bold text-gray-800">Celebrities Found</h2>
        <span className="text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
          {celebrities.length} result{celebrities.length > 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {celebrities.map((celeb) => (
          <CelebrityCard
            key={celeb.id}
            celeb={celeb}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <EditCelebrityModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        celebrity={selectedCeleb}
        onSave={handleSaveCelebrity}
      />
    </div>
  );
}