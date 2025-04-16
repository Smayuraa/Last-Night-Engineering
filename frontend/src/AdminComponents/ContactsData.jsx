import React, { useState, useEffect } from 'react';
import { Table, Tab, Tabs, Form, Badge } from 'react-bootstrap';
import axios from 'axios';

const ContactsData = () => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/contacts`,
          {
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            withCredentials: true
          }
        );
        setContacts(response.data);
        setFilteredContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    fetchContacts();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();
  
    if (query === "") {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact => {
        const requirements = contact[contact.category]?.requirements?.toLowerCase() || '';
        const matchesRequirements = requirements.includes(lowerQuery);
        
        if (contact.category === 'projects') {
          const subCategory = contact.projects?.subCategory?.toLowerCase() || '';
          const technicalSpecs = contact.projects?.technicalSpecs?.toLowerCase() || '';
          return (
            matchesRequirements ||
            subCategory.includes(lowerQuery) ||
            technicalSpecs.includes(lowerQuery)
          );
        }
        return matchesRequirements;
      });
      setFilteredContacts(filtered);
    }
  };

  const filterByCategory = (category) => {
    return (searchQuery ? filteredContacts : contacts).filter(contact => contact.category === category);
  };

  const renderProjectsTable = () => (
    <Table bordered hover responsive className="admin-table">
      <thead>
        <tr>
          <th>Sub Category</th>
          <th>Requirements</th>
          <th>Budget</th>
          <th>Timeline</th>
          <th>Audience</th>
          <th>Design Preferences</th>
          <th>Technical Specs</th>
          <th>Contact</th>
        </tr>
      </thead>
      <tbody>
        {filterByCategory('projects').map(contact => (
          <tr key={contact._id}>
            <td>{contact.projects?.subCategory}</td>
            <td>{contact.projects?.requirements}</td>
            <td>{contact.projects?.budget}</td>
            <td>{contact.projects?.timeline}</td>
            <td>{contact.projects?.audience}</td>
            <td>
              {Array.isArray(contact.projects?.designPreferences) 
                ? contact.projects.designPreferences.map(pref => (
                    <Badge key={pref} className="tech-badge me-1">{pref}</Badge>
                  ))
                : contact.projects?.designPreferences}
            </td>
            <td>{contact.projects?.technicalSpecs}</td>
            <td>{contact.projects?.keyContacts}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderTeachingTable = () => (
    <Table bordered hover responsive className="admin-table">
      <thead>
        <tr>
          <th>User Type</th>
          <th>Learning Topic</th>
          <th>Message</th>
          <th>Contact</th>
        </tr>
      </thead>
      <tbody>
        {filterByCategory('teaching').map(contact => (
          <tr key={contact._id}>
            <td>{contact.teaching?.userType}</td>
            <td>{contact.teaching?.learningTopic}</td>
            <td>{contact.teaching?.message}</td>
            <td>{contact.teaching?.contact}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderNotesTable = () => (
    <Table bordered hover responsive className="admin-table">
      <thead>
        <tr>
          <th>Note Type</th>
          <th>Subject</th>
          <th>Requirements</th>
          <th>Contact</th>
        </tr>
      </thead>
      <tbody>
        {filterByCategory('notes').map(contact => (
          <tr key={contact._id}>
            <td>{contact.notes?.selectedNoteType}</td>
            <td>{contact.notes?.subject || 'N/A'}</td>
            <td>{contact.notes?.requirements}</td>
            <td>{contact.notes?.keyContacts}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <div className="admin-container">
      <div className="search-row">
        <Form.Control
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="admin-search-input contact-search-input"
        />
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3 admin-tabs"
      >
        <Tab 
          eventKey="projects" 
          title="Projects" 
          className="admin-tab"
          tabClassName="custom-tab"
          activeTabClassName="active-custom-tab"
        >
          {renderProjectsTable()}
        </Tab>
        <Tab 
          eventKey="teaching" 
          title="Teaching" 
          className="admin-tab"
          tabClassName="custom-tab"
          activeTabClassName="active-custom-tab"
        >
          {renderTeachingTable()}
        </Tab>
        <Tab 
          eventKey="notes" 
          title="Notes" 
          className="admin-tab"
          tabClassName="custom-tab"
          activeTabClassName="active-custom-tab"
        >
          {renderNotesTable()}
        </Tab>
      </Tabs>
    </div>
  );
};

export default ContactsData;