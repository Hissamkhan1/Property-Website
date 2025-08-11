import React, { useState } from 'react';
import { inquiryService } from '../../services/inquiryService';

interface Props {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
}

export default function InquiryModal({ open, onClose, propertyId, propertyTitle }: Props) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I am interested in ${propertyTitle}. Please contact me at your earliest convenience.`,
  });
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await inquiryService.addInquiry({
        propertyId,
        propertyTitle,
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-xl font-semibold">Get in touch</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={submit} className="space-y-4 p-6">
          <input name="name" placeholder="Name*" required value={form.name} onChange={handle}
                 className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-600" />
          <input name="email" type="email" placeholder="Email*" required value={form.email} onChange={handle}
                 className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-600" />
          <input name="phone" placeholder="Phone Number*" required value={form.phone} onChange={handle}
                 className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-600" />
          <textarea name="message" rows={4} value={form.message} onChange={handle}
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-600" />
          <button type="submit" disabled={loading}
                  className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Sending...' : 'Request Info'}
          </button>
        </form>
      </div>
    </div>
  );
} 