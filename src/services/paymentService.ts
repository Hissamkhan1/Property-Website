import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { PaymentDetails, EasyPaisaPayment, BankTransferPayment, PaymentStatus } from '../types/Payment';

export const paymentService = {
  // Create EasyPaisa payment
  async createEasyPaisaPayment(paymentData: EasyPaisaPayment): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'payments'), {
        propertyId: paymentData.propertyId,
        propertyTitle: paymentData.propertyTitle,
        amount: paymentData.amount,
        paymentMethod: 'easypaisa',
        status: 'pending',
        customerName: paymentData.customerName,
        customerEmail: paymentData.customerEmail,
        customerPhone: paymentData.phoneNumber,
        easypaisaNumber: paymentData.phoneNumber,
        notes: paymentData.description,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating EasyPaisa payment:', error);
      throw error;
    }
  },

  // Create bank transfer payment
  async createBankTransferPayment(paymentData: BankTransferPayment): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'payments'), {
        propertyId: paymentData.propertyId,
        propertyTitle: paymentData.propertyTitle,
        amount: paymentData.amount,
        paymentMethod: 'bank_transfer',
        status: 'pending',
        customerName: paymentData.customerName,
        customerEmail: paymentData.customerEmail,
        customerPhone: paymentData.customerPhone,
        bankAccountNumber: paymentData.accountNumber,
        bankName: paymentData.bankName,
        transactionId: paymentData.transactionReference,
        notes: `Bank transfer to ${paymentData.accountHolderName}`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating bank transfer payment:', error);
      throw error;
    }
  },

  // Update payment status
  async updatePaymentStatus(paymentId: string, status: PaymentStatus, transactionId?: string): Promise<void> {
    try {
      const paymentRef = doc(db, 'payments', paymentId);
      const updateData: any = {
        status: status,
        updatedAt: serverTimestamp()
      };
      
      if (transactionId) {
        updateData.transactionId = transactionId;
      }
      
      await updateDoc(paymentRef, updateData);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  // Get all payments (for admin)
  async getAllPayments(): Promise<PaymentDetails[]> {
    try {
      const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PaymentDetails[];
    } catch (error) {
      console.error('Error getting payments:', error);
      throw error;
    }
  },

  // Get payments by property
  async getPaymentsByProperty(propertyId: string): Promise<PaymentDetails[]> {
    try {
      const q = query(
        collection(db, 'payments'),
        where('propertyId', '==', propertyId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PaymentDetails[];
    } catch (error) {
      console.error('Error getting property payments:', error);
      throw error;
    }
  },

  // Get payments by customer email
  async getPaymentsByCustomer(email: string): Promise<PaymentDetails[]> {
    try {
      const q = query(
        collection(db, 'payments'),
        where('customerEmail', '==', email),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PaymentDetails[];
    } catch (error) {
      console.error('Error getting customer payments:', error);
      throw error;
    }
  }
};
