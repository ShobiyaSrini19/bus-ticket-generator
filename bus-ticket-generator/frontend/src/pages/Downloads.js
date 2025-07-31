import React, { useEffect, useState } from 'react';

export default function Downloads() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('downloads')) || [];
    setTickets(stored);
  }, []);

  return (
    <div>
      <h3>Downloaded Tickets</h3>
      {tickets.length === 0 ? (
        <p>No downloaded tickets</p>
      ) : (
        tickets.map((t, i) => (
          <div
            key={i}
            style={{
              backgroundColor: t.gender === 'male' ? '#007bff' : '#ff69b4',
              color: 'white',
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '8px',
              maxWidth: '300px',
            }}
          >
            <strong>Ticket ID:</strong> {t._id} <br />
            <strong>Boarding:</strong> {t.boarding} <br />
            <strong>Destination:</strong> {t.destination} <br />
            <strong>Fare:</strong> ₹{t.fare} <br />
            <strong>Date:</strong> {t.date}
          </div>
        ))
      )}
    </div>
  );
}
