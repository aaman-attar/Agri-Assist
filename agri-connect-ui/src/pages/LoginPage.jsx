import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { farmerLogin } from '../services/api'; // Use api.js service

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', location: '' });
  const [message, setMessage] = useState('');
  const [farmer, setFarmer] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await farmerLogin(form);

      if (res.data && res.data.farmer) {
        setMessage(res.data.msg);
        setFarmer(res.data.farmer);

        // Save farmer info in localStorage
        localStorage.setItem('farmer', JSON.stringify(res.data.farmer));
        localStorage.setItem('farmerPhone', res.data.farmer.phone || '');

        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setMessage('Login failed. Please check your details.');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setMessage(err.response.data.msg || 'Login failed. Please check your details.');
      } else {
        setMessage('Something went wrong. Please try again later.');
      }
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
          <p className="text-center mt-4 text-red-600 font-medium">{message}</p>
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
