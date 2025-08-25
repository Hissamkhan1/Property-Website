import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Property } from '../types/Property';

export const propertyService = {
  // Add new property (images are URLs/base64 strings)
  async addProperty(
    propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>,
    imageUrls: string[]
  ) {
    try {
      const docRef = await addDoc(collection(db, 'properties'), {
        ...propertyData,
        images: imageUrls,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    }
  },

  // Get all properties
  async getAllProperties() {
    try {
      const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];
    } catch (error) {
      console.error('Error getting properties:', error);
      throw error;
    }
  },

  // Get properties by owner
  async getPropertiesByOwner(ownerId: string) {
    try {
      const q = query(
        collection(db, 'properties'), 
        where('ownerId', '==', ownerId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];
    } catch (error) {
      console.error('Error getting owner properties:', error);
      throw error;
    }
  },

  // Update property (optionally replace images with provided URLs)
  async updateProperty(
    propertyId: string,
    propertyData: Partial<Property>,
    newImageUrls?: string[]
  ) {
    try {
      const propertyRef = doc(db, 'properties', propertyId);
      const updateData: any = {
        ...propertyData,
        updatedAt: serverTimestamp()
      };

      if (newImageUrls && newImageUrls.length > 0) {
        updateData.images = newImageUrls;
      }

      await updateDoc(propertyRef, updateData);
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  // Delete property (no storage cleanup required)
  async deleteProperty(propertyId: string) {
    try {
      await deleteDoc(doc(db, 'properties', propertyId));
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  },

  // Update property status (available/booked/sold)
  async updatePropertyStatus(propertyId: string, status: 'available' | 'booked' | 'sold') {
    try {
      const propertyRef = doc(db, 'properties', propertyId);
      await updateDoc(propertyRef, {
        status: status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating property status:', error);
      throw error;
    }
  }
}; 