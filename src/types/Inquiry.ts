export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
  status?: 'new' | 'seen' | 'contacted';
} 