import React, { useState, useEffect, useRef } from 'react';
import { agentService } from '../services/agentService';
import { Agent } from '../types/Agent';

interface AgentFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialAgent?: Agent;
}

export default function AgentForm({ onClose, onSuccess, initialAgent }: AgentFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    specialization: '',
    experienceYears: '',
    phone: '',
    email: '',
    photoUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (initialAgent) {
      setFormData({
        fullName: initialAgent.fullName,
        specialization: initialAgent.specialization,
        experienceYears: initialAgent.experienceYears?.toString() || '',
        phone: initialAgent.phone,
        email: initialAgent.email,
        photoUrl: initialAgent.photoUrl
      });
      setPhotoPreview(initialAgent.photoUrl || '');
    }
  }, [initialAgent]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setErrorMsg('');
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePickPhoto = () => {
    fileInputRef.current?.click();
  };

  const readFileAsImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = reader.result as string;
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  };

  const compressToDataUrl = async (file: File, maxDim = 600, quality = 0.75): Promise<string> => {
    const img = await readFileAsImage(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    const { width, height } = img;
    const scale = Math.min(1, maxDim / Math.max(width, height));
    const targetW = Math.max(1, Math.round(width * scale));
    const targetH = Math.max(1, Math.round(height * scale));
    canvas.width = targetW;
    canvas.height = targetH;
    ctx.drawImage(img, 0, 0, targetW, targetH);

    // Prefer JPEG to reduce size; fall back to PNG if needed
    let dataUrl = canvas.toDataURL('image/jpeg', quality);
    // Safety check ~ 900KB (Firestore doc limit ~1MB, leave headroom)
    const approxBytes = Math.ceil((dataUrl.length * 3) / 4);
    if (approxBytes > 900_000 && quality > 0.5) {
      // Try one more pass at lower quality
      dataUrl = canvas.toDataURL('image/jpeg', 0.6);
    }
    return dataUrl;
  };

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      const dataUrl = await compressToDataUrl(file);
      // final size check
      const approxBytes = Math.ceil((dataUrl.length * 3) / 4);
      if (approxBytes > 950_000) {
        setErrorMsg('Selected image is too large. Please choose a smaller image (under ~900KB after compression).');
        return;
      }
      setFormData(prev => ({ ...prev, photoUrl: dataUrl }));
      setPhotoPreview(dataUrl);
    } catch (err) {
      console.error('Failed to process photo file', err);
      setErrorMsg('Failed to read selected image. Please try another image.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const payload = {
        fullName: formData.fullName,
        specialization: formData.specialization,
        experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : undefined,
        phone: formData.phone,
        email: formData.email,
        photoUrl: formData.photoUrl
      } as Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>;

      if (initialAgent) {
        await agentService.updateAgent(initialAgent.id, payload);
      } else {
        await agentService.addAgent(payload);
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving agent:', error);
      setErrorMsg(error?.message || 'Failed to save agent. Check your internet connection and Firestore rules.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-semibold">{initialAgent ? 'Edit Agent' : 'Add Agent'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded">
              {errorMsg}
            </div>
          )}
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white">
              {photoPreview ? (
                <img src={photoPreview} alt="Agent" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No photo</div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <button type="button" onClick={handlePickPhoto} className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Upload Photo</button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoFileChange} />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Or paste an image URL</label>
                <input
                  type="url"
                  name="photoUrl"
                  value={formData.photoUrl}
                  onChange={(e) => { handleChange(e); setPhotoPreview(e.target.value); }}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Specialization</label>
            <input
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded-md px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" disabled={loading || !formData.photoUrl} className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 