export async function getAuthToken(email, password) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await res.json();
    localStorage.setItem('user_id',data?.user?.id);
    localStorage.setItem('auth_token',data?.token);
    localStorage.setItem('user_name',data?.user?.name);

    return data?.token;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}
