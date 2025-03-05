// utils/profile.js
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const getUserId = () => localStorage.getItem('user_id');

export const fetchUserData = async (id) => {
  const userId = getUserId();
  if (!id && !userId) {
    throw new Error("User ID not found");
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id || userId}`);
    const data = await response.json();
    if (data?.errors) throw new Error(data.errors[0].message);
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
export const updateUserProfile = async (data, id) => {
  const userId = getUserId();
  if (!userId) {
    throw new Error("User ID not found in localStorage.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
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

export const updateTheme = async (data, id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/themes/${id}`, {
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
