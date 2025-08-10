export interface Agent {
  id: string;
  fullName: string;
  specialization: string;
  experienceYears?: number;
  phone: string;
  email: string;
  photoUrl: string;
  createdAt: Date;
  updatedAt: Date;
} 