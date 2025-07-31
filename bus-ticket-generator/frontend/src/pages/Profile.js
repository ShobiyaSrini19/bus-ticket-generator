import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
  name: '',
  age: '',
  dob: '',
  gender: '',
  phone: ''
});

  const conductorId = localStorage.getItem('loggedIn');

  useEffect(() => {
  if (conductorId) {
    console.log('Fetching profile for:', conductorId); // Add this

    axios
      .get(`http://localhost:5000/api/auth/profile/${conductorId}`)
      .then((res) => {
        console.log('Profile response:', JSON.stringify(res.data, null, 2));
// And this
        setProfile(res.data);
        setForm(res.data);
      })
      .catch((err) => {
        console.error('Error fetching profile:', err); // And this
      });
  }
}, [conductorId]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/auth/profile/${conductorId}`,
        form
      );
      alert('Profile updated successfully!');
      const fetchedProfile = {
  conductorId: res.data.conductorId || '',
  name: res.data.name || '',
  age: res.data.age || '',
  dob: res.data.dob || '',
  gender: res.data.gender || '',
  phone: res.data.phone || ''
};

setProfile(fetchedProfile);
setForm(fetchedProfile);

    } catch (err) {
      alert('Failed to update profile');
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h3>Conductor Profile</h3>

      {editMode ? (
        <>
          <label>Name:</label>
          <input name="name" value={form.name} onChange={handleChange} />

          <label>Age:</label>
          <input name="age" value={form.age} onChange={handleChange} />

          <label>Date of Birth:</label>
          <input name="dob" value={form.dob} onChange={handleChange} />

          <label>Gender:</label>
          <input name="gender" value={form.gender} onChange={handleChange} />

          <label>Phone:</label>
          <input name="phone" value={form.phone} onChange={handleChange} />

          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p><strong>ID:</strong> {profile.conductorId}</p>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Age:</strong> {profile.age}</p>
          <p><strong>Date of Birth:</strong> {profile.dob}</p>
          <p><strong>Gender:</strong> {profile.gender}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </>
      )}
    </div>
  );
}