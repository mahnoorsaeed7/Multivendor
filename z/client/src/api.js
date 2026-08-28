const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiFetch = async (endpoint, options = {}) => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
  const response = await fetch(`${API_URL}${cleanEndpoint}`, {
    credentials: "include", // Ensure session cookies are sent
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }
  return data;
};

export const getProducts = async () => {
  const data = await apiFetch('/api/products');
  return data.data;
};

export const getProductById = async (productId) => {
  const data = await apiFetch(`/api/products/${productId}`);
  return data.data;
};

export const getCart = () => {
  return apiFetch('/api/cart');
};

export const getCartItems = (productId, quantity = 1) => {
  return apiFetch('/api/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
};

export const updateCartItems = (productId, quantity) => {
  return apiFetch(`/api/cart/items/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
};

export const deleteItem = (productId) => {
  return apiFetch(`/api/cart/items/${productId}`, {
    method: 'DELETE',
  });
};

export const clearCart = () => {
  return apiFetch('/api/cart', {
    method: 'DELETE',
  });
};
