import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateAsset } from '../api/useAssets';

// 1. Define the Validation Schema
const assetSchema = z.object({
  name: z.string().min(2, "Asset name is required"),
  category: z.enum(['Laptop', 'Monitor', 'Mobile', 'Furniture', 'Software'], {
    errorMap: () => ({ message: "Please select a valid category" })
  }),
  serialNumber: z.string().min(3, "Serial number is required"),
  status: z.enum(['Active', 'In Storage', 'In Repair'], {
    errorMap: () => ({ message: "Please select a valid status" })
  }),
});

export const AddAssetModal = ({ isOpen, onClose }) => {
  const createAsset = useCreateAsset();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      status: 'In Storage',
      category: 'Laptop'
    }
  });

  // Prevent rendering if the modal is closed
  if (!isOpen) return null;

  const onSubmit = (data) => {
    createAsset.mutate(data, {
      onSuccess: () => {
        reset(); // Clear the form
        onClose(); // Close the modal
      },
      onError: (error) => {
        console.error("Failed to create asset:", error);
        // You can add a toast notification here later
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Add New Asset</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-xl">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          
          {/* Asset Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Asset Name</label>
            <input 
              {...register('name')}
              className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., MacBook Pro 16"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Serial Number */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Serial Number</label>
            <input 
              {...register('serialNumber')}
              className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., C02XYZ123"
            />
            {errors.serialNumber && <p className="text-red-500 text-xs mt-1">{errors.serialNumber.message}</p>}
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select 
              {...register('category')}
              className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Laptop">Laptop</option>
              <option value="Monitor">Monitor</option>
              <option value="Mobile">Mobile Device</option>
              <option value="Furniture">Office Furniture</option>
              <option value="Software">Software License</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Initial Status</label>
            <select 
              {...register('status')}
              className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="In Storage">In Storage</option>
              <option value="Active">Active (Assigned)</option>
              <option value="In Repair">In Repair</option>
            </select>
            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={createAsset.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {createAsset.isPending ? 'Saving...' : 'Save Asset'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
