// src/pages/EditListingPage.jsx
import React, { useEffect, useState } from 'react';
import { getListingDetail, updateListing } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const EditListingPage = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getListingDetail(id).then(res => setForm(res.data));
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in form) formData.append(key, form[key]);
    await updateListing(id, formData);
    navigate('/marketplace');
  };

  if (!form) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['title', 'description', 'price', 'category', 'location', 'contact'].map(field => (
          <input
            key={field}
            name={field}
            placeholder={field}
            className="w-full p-2 border rounded"
            value={form[field]}
            onChange={handleChange}
            required
          />
        ))}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={e => setForm({ ...form, image: e.target.files[0] })}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
};

export default EditListingPage;
