import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import Map from '../components/Map';

const ContactPage: React.FC = () => {
  const faqItems = [
    {
      question: "How do I list my property on your website?",
      answer: "To list your property, simply click on the 'List Your Property' button in the navigation bar. You'll need to create an account if you don't have one already, then follow the step-by-step guide to add your property details."
    },
    {
      question: "Is there a fee for listing properties?",
      answer: "Basic listings are free. We also offer premium listing options with enhanced visibility and features for a small fee. You can view our pricing details on the listing page."
    },
    {
      question: "How long does it take to process a booking request?",
      answer: "Most booking requests are processed within 24 hours. Property owners have 48 hours to respond to booking requests before they expire."
    },
    {
      question: "Can I schedule a viewing before booking a property?",
      answer: "Yes, you can schedule a viewing for most properties. Contact the property owner or agent directly through the property details page to arrange a convenient time."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including credit/debit cards, bank transfers, and digital payment services. Specific payment options may vary depending on the property and owner preferences."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or need assistance? Our team is here to help. Fill out the form below or use our contact information to get in touch.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>
          
          {/* Contact Information & Map */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Address</h3>
                    <p className="text-gray-600">123 Property Street, Real Estate City, 10001</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">info@realestate.com</p>
                    <p className="text-gray-600">support@realestate.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">+1 (555) 987-6543</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Map address="123 Property Street, Real Estate City, 10001" />
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <details key={index} className="group border-b border-gray-200 pb-4">
                <summary className="list-none flex justify-between items-center cursor-pointer">
                  <h3 className="text-lg font-medium text-gray-800">{item.question}</h3>
                  <span className="text-blue-600 transition group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-gray-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ready to Find Your Dream Property?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our extensive collection of properties or list your own. We're here to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/properties" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
              Browse Properties
            </a>
            <a href="#" className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition duration-300">
              List Your Property
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;