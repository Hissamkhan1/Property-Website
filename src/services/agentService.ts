import { 
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Agent } from '../types/Agent';

const agentsCol = () => collection(db, 'agents');

export const agentService = {
  async addAgent(agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const ref = await addDoc(agentsCol(), {
      ...agent,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  async getAgents(): Promise<Agent[]> {
    const q = query(agentsCol(), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Agent[];
  },

  async updateAgent(agentId: string, update: Partial<Agent>): Promise<void> {
    const ref = doc(db, 'agents', agentId);
    await updateDoc(ref, { ...update, updatedAt: serverTimestamp() });
  },

  async deleteAgent(agentId: string): Promise<void> {
    await deleteDoc(doc(db, 'agents', agentId));
  }
}; 