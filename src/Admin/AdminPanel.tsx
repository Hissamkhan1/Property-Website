import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { propertyService } from '../services/propertyService';
import { agentService } from '../services/agentService';
import { inquiryService } from '../services/inquiryService';
import { Property } from '../types/Property';
import { Agent } from '../types/Agent';
import { Inquiry } from '../types/Inquiry';
import AddPropertyForm from './AddPropertyForm';
import AgentForm from './AgentForm';

export default function AdminPanel() {
  const { currentUser, logout } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | undefined>(undefined);

  useEffect(() => {
    Promise.all([loadProperties(), loadAgents(), loadInquiries()]).finally(() => setLoading(false));
  }, []);

  async function loadProperties() {
    try {
      const all = await propertyService.getAllProperties();
      setProperties(all);
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  }

  async function loadAgents() {
    try {
      const list = await agentService.getAgents();
      setAgents(list);
    } catch (error) {
      console.error('Error loading agents:', error);
    }
  }

  async function loadInquiries() {
    try {
      const list = await inquiryService.getInquiries();
      setInquiries(list);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDeleteProperty(propertyId: string) {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertyService.deleteProperty(propertyId);
        await loadProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  }

  async function handleDeleteAgent(agentId: string) {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await agentService.deleteAgent(agentId);
        await loadAgents();
      } catch (error) {
        console.error('Error deleting agent:', error);
      }
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Add New Property
          </button>
          <button
            onClick={() => { setEditingAgent(undefined); setShowAgentForm(true); }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add Agent
          </button>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {showAddForm && (
        <AddPropertyForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            loadProperties();
          }}
        />
      )}

      {showAgentForm && (
        <AgentForm
          onClose={() => setShowAgentForm(false)}
          onSuccess={() => { setShowAgentForm(false); loadAgents(); }}
          initialAgent={editingAgent}
        />
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Listed Properties</h2>
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-gray-50 rounded-lg p-4 border">
                {property.images && property.images.length > 0 && (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-2">{property.location}</p>
                  <p className="text-2xl font-bold text-green-600 mb-4">${property.price.toLocaleString()}</p>
                  <p className="text-gray-700 mb-4 line-clamp-2">{property.description}</p>
                  {property.bedrooms && property.bathrooms && (
                    <div className="flex space-x-4 text-sm text-gray-600 mb-4">
                      <span>{property.bedrooms} beds</span>
                      <span>{property.bathrooms} baths</span>
                      {property.area && <span>{property.area} sq ft</span>}
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Edit</button>
                    <button onClick={() => handleDeleteProperty(property.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No properties found.</div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Agents</h2>
        </div>
        {agents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img src={agent.photoUrl} alt={agent.fullName} className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{agent.fullName}</h3>
                    <p className="text-sm text-blue-700 font-medium">{agent.specialization}</p>
                  </div>
                </div>
                {agent.experienceYears !== undefined && (
                  <p className="text-sm text-gray-600 mb-2">Experience: {agent.experienceYears} years</p>
                )}
                <p className="text-sm text-gray-700">📞 {agent.phone}</p>
                <p className="text-sm text-gray-700 mb-4">✉️ {agent.email}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => { setEditingAgent(agent); setShowAgentForm(true); }}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAgent(agent.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No agents added yet.</div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Inquiries</h2>
        {inquiries.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-gray-600">
                <tr>
                  <th className="px-3 py-2">When</th>
                  <th className="px-3 py-2">Property</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Phone</th>
                  <th className="px-3 py-2">Message</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((q) => (
                  <tr key={q.id} className="border-t">
                    <td className="px-3 py-2">{(q.createdAt as any)?.toDate?.()?.toLocaleString?.() || ''}</td>
                    <td className="px-3 py-2">{q.propertyTitle}</td>
                    <td className="px-3 py-2">{q.name}</td>
                    <td className="px-3 py-2">{q.email}</td>
                    <td className="px-3 py-2">{q.phone}</td>
                    <td className="px-3 py-2 max-w-[320px] truncate">{q.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-500">No inquiries yet.</div>
        )}
      </div>
    </div>
  );
} 