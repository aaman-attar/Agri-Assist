import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [form, setForm] = useState({ name: '', phone: '', location: '' });
  const [message, setMessage] = useState('');
  const [farmer, setFarmer] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    // try {
    //   const res = await axios.post('http://127.0.0.1:8000/api/farmer-login/', form);
    //   setMessage(res.data.msg);
    //   setFarmer(res.data.farmer);
    //   localStorage.setItem('farmer', JSON.stringify(res.data.farmer));
    //   localStorage.setItem('farmerPhone', res.data.farmer.phone);
    //   window.location.href = '/dashboard';

    // } catch (err) {
    //   console.error(err);
    //   setMessage('Something went wrong');
    // }
    try {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}farmer-login/`,
    form
  );

  setMessage(res.data.msg);
  setFarmer(res.data.farmer);
  localStorage.setItem('farmer', JSON.stringify(res.data.farmer));
  localStorage.setItem('farmerPhone', res.data.farmer.phone);
  window.location.href = '/dashboard';
} catch (err) {
  console.error(err);
  setMessage('Something went wrong');
}
  };

  return (
    <div className="min-h-screen bg-green-100 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 text-center mb-6">Farmer Login/Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
        >
          Submit
        </button>

        {message && (
          <p className="text-center mt-4 text-green-600 font-medium">{message}</p>
        )}
        {farmer && (
          <p className="text-center text-gray-700 mt-2">
            Hello <strong>{farmer.name}</strong> from {farmer.location}
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
