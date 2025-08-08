// Dashboard.js
import React, { useEffect, useState } from 'react';
import TicketGenerator from './TicketGenerator';
import Downloads from './Downloads';
import Recent from './Recent';
import Profile from './Profile';

export default function Dashboard() {
  const [tab, setTab] = useState(null);

  // onboardPassengers: array of { id, boardingStop, destinationStop, phone?, timestamp }
  const [onboardPassengers, setOnboardPassengers] = useState([]);
  // totalPassengersToday: increments when passenger boards, persists across refresh
  const [totalPassengersToday, setTotalPassengersToday] = useState(0);

  // initialize from localStorage and reset if day changed
  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('btg_lastCountDate');
    if (savedDate !== today) {
      // new day → reset counts
      localStorage.setItem('btg_totalToday', '0');
      localStorage.setItem('btg_onboard', JSON.stringify([]));
      localStorage.setItem('btg_lastCountDate', today);
      setTotalPassengersToday(0);
      setOnboardPassengers([]);
    } else {
      // same day → load saved
      const savedTotal = parseInt(localStorage.getItem('btg_totalToday') || '0', 10);
      const savedOnboard = JSON.parse(localStorage.getItem('btg_onboard') || '[]');
      setTotalPassengersToday(savedTotal);
      setOnboardPassengers(savedOnboard);
    }
  }, []);

  // persist changes whenever onboard or total changes
  useEffect(() => {
    localStorage.setItem('btg_onboard', JSON.stringify(onboardPassengers));
    localStorage.setItem('btg_totalToday', String(totalPassengersToday));
    localStorage.setItem('btg_lastCountDate', new Date().toDateString());
  }, [onboardPassengers, totalPassengersToday]);

  // Called by TicketGenerator after ticket saved
  // signature: (boarding, destination, passengerPhone)
  const handlePassengerBoard = (boarding, destination, passengerPhone = '') => {
    const id = Date.now().toString() + Math.floor(Math.random() * 1000); // unique-ish id
    const newPassenger = {
      id,
      boardingStop: boarding,
      destinationStop: destination,
      phone: passengerPhone,
      boardedAt: new Date().toISOString(),
    };

    setOnboardPassengers(prev => [...prev, newPassenger]);
    setTotalPassengersToday(prev => prev + 1);
  };

  // When the bus reaches a stop, remove passengers whose destination equals that stop
  const handleBusReachStop = (stop) => {
    const before = onboardPassengers.length;
    const remaining = onboardPassengers.filter(p => p.destinationStop !== stop);
    const removed = before - remaining.length;
    setOnboardPassengers(remaining);

    // optional UI message
    if (removed > 0) {
      alert(`${removed} passenger(s) got off at ${stop}.`);
    } else {
      alert(`No passengers to offboard at ${stop}.`);
    }
  };

  // optionally allow manual offboarding for a single passenger
  const handleManualOffboard = (id) => {
    setOnboardPassengers(prev => prev.filter(p => p.id !== id));
  };

  const allStops = ['Stop 1','Stop 2','Stop 3','Stop 4','Stop 5','Stop 6','Stop 7','Stop 8','Stop 9','Stop 10'];

  const componentMap = {
    profile: <Profile />,
    ticket: <TicketGenerator onPassengerBoard={handlePassengerBoard} />,
    recent: <Recent />,
    downloads: <Downloads />
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', padding: 20, borderRadius: 8 }}>
        <h2>Dashboard</h2>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ background: '#e6f7ff', padding: 12, borderRadius: 8 }}>
            <h3 style={{ margin: 0 }}>🧑‍🤝‍🧑 Live Onboard</h3>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>{onboardPassengers.length}</div>
          </div>

          <div style={{ background: '#e6f7ff', padding: 12, borderRadius: 8 }}>
            <h3 style={{ margin: 0 }}>📅 Total Today</h3>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>{totalPassengersToday}</div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          {/* Tabs / Navigation */}
          {tab ? (
            <>
              <button onClick={() => setTab(null)} style={{ marginBottom: 12 }}>← Back to Dashboard</button>
              <div>{componentMap[tab]}</div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 160 }}>
                <button onClick={() => setTab('profile')}>Profile</button>
                <button onClick={() => setTab('ticket')}>Ticket Generator</button>
                <button onClick={() => setTab('recent')}>Recent</button>
                <button onClick={() => setTab('downloads')}>Downloads</button>
              </nav>

              <div style={{ flex: 1 }}>
                {/* Bus Control — reach stops */}
                <div style={{ marginBottom: 12 }}>
                  <h4 style={{ margin: '6px 0' }}>Bus Control — mark arrival at stop</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {allStops.map(s => (
                      <button key={s} onClick={() => handleBusReachStop(s)}>{`Bus reached ${s}`}</button>
                    ))}
                  </div>
                </div>

                {/* Onboard passenger list */}
                <div style={{ background: '#f7fbff', padding: 12, borderRadius: 8 }}>
                  <h4 style={{ marginTop: 0 }}>Onboard Passengers ({onboardPassengers.length})</h4>
                  {onboardPassengers.length === 0 ? (
                    <p style={{ margin: 0 }}>No passengers currently onboard.</p>
                  ) : (
                    <ul style={{ marginTop: 8 }}>
                      {onboardPassengers.map(p => (
                        <li key={p.id} style={{ marginBottom: 8 }}>
                          <strong>{p.boardingStop}</strong> → <strong>{p.destinationStop}</strong>
                          {p.phone ? ` • ${p.phone}` : ''}
                          <div style={{ marginTop: 6 }}>
                            <small>Boarded at: {new Date(p.boardedAt).toLocaleTimeString()}</small>
                            <button onClick={() => handleManualOffboard(p.id)} style={{ marginLeft: 10 }}>Mark off</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}