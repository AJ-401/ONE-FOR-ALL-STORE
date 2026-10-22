// API utility — all backend calls go through here
const API_BASE = '/api';

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  getCatalog: () => request('/catalog'),

  getCart: (customerId) => request(`/cart/${customerId}`),

  updateCart: (customerId, items) =>
    request(`/cart/${customerId}`, {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),

  checkout: (customerId) =>
    request('/checkout', {
      method: 'POST',
      body: JSON.stringify({ customerId }),
    }),

  getOrders: (customerId) => request(`/orders/${customerId}`),

  getCustomers: () => request('/customers'),

  createCustomer: (customerData) =>
    request('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    }),
};
