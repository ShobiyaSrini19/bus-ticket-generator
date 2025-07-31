import { useEffect, useState } from 'react';
import axios from 'axios';

const PassengerCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/api/passenger-count')
      .then(res => setCount(res.data.count))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h3>🧑‍🤝‍🧑 Live Passengers Today: {count}</h3>
    </div>
  );
};

export default PassengerCount;
