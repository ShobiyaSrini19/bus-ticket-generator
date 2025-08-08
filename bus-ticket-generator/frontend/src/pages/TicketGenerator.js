import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import axios from 'axios';

export default function TicketGenerator({ onPassengerBoard }) {
  const [boarding, setBoarding] = useState('');
  const [destination, setDestination] = useState('');
  const [gender, setGender] = useState('male');
  const [ticket, setTicket] = useState(null);
  const [passengerPhone, setPassengerPhone] = useState('');

  const stops = Array.from({ length: 10 }, (_, i) => `Stop ${i + 1}`);

  const handleGenerate = async () => {
  if (boarding === destination || !boarding || !destination) {
    alert('Please select different boarding and destination stops.');
    return;
  }
  console.log('Conductor ID:', localStorage.getItem('loggedIn'));

    const stopsTravelled = Math.abs(
      parseInt(destination.split(' ')[1]) - parseInt(boarding.split(' ')[1])
    );
    const fare = stopsTravelled * 1;
    const date = new Date().toISOString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
      hour12: true,
    });

    const ticketData = {
      conductorId: localStorage.getItem('loggedIn'),
      boarding,
      destination,
      gender,
      fare,
      stops: stopsTravelled,
      date,
      passengerPhone, 
    };

    try {
      const res = await axios.post('http://localhost:5000/api/tickets', ticketData);
      setTicket(res.data.ticket);

if (onPassengerBoard) {
  console.log('triggering onPassengerBoard', boarding, destination, passengerPhone);
  onPassengerBoard(boarding, destination, passengerPhone);
}


    } catch (err) {
      alert('Failed to save ticket.');
    }
    setPassengerPhone('');

  };

  const handleDownload = () => {
  const ticketEl = document.getElementById('ticket');
  html2canvas(ticketEl).then((canvas) => {
    const link = document.createElement('a');
    link.download = 'ticket.png';
    link.href = canvas.toDataURL();
    link.click();

    // Save ticket to downloads (localStorage for now)
    const downloads = JSON.parse(localStorage.getItem('downloads')) || [];
    downloads.unshift(ticket);
    localStorage.setItem('downloads', JSON.stringify(downloads));
  });
};


   return (
    <div
      style={{
        backgroundColor: '#d9f0ff', // light blue background
        minHeight: '100vh',
        padding: '30px',
      }}
    >
      <div
        style={{
          maxWidth: '400px',
          margin: 'auto',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        <h3 style={{ textAlign: 'center' }}>Generate Ticket</h3>

        <label>Boarding Stop</label>
        <select value={boarding} onChange={(e) => setBoarding(e.target.value)}>
          <option value="">Select</option>
          {stops.map((stop) => (
            <option key={stop} value={stop}>
              {stop}
            </option>
          ))}
        </select>

        <label>Destination Stop</label>
        <select value={destination} onChange={(e) => setDestination(e.target.value)}>
          <option value="">Select</option>
          {stops.map((stop) => (
            <option key={stop} value={stop}>
              {stop}
            </option>
          ))}
        </select>

        <label>Passenger Phone Number</label>
        <input
          type="text"
          value={passengerPhone}
          onChange={(e) => setPassengerPhone(e.target.value)}
          placeholder="Enter passenger phone"
        />

        <label>Passenger Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <button
          onClick={handleGenerate}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Generate Ticket
        </button>

        {ticket && (
  <>
    <div
      id="ticket"
      style={{
        backgroundColor:
          ticket.gender === 'male' ? '#007bff' : '#ff69b4',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px',
      }}
    >
      <strong>Ticket ID:</strong> {ticket._id} <br />
      <strong>Conductor ID:</strong> {ticket.conductorId} <br />
      <strong>Boarding:</strong> {ticket.boarding} <br />
      <strong>Destination:</strong> {ticket.destination} <br />
      <strong>Stops:</strong> {ticket.stops} <br />
      <strong>Fare:</strong> ₹{ticket.fare} <br />
      <strong>Gender:</strong> {ticket.gender} <br />
      <strong>Date:</strong> {ticket.date}
    </div>

            <button
              onClick={handleDownload}
              style={{
                marginTop: '10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Download Ticket
            </button>
          </>
        )}
      </div>
    </div>
  );
}