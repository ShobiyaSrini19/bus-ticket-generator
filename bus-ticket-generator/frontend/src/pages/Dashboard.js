import React, { useState } from 'react';
import TicketGenerator from './TicketGenerator';
import Downloads from './Downloads';
import Recent from './Recent';
import Profile from './Profile';
import PassengerCount from './PassengerCount';



export default function Dashboard() {
  const [tab, setTab] = useState(null);
  const [livePassengers, setLivePassengers] = useState([]);
  const handlePassengerBoard = (boarding, destination) => {
    setLivePassengers(prev => [
      ...prev,
      { boardingStop: boarding, destinationStop: destination }
    ]);
  };

  const handleBusReachStop = (stop) => {
    setLivePassengers(prev =>
      prev.filter(p => p.destinationStop !== stop)
    );
    alert(`Bus reached ${stop}. Offboarded passengers removed.`);
  };

  const allStops = ['Stop 1', 'Stop 2', 'Stop 3', 'Stop 4', 'Stop 5', 'Stop 6', 'Stop 7'];


  const componentMap = {
    profile: <Profile />,
    ticket: <TicketGenerator onPassengerBoard={handlePassengerBoard} />,
    recent: <Recent />,
    downloads: <Downloads />,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <h2>Dashboard</h2>
      <h3>🧑‍🤝‍🧑 Live Passengers Today: {livePassengers.length}</h3>

      {tab ? (
        <div>
          <button onClick={() => setTab(null)} style={{ marginBottom: '20px' }}>
            ← Back to Dashboard
          </button>
          {componentMap[tab]}
        </div>
      ) : (
        <>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '200px' }}>
            <button onClick={() => setTab('profile')}>Profile</button>
            <button onClick={() => setTab('ticket')}>Ticket Generator</button>
            <button onClick={() => setTab('recent')}>Recent</button>
            <button onClick={() => setTab('downloads')}>Downloads</button>
          </nav>

          <div style={{ marginTop: '20px' }}>
            <h4>Bus Control</h4>
            {allStops.map(stop => (
              <button
                key={stop}
                onClick={() => handleBusReachStop(stop)}
                style={{ marginRight: '10px', marginBottom: '10px' }}
              >
                Bus reached {stop}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}