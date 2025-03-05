// utils/works.js
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const getUserId = () => localStorage.getItem('user_id');

export const createWork = async (data, id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/works`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem("auth_token")}`
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Error updating profile');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateWork = async (data, id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/works/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem("auth_token")}`
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Error updating profile');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const removeWork = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/works/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem("auth_token")}`
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Error Deleting work');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateUser = async (data) => {
  const userId = getUserId();
  if (!userId) {
    throw new Error("User ID not found in localStorage.");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem("auth_token")}`
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Error updating Work');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

