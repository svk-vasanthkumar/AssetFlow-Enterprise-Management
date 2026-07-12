import { useAssets } from '../api/useAssets';
// import { AssetTable } from '../components/AssetTable';

export const AssetList = () => {
  const { data: assets, isLoading, isError, error } = useAssets();

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <p className="text-slate-500 animate-pulse">Loading asset inventory...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded border border-red-200">
          Error loading assets: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Asset Inventory</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track all company hardware and software.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors">
          + Add New Asset
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden min-h-[400px] p-4">
        {/* We will drop the TanStack Table component right here */}
        {assets?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <p>No assets found. Add your first asset to get started.</p>
          </div>
        ) : (
          <div className="text-slate-600 text-sm">
            {/* Temporary placeholder to prove data is loading */}
            <pre>{JSON.stringify(assets, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
