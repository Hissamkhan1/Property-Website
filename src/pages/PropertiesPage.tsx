import React, { useState, useEffect } from 'react';
import { Filter, LayoutGrid } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar, { FilterOptions } from '../components/FilterSidebar';
import { properties, Property } from '../data/properties';

const PropertiesPage: React.FC = () => {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const location = useLocation();

  // Helper function to filter properties by search query
  const filterBySearch = (properties: Property[], searchParam: string): Property[] => {
    const searchQueryLower = searchParam.toLowerCase().trim();
    return properties.filter(property => {
      // Search in title
      const titleMatch = property.title.toLowerCase().includes(searchQueryLower);
      
      // Search in location
      const locationMatch = property.location.toLowerCase().includes(searchQueryLower);
      
      // Search in property type
      const typeMatch = property.type.toLowerCase().includes(searchQueryLower);
      
      // Search in description
      const descriptionMatch = property.description.toLowerCase().includes(searchQueryLower);
      
      // Search in amenities
      const amenitiesMatch = property.amenities.some(amenity => 
        amenity.toLowerCase().includes(searchQueryLower)
      );
      
      // Search by area (if search term is a number or contains area-related keywords)
      const areaMatch = searchQueryLower.includes('sqft') || searchQueryLower.includes('sq ft') || 
                       searchQueryLower.includes('area') || searchQueryLower.includes('size') ||
                       (!isNaN(Number(searchQueryLower)) && property.area.toString().includes(searchQueryLower));
      
      // Search by bedrooms (if search contains bedroom-related keywords)
      const bedroomMatch = (searchQueryLower.includes('bed') || searchQueryLower.includes('room')) &&
                          property.bedrooms.toString().includes(searchQueryLower.replace(/[^0-9]/g, ''));
      
      // Search by bathrooms (if search contains bathroom-related keywords)
      const bathroomMatch = (searchQueryLower.includes('bath') || searchQueryLower.includes('toilet')) &&
                           property.bathrooms.toString().includes(searchQueryLower.replace(/[^0-9]/g, ''));
      
      return titleMatch || locationMatch || typeMatch || descriptionMatch || 
             amenitiesMatch || areaMatch || bedroomMatch || bathroomMatch;
    });
  };

  useEffect(() => {
    // Check for query params on initial load
    const params = new URLSearchParams(location.search);
    const typeParam = params.get('type');
    const searchParam = params.get('search');
    
    let filtered = [...properties];
    
    // Apply type filter if present
    if (typeParam) {
      filtered = filtered.filter(property => 
        property.type === typeParam
      );
    }
    
    // Apply search filter if present
    if (searchParam) {
      setSearchQuery(searchParam);
      filtered = filterBySearch(filtered, searchParam);
    } else {
      setSearchQuery('');
    }
    
    setFilteredProperties(filtered);
  }, [location.search]);

  const handleFilterApply = (filters: FilterOptions) => {
    // Start with all properties
    let filtered = [...properties];
    
    // Apply search parameter first if it exists
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    
    if (searchParam) {
      filtered = filterBySearch(filtered, searchParam);
    }
    
    // Apply sidebar filters
    if (filters.location) {
      filtered = filtered.filter(property => 
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.type) {
      filtered = filtered.filter(property => property.type === filters.type);
    }
    
    if (filters.priceMin > 0) {
      filtered = filtered.filter(property => property.price >= filters.priceMin);
    }
    
    if (filters.priceMax < 10000) {
      filtered = filtered.filter(property => property.price <= filters.priceMax);
    }
    
    if (filters.beds > 0) {
      filtered = filtered.filter(property => property.bedrooms >= filters.beds);
    }
    
    if (filters.baths > 0) {
      filtered = filtered.filter(property => property.bathrooms >= filters.baths);
    }
    
    if (filters.rating > 0) {
      filtered = filtered.filter(property => property.rating >= filters.rating);
    }
    
    setFilteredProperties(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Search: "${searchQuery}"` : 'Properties'}
              </h1>
              {searchQuery && (
                <p className="text-gray-600 text-sm mt-1">
                  {filteredProperties.length} results found
                </p>
              )}
            </div>
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center bg-white px-4 py-2 rounded-lg border border-gray-300 shadow-sm"
            >
              <Filter className="h-5 w-5 mr-2" />
              <span>Filter</span>
            </button>
          </div>
          
          {/* Sidebar */}
          <div className="md:w-1/4 lg:w-1/5">
            <div className="hidden md:block sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Filters</h2>
              <FilterSidebar 
                onFilter={handleFilterApply} 
                isOpen={isFilterOpen} 
                onClose={() => setIsFilterOpen(false)} 
              />
            </div>
          </div>
          
          {/* Mobile Sidebar */}
          <div className="md:hidden">
            <FilterSidebar 
              onFilter={handleFilterApply} 
              isOpen={isFilterOpen} 
              onClose={() => setIsFilterOpen(false)} 
            />
          </div>
          
          {/* Main Content */}
          <div className="md:w-3/4 lg:w-4/5">
            <div className="hidden md:flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'Properties'}
                </h1>
                {searchQuery && (
                  <p className="text-gray-600 mt-1">
                    Showing results for homes, flats, hostels, and hotels
                  </p>
                )}
              </div>
              
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">
                  {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
                </span>
                <div className="ml-4 flex items-center bg-white px-3 py-2 rounded-lg border border-gray-300">
                  <LayoutGrid className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>
            
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;