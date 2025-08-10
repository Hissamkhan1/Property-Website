import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { Property } from '../data/properties';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { id, title, price, location, image, bedrooms, bathrooms, area, rating, type } = property;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/property/${id}`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
            {type}
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{title}</h3>
          <p className="text-blue-600 font-bold">Rs. {price}<span className="text-xs text-gray-500">{type === 'Hotel' || type === 'Hostel' ? '/night' : '/month'}</span></p>
        </div>
        
        <div className="flex items-center text-gray-500 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <span className="font-medium">{bedrooms}</span>
            <span className="mx-1">Beds</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">{bathrooms}</span>
            <span className="mx-1">Baths</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">{area}</span>
            <span className="mx-1">sqft</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
          <Link 
            to={`/property/${id}`} 
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;