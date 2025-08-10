import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/Property';

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      const allProperties = await propertyService.getAllProperties();
      setProperties(allProperties);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  }

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading properties...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Properties</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div 
            key={property.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => handlePropertyClick(property.id)}
          >
            {property.images && property.images.length > 0 && (
              <div className="relative overflow-hidden">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                    Click to view details
                  </div>
                </div>
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {property.title}
              </h3>
              <p className="text-gray-600 mb-2">{property.location}</p>
              <p className="text-2xl font-bold text-green-600 mb-4">
                ${property.price.toLocaleString()}
              </p>
              <p className="text-gray-700 mb-4">{property.description}</p>
              {property.bedrooms && property.bathrooms && (
                <div className="flex space-x-4 text-sm text-gray-600">
                  <span>{property.bedrooms} beds</span>
                  <span>{property.bathrooms} baths</span>
                  {property.area && <span>{property.area} sq ft</span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No properties available at the moment.
        </div>
      )}
    </div>
  );
}