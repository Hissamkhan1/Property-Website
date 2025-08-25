export type PaymentMethod = 'easypaisa' | 'bank_transfer' | 'cash';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface PaymentDetails {
  id: string;
  propertyId: string;
  propertyTitle: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  transactionId?: string;
  easypaisaNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EasyPaisaPayment {
  amount: number;
  phoneNumber: string;
  description: string;
  propertyId: string;
  propertyTitle: string;
  customerName: string;
  customerEmail: string;
}

export interface BankTransferPayment {
  amount: number;
  accountNumber: string;
  bankName: string;
  accountHolderName: string;
  propertyId: string;
  propertyTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  transactionReference?: string;
}
