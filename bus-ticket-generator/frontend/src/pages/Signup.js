import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    age: '',
    dob: '',
    gender: '',
    phone: '',
  });
  const [generatedId, setGeneratedId] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    console.log("SIGNUP CLICKED!");
  // DOB is like: '2003-10-19'
  const dobDate = new Date(form.dob);
  const day = String(dobDate.getDate()).padStart(2, '0');
  const month = String(dobDate.getMonth() + 1).padStart(2, '0');

  const id = form.name.substring(0, 3).toLowerCase() + day + month; // e.g., sho1910
      const payload = {
    ...form,
    conductorId: id,
    password: form.phone,
  };

  console.log("SIGNUP DATA", payload);
  try {
    

    await axios.post('http://localhost:5000/api/auth/signup', payload);
      
      setGeneratedId(id);
      alert('Signup successful! Your Conductor ID is: ' + id);
      navigate('/');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div>
      <h2>Conductor Signup</h2>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="age"
        placeholder="Age"
        value={form.age}
        onChange={handleChange}
      />
      <label>Date of Birth:</label>
      <input
        type="date"
        name="dob"
        value={form.dob}
        onChange={handleChange}
      />
      <select
        name="gender"
        value={form.gender}
        onChange={handleChange}
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <input
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
      />

      <button type="button" onClick={handleSignup}>Sign Up</button>


      {generatedId && <p>Your ID: {generatedId}</p>}
    </div>
  );
}
