import { useState, useEffect } from "react";
import ContactList from "./ContactList";
import "./App.css";
import ContactForm from "./ContactForm";
import ImageSearch from "./ImageSearch";

function App() {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState({});
  const [activeTab, setActiveTab] = useState('contacts');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const response = await fetch("http://localhost:5000/contacts");
    const data = await response.json();
    setContacts(data.contacts);
    console.log(data.contacts);
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentContact({})
  }

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }

  const openEditModal = (contact) => {
    if (isModalOpen) return
    setCurrentContact(contact)
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchContacts()
  }

  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="index.html">Image Searcher</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <button className={`nav-link btn btn-link ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => setActiveTab('contacts')}>Home</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link btn btn-link ${activeTab === 'images' ? 'active' : ''}`} onClick={() => setActiveTab('images')}>Image Searcher</button>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="account-creator.html">Create Account</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="account-page.html">Account Page</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {activeTab === 'contacts' && (
        <div className="contacts-tab">
          <ContactList contacts={contacts} updateContact={openEditModal} updateCallback={onUpdate}/>
          <button onClick={openCreateModal}>Create New Contact</button>
          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <ContactForm existingContact={currentContact} updateCallback={onUpdate}/>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'images' && (
        <div className="images-tab">
          <ImageSearch />
        </div>
      )}
    </>
  );
}

export default App;
