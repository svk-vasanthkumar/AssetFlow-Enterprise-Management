import { useState } from 'react';
import { useAssets, useDeleteAsset } from '../api/useAssets';
import { AddAssetModal } from '../components/AddAssetModal';
import { AssetTable } from '../components/AssetTable'; 

export const AssetList = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null); // Holds data of asset being edited
  
  const { data: assets, isLoading, isError, error } = useAssets();
  const deleteAsset = useDeleteAsset();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this asset? This action cannot be undone.")) {
      deleteAsset.mutate(id);
    }
  };

  const handleEdit = (assetData) => {
    setEditingAsset(assetData);
    // You would then open your Edit Modal here: setIsEditModalOpen(true);
    console.log("Editing:", assetData); 
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const safeAssets = assets || [];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Asset Inventory</h1>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors"
        >
          + Add New Asset
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden min-h-[400px]">
        {safeAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <p>No assets found.</p>
          </div>
        ) : (
          <AssetTable 
            data={safeAssets} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )}
      </div>

      <AddAssetModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      {/* <EditAssetModal isOpen={!!editingAsset} initialData={editingAsset} onClose={() => setEditingAsset(null)} /> */}
    </div>
  );
};
