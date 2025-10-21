import React, { useEffect, useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const response = await fetch(
        "https://food-order-website-backend-final.onrender.com/api/contact"
      );
      const data = await response.json();

      // Sort (latest first → oldest last)
      const sortedData = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setContacts(sortedData);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Toggle Read/Unread
  const handleToggleRead = async (id) => {
    try {
      const response = await fetch(
        `https://food-order-website-backend-final.onrender.com/api/contact/${id}/read`,
        { method: "PATCH" }
      );
      const result = await response.json();
      if (response.ok) {
        setContacts(
          contacts.map((c) =>
            c._id === id ? { ...c, read: result.read } : c
          )
        );
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to toggle read/unread");
    }
  };

  // Delete Contact
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const response = await fetch(
        `https://food-order-website-backend-final.onrender.com/api/contact/${id}`,
        { method: "DELETE" }
      );

      const result = await response.json();
      if (response.ok) {
        setContacts(contacts.filter((c) => c._id !== id));
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Something went wrong while deleting.");
    }
  };

  // Search filter
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(search.toLowerCase()) ||
      contact.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="contact-container">
      <h1 className="page-title">Contact Submissions</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      {filteredContacts.length === 0 ? (
        <p className="no-data">No contact messages found.</p>
      ) : (
        <div className="contact-grid">
          {filteredContacts.map((contact) => (
            <div key={contact._id} className="contact-card">
              {/* Date/Time at top */}
              <p className="date">
                {new Date(contact.date).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>

              <h3><strong>Name : </strong> {contact.name}</h3>
              <p><strong>Email : </strong> {contact.email}</p>
              <p className="message"><strong>Message : </strong> “{contact.message}”</p>

              <p className={`status-badge ${contact.read ? "read" : "unread"}`}>
                {contact.read ? "Read" : "Unread"}
              </p>

              <div className="btn-group">
                <button
                  onClick={() => handleToggleRead(contact._id)}
                  className="toggle-read-btn"
                >
                  Mark as {contact.read ? "Unread" : "Read"}
                </button>
                <button
                  onClick={() => handleDelete(contact._id)}
                  className="delete-btn"
                > Delete </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contact;
