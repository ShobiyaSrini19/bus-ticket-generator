import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

export default function TicketForm() {
  const [form, setForm] = useState({
    name: '',
    gender: 'male',
    boarding: 1,
    destination: 2
  });

  const [ticket, setTicket] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (form.boarding === form.destination) {
      alert('Boarding and destination must differ');
      return;
    }

    const stops = Math.abs(form.destination - form.boarding);
    const fare = stops * 1;
    const ticketId = 'TID' + Math.floor(100000 + Math.random() * 900000);
    const dateTime = new Date().toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });

    const ticketData = {
      ...form,
      fare,
      stops,
      ticketId,
      dateTime
    };

    try {
      const res = await axios.post('http://localhost:5000/api/tickets', ticketData);
      setTicket(res.data.ticket);
    } catch (err) {
      alert('Failed to submit ticket');
    }
  };
  const printTicket = () => {
  const ticketElement = document.getElementById('ticket-box');
  if (!ticketElement || !ticket) return;

  const bgColor = ticket.gender === 'male' ? '#007bff' : '#ff69b4';

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Bus Ticket</title>
        <style>
          body {
            font-family: Arial;
            padding: 20px;
            margin: 0;
          }
          .ticket {
            padding: 15px;
            border-radius: 10px;
            color: white;
            background-color: ${bgColor};
            width: fit-content;
          }
        </style>
      </head>
      <body>
        <div class="ticket">
            ${ticketElement.innerHTML}
        </div>

        
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};


  return (
    <div className="form-container">
      <h2>Bus Ticket Generator</h2>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <select name="gender" onChange={handleChange}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <select name="boarding" onChange={handleChange}>
        {[...Array(10)].map((_, i) => (
          <option key={i} value={i + 1}>Stop {i + 1}</option>
        ))}
      </select>
      <select name="destination" onChange={handleChange}>
        {[...Array(10)].map((_, i) => (
          <option key={i} value={i + 1}>Stop {i + 1}</option>
        ))}
      </select>
      <button onClick={handleSubmit}>Generate Ticket</button>

      {ticket && (
  <>
    <div
      id="ticket-box"
      className="ticket"
      style={{ backgroundColor: ticket.gender === 'male' ? '#007bff' : '#ff69b4' }}
    >
      <p><strong>ID:</strong> {ticket.ticketId}</p>
      <p><strong>Name:</strong> {ticket.name}</p>
      <p><strong>From:</strong> Stop {ticket.boarding}</p>
      <p><strong>To:</strong> Stop {ticket.destination}</p>
      <p><strong>Fare:</strong> ₹{ticket.fare}</p>
      <p><strong>Date/Time:</strong> {ticket.dateTime}</p>
    </div>

    {/* 👇 ADD THIS PRINT BUTTON */}
    <button onClick={printTicket}>🖨️ Print Ticket</button>
  </>
)}

    </div>
  );
}
