import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface FilterSidebarProps {
  onFilter: (filters: FilterOptions) => void;
  isOpen: boolean;
  onClose: () => void;
}

export interface FilterOptions {
  location: string;
  type: string;
  priceMin: number;
  priceMax: number;
  beds: number;
  baths: number;
  rating: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilter, isOpen, onClose }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    location: '',
    type: '',
    priceMin: 0,
    priceMax: 10000,
    beds: 0,
    baths: 0,
    rating: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name === 'priceMin' || name === 'priceMax' || name === 'beds' || name === 'baths' || name === 'rating' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      type: '',
      priceMin: 0,
      priceMax: 10000,
      beds: 0,
      baths: 0,
      rating: 0
    });
  };

  return (
    <div className={`fixed md:static inset-0 bg-white z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:bg-transparent md:z-auto`}>
      <div className="p-4 md:p-6 overflow-y-auto h-full">
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="location"
                  placeholder="Any location"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={filters.location}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                name="type"
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={filters.type}
                onChange={handleChange}
              >
                <option value="">Any Type</option>
                <option value="Home">Home</option>
                <option value="Flat">Flat</option>
                <option value="Hotel">Hotel</option>
                <option value="Hostel">Hostel</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    name="priceMin"
                    placeholder="Min"
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={filters.priceMin}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="priceMax"
                    placeholder="Max"
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={filters.priceMax}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <select
                name="beds"
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={filters.beds}
                onChange={handleChange}
              >
                <option value="0">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <select
                name="baths"
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={filters.baths}
                onChange={handleChange}
              >
                <option value="0">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <select
                name="rating"
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={filters.rating}
                onChange={handleChange}
              >
                <option value="0">Any</option>
                <option value="3">3+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterSidebar;