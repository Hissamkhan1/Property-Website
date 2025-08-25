import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Home as HomeIcon, Star, MapPin, Building, ChevronRight, Phone, Mail } from 'lucide-react';
import { propertyService } from '../services/propertyService';
import { agentService } from '../services/agentService';
import { Property } from '../types/Property';
import { Agent } from '../types/Agent';

// Animated counter that starts when it enters the viewport
function CountUp({ end, duration = 1200, suffix = '+', className = '' }: { end: number; duration?: number; suffix?: string; className?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start: number | null = null;
    const from = 0;
    const to = end;
    const durationMs = Math.max(300, duration);

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.round(from + (to - from) * eased);
      setValue(current);
      if (progress < 1) requestAnimationFrame(step);
    };

    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [started, end, duration]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString()}{suffix}
    </span>
  );
}

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState({
    location: '',
    price: '',
    propertyType: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([loadProperties(), loadAgents()]).finally(() => setLoading(false));
  }, []);

  async function loadProperties() {
    try {
      const allPropertiesData = await propertyService.getAllProperties();
      setAllProperties(allPropertiesData);
      setProperties(allPropertiesData.slice(0, 6));
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  }

  async function loadAgents() {
    try {
      const list = await agentService.getAgents();
      setAgents(list.slice(0, 6));
    } catch (error) {
      console.error('Error loading agents:', error);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    let filteredProperties = allProperties;
    if (searchData.location.trim()) {
      filteredProperties = filteredProperties.filter(property =>
        property.location.toLowerCase().includes(searchData.location.toLowerCase())
      );
    }
    if (searchData.propertyType) {
      filteredProperties = filteredProperties.filter(property =>
        property.propertyType === searchData.propertyType
      );
    }
    if (searchData.price) {
      const [minPrice, maxPrice] = searchData.price.split('-').map(Number);
      filteredProperties = filteredProperties.filter(property => {
        if (searchData.price === '500000+') {
          return property.price >= 500000;
        } else if (maxPrice) {
          return property.price >= minPrice && property.price <= maxPrice;
        }
        return true;
      });
    }
    setProperties(filteredProperties);
    setIsSearching(false);
    if (filteredProperties.length > 0) {
      document.getElementById('properties-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearSearch = () => {
    setSearchData({ location: '', price: '', propertyType: '' });
    setProperties(allProperties.slice(0, 6));
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section with Background Image */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80')] bg-cover bg-center bg-no-repeat opacity-30"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Discover Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Dream Home
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience luxury living with our curated collection of premium properties. 
            Where elegance meets comfort, and dreams become reality.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={searchData.location}
                    onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 flex items-center justify-center text-sm">₨</span>
                  <select
                    value={searchData.price}
                    onChange={(e) => setSearchData({...searchData, price: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="">Price Range</option>
                    <option value="0-100000">Pkr 0 - 100,000</option>
                    <option value="100000-300000">Pkr 100,000 - 300,000</option>
                    <option value="300000-500000">Pkr 300,000 - 500,000</option>
                    <option value="500000+">Pkr 500,000+</option>
                  </select>
                </div>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    value={searchData.propertyType}
                    onChange={(e) => setSearchData({...searchData, propertyType: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  >
                    <option value="">Property Type</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="villa">Villa</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Searching...
                    </div>
                  ) : (
                    <>
                      <Search className="inline-block h-5 w-5 mr-2" />
                      Search
                    </>
                  )}
                </button>
              </div>
              
              {/* Search Results Info */}
              {(searchData.location || searchData.price || searchData.propertyType) && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-700 font-medium">
                    {properties.length > 0 ? (
                      `Found ${properties.length} propert${properties.length !== 1 ? 'ies' : 'y'}`
                    ) : (
                      'No properties found'
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                <CountUp end={500} />
              </div>
              <div className="text-gray-600">Properties Sold</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                <CountUp end={1000} />
              </div>
              <div className="text-gray-600">Happy Clients</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-yellow-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                <CountUp end={50} />
              </div>
              <div className="text-gray-600">Expert Agents</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                <CountUp end={15} />
              </div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section id="properties-section" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {(searchData.location || searchData.price || searchData.propertyType) 
                ? 'Search Results' 
                : 'Featured Properties'
              }
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {(searchData.location || searchData.price || searchData.propertyType) 
                ? `Properties matching your search criteria`
                : 'Discover our handpicked selection of premium properties that combine luxury, comfort, and exceptional value.'
              }
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading premium properties...</p>
            </div>
          ) : properties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property) => (
                  <div 
                    key={property.id} 
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden cursor-pointer"
                    onClick={() => handlePropertyClick(property.id)}
                  >
                    <div className="relative overflow-hidden">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDMyMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgOTZDMjEwLjU2IDk2IDI1MiAxMzcuNDQgMjUyIDE4OEMyNTIgMjM4LjU2IDIxMC41NiAyODAgMTYwIDI4MEMxMDkuNDQgMjgwIDY4IDIzOC41NiA2OCAxODhDNjggMTM3LjQ0IDEwOS40NCA5NiAxNjAgOTZaIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgMTEyQzE4NC4xODQgMTEyIDIwNCAxMzEuODQgMjA0IDEwOEMyMDQgODQuMTYgMTg0LjE4NCA2NCAxNjAgNjRDMTM1LjgxNiA2NCAxMTYgODQuMTYgMTE2IDEwOEMxMTYgMTMxLjg0IDEzNS44MTYgMTEyIDE2MCAxMTJaIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=';
                          }}
                        />
                      ) : (
                        <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <HomeIcon className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 flex flex-col space-y-2">
                        <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                          {(() => {
                            const t = property.propertyType || '';
                            return t ? t.charAt(0).toUpperCase() + t.slice(1) : 'Property';
                          })()}
                        </div>
                        {property.status && property.status !== 'available' && (
                          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            property.status === 'booked' 
                              ? 'bg-yellow-600 text-white' 
                              : 'bg-red-600 text-white'
                          }`}>
                            {property.status === 'booked' ? 'Booked' : 'Sold'}
                          </div>
                        )}
                      </div>
                      {/* Arrow overlay on image */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <ChevronRight className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110" />
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {property.title}
                        </h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">4.8</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{property.location}</span>
                      </div>
                      
                      <p className="text-gray-700 mb-4 line-clamp-2">{property.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold text-blue-600">
                          Pkr {property.price.toLocaleString()}
                        </div>
                        {property.bedrooms && property.bathrooms && (
                          <div className="flex space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <span className="font-semibold">{property.bedrooms}</span> beds
                            </span>
                            <span className="flex items-center">
                              <span className="font-semibold">{property.bathrooms}</span> baths
                            </span>
                            {property.area && (
                              <span className="flex items-center">
                                <span className="font-semibold">{property.area}</span> sq ft
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePropertyClick(property.id);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Show "View All" only if not searching */}
              {!(searchData.location || searchData.price || searchData.propertyType) && (
                <div className="text-center mt-12">
                  <Link
                    to="/properties"
                    className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    View All Properties
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl p-12 shadow-lg max-w-md mx-auto">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Properties Found</h3>
                <p className="text-gray-600 mb-8">
                  {searchData.location || searchData.price || searchData.propertyType
                    ? "Try adjusting your search criteria or browse all properties."
                    : "Be the first to list a premium property on our platform!"
                  }
                </p>
                <div className="space-y-3">
                  {searchData.location || searchData.price || searchData.propertyType ? (
                    <>
                      <button
                        onClick={clearSearch}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
                      >
                        Clear Search
                      </button>
                      <Link
                        to="/properties"
                        className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300"
                      >
                        Browse All Properties
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                    >
                      List Your Property
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Agents Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet Our Expert Agents
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our certified real estate professionals are here to guide you through every step of your property journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center group hover:shadow-xl transition-all duration-300">
                <div className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden ring-2 ring-white">
                  <img src={agent.photoUrl} alt={agent.fullName} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{agent.fullName}</h3>
                <p className="text-blue-600 font-semibold mb-4">{agent.specialization}</p>
                {agent.experienceYears !== undefined && (
                  <p className="text-sm text-gray-600 mb-2">Experience: {agent.experienceYears} years</p>
                )}
                <div className="flex items-center justify-center space-x-3 mb-4 text-sm text-gray-700">
                  <span>📞 {agent.phone}</span>
                  <span>•</span>
                  <span>✉️ {agent.email}</span>
                </div>
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-2 text-sm text-gray-600">5.0 (120 reviews)</span>
                </div>
                <div className="flex justify-center space-x-4">
                  <a href={`tel:${agent.phone}`} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300">
                    <Phone className="h-4 w-4" />
                  </a>
                  <a href={`mailto:${agent.email}`} className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-300">
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of satisfied clients who found their perfect property with us. 
            Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Browse Properties
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 