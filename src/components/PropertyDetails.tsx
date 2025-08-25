import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Bed, Bath, Square, ArrowLeft, Phone, Mail, Share2, CreditCard } from 'lucide-react';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/Property';
import InquiryModal from './modals/InquiryModal';
import Lightbox from './modals/Lightbox';
import PaymentModal from './modals/PaymentModal';

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [paymentOpen, setPaymentOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadPropertyDetails();
    }
  }, [id]);

  const loadPropertyDetails = async () => {
    try {
      const allProperties = await propertyService.getAllProperties();
      const foundProperty = allProperties.find(p => p.id === id) || null;
      setProperty(foundProperty);

      if (foundProperty) {
        const near = allProperties
          .filter(p => p.id !== foundProperty.id)
          .filter(p => p.location?.split(',')[0]?.trim().toLowerCase() === foundProperty.location?.split(',')[0]?.trim().toLowerCase())
          .slice(0, 4);
        setSimilar(near);
      }
    } catch (error) {
      console.error('Error loading property details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const mapQuery = encodeURIComponent(property.location || '');
  const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Properties
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-2xl cursor-pointer"
                  onClick={() => { setLightboxIndex(currentImageIndex); setLightboxOpen(true); }}
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🏠</div>
                    <p className="text-gray-500">No images available</p>
                  </div>
                </div>
              )}

              {property.images && property.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform flex space-x-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {property.images && property.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => { setCurrentImageIndex(index); setLightboxIndex(index); setLightboxOpen(true); }}
                    className={`relative overflow-hidden rounded-lg ${
                      index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${property.title} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                {property.status && property.status !== 'available' && (
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    property.status === 'booked' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-red-600 text-white'
                  }`}>
                    {property.status === 'booked' ? 'Booked' : 'Sold'}
                  </div>
                )}
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.location}</span>
              </div>
                              <div className="text-3xl font-bold text-blue-600 mb-4">
                  Pkr {property.price.toLocaleString()}
                </div>
            </div>

            {/* Property Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-gray-200">
              {property.bedrooms && (
                <div className="text-center">
                  <Bed className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-lg font-semibold">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
              )}
              {property.bathrooms && (
                <div className="text-center">
                  <Bath className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-lg font-semibold">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
              )}
              {property.area && (
                <div className="text-center">
                  <Square className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-lg font-semibold">{property.area}</div>
                  <div className="text-sm text-gray-600">Sq Ft</div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Property Type */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Property Type:</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {(() => {
                  const t = property.propertyType || '';
                  return t ? t.charAt(0).toUpperCase() + t.slice(1) : 'Property';
                })()}
              </span>
            </div>

            {/* Contact Actions */}
            <div className="flex space-x-4 pt-6">
              <button
                onClick={() => setInquiryOpen(true)}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <Mail className="h-5 w-5 mr-2" />
                Send Message
              </button>
              <button
                onClick={() => setPaymentOpen(true)}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Make Payment
              </button>
              <button className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Location & nearby facilities */}
        <section className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Location and nearby facilities</h3>
          <div className="w-full overflow-hidden rounded-xl border">
            <iframe
              title="map"
              src={mapSrc}
              className="h-[360px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* Similar properties nearby */}
        <section className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Similar properties nearby</h3>
          {similar.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similar.map(sp => (
                <div key={sp.id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                  {sp.images?.[0] ? (
                    <img src={sp.images[0]} alt={sp.title} className="h-40 w-full object-cover" />
                  ) : (
                    <div className="h-40 w-full bg-gray-100 flex items-center justify-center">No Image</div>
                  )}
                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-1">{sp.location}</div>
                    <h4 className="font-semibold text-gray-900 truncate mb-2">{sp.title}</h4>
                    <div className="text-blue-600 font-bold mb-3">Pkr {sp.price.toLocaleString()}</div>
                    <button onClick={() => navigate(`/property/${sp.id}`)} className="text-sm text-white bg-blue-600 px-3 py-2 rounded hover:bg-blue-700">View</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No similar properties found.</div>
          )}
        </section>
      </div>

      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        propertyId={id!}
        propertyTitle={property.title}
      />

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        propertyId={id!}
        propertyTitle={property.title}
        amount={property.price}
      />

      <Lightbox
        open={lightboxOpen}
        images={property.images || []}
        index={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onIndex={setLightboxIndex}
      />
    </div>
  );
} 