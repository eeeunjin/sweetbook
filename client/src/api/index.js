import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Books ────────────────────────────────────────────────────────────────────
export const buildMenuBook = (data) => api.post('/books/build', data);
export const listBooks = (params) => api.get('/books', { params });

// ─── Orders ───────────────────────────────────────────────────────────────────
export const estimateOrder = (data) => api.post('/orders/estimate', data);
export const createOrder = (data) => api.post('/orders', data);
export const listOrders = (params) => api.get('/orders', { params });
export const getOrder = (uid) => api.get(`/orders/${uid}`);
export const cancelOrder = (uid, data) => api.post(`/orders/${uid}/cancel`, data);

// ─── Catalog ──────────────────────────────────────────────────────────────────
export const getBookSpecs = () => api.get('/catalog/book-specs');
export const getTemplates = (params) => api.get('/catalog/templates', { params });
export const getTemplateCategories = () => api.get('/catalog/template-categories');
export const getCredits = () => api.get('/catalog/credits');
export const sandboxCharge = (amount) => api.post('/catalog/credits/sandbox-charge', { amount });
