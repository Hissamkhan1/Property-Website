import { collection, addDoc, orderBy, getDocs, serverTimestamp, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Inquiry } from '../types/Inquiry';

const col = () => collection(db, 'inquiries');

export const inquiryService = {
  async addInquiry(data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) {
    const ref = await addDoc(col(), {
      ...data,
      status: 'new',
      createdAt: serverTimestamp(),
    });
    return ref.id;
  },
  async getInquiries(): Promise<Inquiry[]> {
    const q = query(col(), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Inquiry[];
  },
}; 