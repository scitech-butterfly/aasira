
import React, { useState, useEffect } from 'react';
import type { Organization, Event, User } from '../types';

const NEW_EVENT_TEMPLATE: Omit<Event, 'id'> = { title: '', day: '', date: '', time: '' };
const NEW_ORG_TEMPLATE: Omit<Organization, 'id'> = { name: '', description: '', events: [] };

// Modal Component for Add/Edit Organization
const OrgModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (org: Organization) => void;
  orgToEdit: Organization | null;
}> = ({ isOpen, onClose, onSave, orgToEdit }) => {
  const [orgData, setOrgData] = useState<Organization>(
    orgToEdit || { ...NEW_ORG_TEMPLATE, id: crypto.randomUUID(), events: [] }
  );

  useEffect(() => {
    setOrgData(orgToEdit || { ...NEW_ORG_TEMPLATE, id: crypto.randomUUID(), events: [] });
  }, [orgToEdit, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrgData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEventChange = (eventId: string, field: keyof Event, value: string) => {
    setOrgData(prev => ({
      ...prev,
      events: prev.events.map(event => event.id === eventId ? { ...event, [field]: value } : event)
    }));
  };

  const addEvent = () => {
    setOrgData(prev => ({
      ...prev,
      events: [...prev.events, { ...NEW_EVENT_TEMPLATE, id: crypto.randomUUID() }]
    }));
  };
  
  const removeEvent = (eventId: string) => {
    setOrgData(prev => ({
      ...prev,
      events: prev.events.filter(event => event.id !== eventId)
    }));
  };

  const handleSave = () => {
    if (orgData.name) {
      onSave(orgData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-nexus-purple mb-4">{orgToEdit ? 'Edit' : 'Add'} Organization</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-nexus-brown">Organization Name</label>
              <input type="text" name="name" value={orgData.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-nexus-pink focus:border-nexus-pink bg-white text-nexus-brown placeholder:text-gray-400" placeholder="e.g. CARE NGO"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-nexus-brown">Description</label>
              <textarea name="description" value={orgData.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-nexus-pink focus:border-nexus-pink bg-white text-nexus-brown placeholder:text-gray-400" placeholder="A short description of the organization."></textarea>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold text-nexus-purple mb-2">Events</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {orgData.events.map((event) => (
                <div key={event.id} className="p-3 bg-nexus-sky/50 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-3 relative">
                   <button onClick={() => removeEvent(event.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                   </button>
                  <input type="text" placeholder="Title" value={event.title} onChange={e => handleEventChange(event.id, 'title', e.target.value)} className="w-full border-gray-300 rounded-md text-sm p-2 bg-white text-nexus-brown placeholder:text-gray-400"/>
                  <input type="text" placeholder="Day (e.g., Every Sunday)" value={event.day} onChange={e => handleEventChange(event.id, 'day', e.target.value)} className="w-full border-gray-300 rounded-md text-sm p-2 bg-white text-nexus-brown placeholder:text-gray-400"/>
                  <input type="text" placeholder="Date (e.g., Oct 26th)" value={event.date} onChange={e => handleEventChange(event.id, 'date', e.target.value)} className="w-full border-gray-300 rounded-md text-sm p-2 bg-white text-nexus-brown placeholder:text-gray-400"/>
                  <input type="text" placeholder="Time (e.g., 10:00 AM)" value={event.time} onChange={e => handleEventChange(event.id, 'time', e.target.value)} className="w-full border-gray-300 rounded-md text-sm p-2 bg-white text-nexus-brown placeholder:text-gray-400"/>
                </div>
              ))}
            </div>
            <button onClick={addEvent} className="mt-4 text-sm font-medium text-nexus-pink hover:text-opacity-80">+ Add Event</button>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-nexus-pink border border-transparent rounded-md shadow-sm hover:bg-opacity-90">Save</button>
        </div>
      </div>
    </div>
  );
};

interface OrganizationsViewProps {
  currentUser: User;
}

export const OrganizationsView: React.FC<OrganizationsViewProps> = ({ currentUser }) => {
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    try {
      const savedOrgs = localStorage.getItem('aasiraOrganizations');
      return savedOrgs ? JSON.parse(savedOrgs) : [];
    } catch (error) {
      console.error("Failed to parse organizations from localStorage", error);
      localStorage.removeItem('aasiraOrganizations');
      return [];
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  const isOrganizer = currentUser.role === 'organizer';

  useEffect(() => {
    localStorage.setItem('aasiraOrganizations', JSON.stringify(organizations));
  }, [organizations]);

  const handleOpenModal = (org: Organization | null = null) => {
    setEditingOrg(org);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrg(null);
  };

  const handleSaveOrg = (orgToSave: Organization) => {
    if (organizations.some(o => o.id === orgToSave.id)) {
      setOrganizations(prev => prev.map(o => o.id === orgToSave.id ? orgToSave : o));
    } else {
      setOrganizations(prev => [...prev, orgToSave]);
    }
    handleCloseModal();
  };

  const handleDeleteOrg = (orgId: string) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      setOrganizations(prev => prev.filter(o => o.id !== orgId));
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-nexus-purple">Organizations & Events</h1>
        {isOrganizer && (
          <button onClick={() => handleOpenModal()} className="bg-nexus-pink text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-opacity-90 transition-transform transform hover:scale-105">
            + Add Organization
          </button>
        )}
      </div>

      <p className="mb-8 text-nexus-brown/80 max-w-3xl">
        {isOrganizer ? "Manage partner organizations and their upcoming events and classes." : "Explore local organizations and their events."}
      </p>

      <div className="space-y-8">
        {organizations.length > 0 ? (
          organizations.map(org => (
            <div key={org.id} className="bg-white p-6 md:p-8 rounded-lg shadow-lg border-t-4 border-nexus-pink relative">
              {isOrganizer && (
                <div className="absolute top-4 right-4 flex space-x-2">
                   <button onClick={() => handleOpenModal(org)} className="p-2 rounded-full bg-nexus-light-blue/50 hover:bg-nexus-light-blue text-nexus-purple">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path></svg>
                   </button>
                   <button onClick={() => handleDeleteOrg(org.id)} className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                   </button>
                </div>
              )}
              <h2 className="text-2xl font-bold text-nexus-purple mb-2">{org.name}</h2>
              <p className="text-nexus-brown/90 mb-6 pr-20">{org.description}</p>
              
              <h3 className="text-xl font-semibold text-nexus-purple mb-4">Upcoming Events</h3>
              {org.events.length > 0 ? (
                <div className="space-y-4">
                  {org.events.map(event => (
                    <div key={event.id} className="bg-nexus-sky/60 p-4 rounded-lg flex items-start space-x-4">
                      <div className="flex-shrink-0 bg-nexus-pink text-white rounded-full w-12 h-12 flex items-center justify-center">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-nexus-purple">{event.title}</h4>
                        <p className="text-sm text-nexus-brown/80">{event.day}, {event.date} at {event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-nexus-brown/70">No events scheduled.</p>
              )}
            </div>
          ))
        ) : (
           <div className="text-center py-16 bg-white rounded-lg shadow-md border-2 border-dashed border-gray-300">
             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m-1 4h1m4-12h1m-1 4h1m-1 4h1m-1 4h1" /></svg>
             <h3 className="mt-2 text-lg font-medium text-nexus-brown">No organizations added yet</h3>
             <p className="mt-1 text-sm text-gray-500">
               {isOrganizer ? "Get started by adding a new organization." : "No organizations have been added yet. Check back later!"}
             </p>
           </div>
        )}
      </div>

      {isOrganizer && <OrgModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveOrg}
        orgToEdit={editingOrg}
      />}
    </div>
  );
};