import React, { useState } from 'react';
import { createListing } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreateListingPage = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    contact: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      e.preventDefault();
      const formData = new FormData();
      for (let key in form) {
       formData.append(key, form[key]);
      }
      await createListing(formData);
      navigate('/marketplace');
    } catch (err) {
      alert('Something went wrong');
      console.error(err);
    }
  };




  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          className="w-full p-2 border rounded"
          value={form.price}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          className="w-full p-2 border rounded"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Tools">Tools</option>
          <option value="Seeds">Seeds</option>
          <option value="Fertilizers">Fertilizers</option>
          <option value="Others">Others</option>
        </select>

        <input
          name="location"
          placeholder="Location"
          className="w-full p-2 border rounded"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          name="contact"
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
          value={form.contact}
          onChange={handleChange}
          required
        />
        <input
            type="file"
            name="image"
            accept="image/*"
            onChange={e => setForm({ ...form, image: e.target.files[0] })}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateListingPage;
