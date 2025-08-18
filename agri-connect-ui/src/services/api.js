import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Uses Render backend URL from .env
});

// Farmer login
export const farmerLogin = (data) => API.post('farmer-login/', data);

// Marketplace API
export const fetchListings = () => API.get('marketplace/');
export const getListingDetail = (id) => API.get(`marketplace/${id}/`);
export const createListing = (formData) =>
  API.post('marketplace/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
export const updateListing = (id, formData) =>
  API.put(`marketplace/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
export const deleteListing = (id) => API.delete(`marketplace/${id}/`);

export const getQuickTips = () => API.get('quicktips/');
