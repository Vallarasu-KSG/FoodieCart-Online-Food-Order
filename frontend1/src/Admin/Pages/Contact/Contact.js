import React, { useEffect, useState } from "react";

const Contact = () => {
  const [contacts, setContacts] = useState([]);

  // Fetch all contacts
  const fetchContacts = async () => {
    try {
      const response = await fetch(
        `https://food-order-website-backend-final.onrender.com/api/contact`
      );
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const response = await fetch(
        `https://food-order-website-backend-final.onrender.com/api/contact/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        // Remove from UI without reload
        setContacts(contacts.filter((contact) => contact._id !== id));
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Something went wrong while deleting.");
    }
  };

  return (
    <div className="contact-list">
      <h1>Contact Submissions</h1>
      {contacts.length === 0 ? (
        <p>No contact messages yet.</p>
      ) : (
        <ul>
          {contacts.map((contact) => (
            <li key={contact._id} className="contact-item">
              <p>
                <strong>Name:</strong> {contact.name}
              </p>
              <p>
                <strong>Email:</strong> {contact.email}
              </p>
              <p>
                <strong>Message:</strong> {contact.message}
              </p>
              <p>
                <em>Date:</em>{" "}
                {new Date(contact.date).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
              <button
                onClick={() => handleDelete(contact._id)}
                className="delete-btn"
              >
                Delete
              </button>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Contact;
