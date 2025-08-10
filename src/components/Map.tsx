import React from 'react';
import { MapPin } from 'lucide-react';

interface MapProps {
  address: string;
}

const Map: React.FC<MapProps> = ({ address }) => {
  // In a real implementation, this would use Google Maps or another mapping API
  // For this demo, we'll create a placeholder map
  
  return (
    <div className="bg-gray-200 rounded-lg overflow-hidden shadow-md">
      <div className="bg-blue-50 p-6 h-[300px] flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 opacity-20 bg-blue-200 grid grid-cols-8 grid-rows-6">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-blue-300"></div>
          ))}
        </div>
        
        <div className="relative z-10 text-center">
          <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-3 animate-bounce" />
          <div className="bg-white px-4 py-2 rounded-full shadow-lg inline-flex items-center">
            <span className="text-gray-800 font-medium">{address}</span>
          </div>
        </div>
        
        <div className="absolute bottom-4 right-4 bg-white rounded-md shadow px-3 py-2 text-xs text-gray-500">
          Map data would appear here in production
        </div>
      </div>
    </div>
  );
};

export default Map;