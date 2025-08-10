import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bed, Bath, Ruler, Star, Phone, Mail, MapPin } from 'lucide-react';
import PropertyGallery from '../components/PropertyGallery';
import Map from '../components/Map';
import { properties, Property } from '../data/properties';

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const foundProperty = properties.find(p => p.id === parseInt(id || '0'));
    setProperty(foundProperty || null);
    
    // Scroll to top when property changes
    window.scrollTo(0, 0);
  }, [id]);
  
  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/properties" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            View All Properties
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Property Gallery */}
        <PropertyGallery images={property.images} title={property.title} />
        
        {/* Property Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
            <div className="flex items-center text-gray-600 mb-1">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              <span>{property.location}</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span className="font-medium">{property.rating}</span>
              </div>
              <span className="text-gray-500">({property.reviews.length} reviews)</span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              Rs. {property.price}
              <span className="text-sm text-gray-500 font-normal">
                {property.type === 'Hotel' || property.type === 'Hostel' ? '/night' : '/month'}
              </span>
            </div>
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
              {property.type}
            </span>
          </div>
        </div>
        
        {/* Property Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Key Details */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Property Details</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Bed className="h-6 w-6 text-blue-600 mb-2" />
                  <span className="text-lg font-medium">{property.bedrooms}</span>
                  <span className="text-gray-500 text-sm">Bedrooms</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Bath className="h-6 w-6 text-blue-600 mb-2" />
                  <span className="text-lg font-medium">{property.bathrooms}</span>
                  <span className="text-gray-500 text-sm">Bathrooms</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Ruler className="h-6 w-6 text-blue-600 mb-2" />
                  <span className="text-lg font-medium">{property.area}</span>
                  <span className="text-gray-500 text-sm">Sq Ft</span>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>
            
            {/* Amenities */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Location */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Location</h2>
              <Map address={property.location} />
            </div>
            
            {/* Reviews */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Reviews</h2>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="font-medium">{property.rating}</span>
                  <span className="text-gray-500 ml-1">({property.reviews.length} reviews)</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {property.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start">
                      <img 
                        src={review.userImage} 
                        alt={review.user} 
                        className="h-10 w-10 rounded-full object-cover mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{review.user}</h4>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span>{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Owner/Agent Info */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Contact Owner</h2>
              <div className="flex items-center mb-4">
                <img 
                  src={property.owner.image} 
                  alt={property.owner.name} 
                  className="h-16 w-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-medium">{property.owner.name}</h4>
                  <p className="text-gray-500 text-sm">Property Owner</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-3" />
                  <span>{property.owner.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-600 mr-3" />
                  <span>{property.owner.email}</span>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <Mail className="h-5 w-5 mr-2" />
                Contact Owner
              </button>
            </div>
            
            {/* Book/Reserve Box */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {property.type === 'Hotel' || property.type === 'Hostel' ? 'Book Now' : 'Schedule a Visit'}
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {property.type === 'Hotel' || property.type === 'Hostel' ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check In
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                        {[...Array(24)].map((_, i) => (
                          <option key={i} value={`${i}:00`}>{`${i}:00`}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check Out
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                        {[...Array(24)].map((_, i) => (
                          <option key={i} value={`${i}:00`}>{`${i}:00`}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guests
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                      {[...Array(10)].map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1} {i === 0 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Book Now
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                      {[...Array(24)].map((_, i) => (
                        <option key={i} value={`${i}:00`}>{`${i}:00`}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Schedule Visit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;