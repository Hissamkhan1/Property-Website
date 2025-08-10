export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  ownerId: string;
  ownerEmail: string;
  createdAt: Date;
  updatedAt: Date;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  propertyType?: 'house' | 'apartment' | 'condo' | 'villa';
} 