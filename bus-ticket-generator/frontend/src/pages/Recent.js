import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Recent() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
  axios.get('http://localhost:5000/api/tickets')
    .then((res) => {
      setTickets(res.data); // Do NOT reverse here
    })
    .catch((err) => console.error(err));
}, []);

  return (
    <div>
      <h3>Recent Tickets</h3>
      {tickets.length === 0 ? (
        <p>No recent tickets found.</p>
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
            <strong>Conductor:</strong> {t.conductorId} <br />
            <strong>Boarding:</strong> {t.boarding} <br />
            <strong>Destination:</strong> {t.destination} <br />
            <strong>Stops:</strong> {t.stops} <br />
            <strong>Fare:</strong> ₹{t.fare} <br />
            <strong>Date:</strong> {t.date}
          </div>
        ))
      )}
    </div>
  );
}
