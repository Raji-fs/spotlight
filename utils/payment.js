export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const makePayment = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    const data = await response.json();
    if (data?.errors) throw new Error(data.errors[0].message);
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
