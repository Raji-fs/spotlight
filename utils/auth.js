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
    localStorage.setItem('user_info',JSON.stringify({"id": data?.user?.id, "name": data?.user?.name, "trialStart": data?.user?.trialStart, "trialEnd": data?.user?.trialEnd, "plan": 	data?.user?.plan, "freeTrial": data?.user?.freeTrial, "email": data?.user?.email}));

    return data?.token;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export async function registerUser(payload) {
  try {
    const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
      }),
    });

    if (!loginRes.ok) throw new Error((await loginRes.json()).message || "Login failed");

    const admin_token = (await loginRes.json())?.token;
    if (!admin_token) throw new Error("Token Missing");
    const signUpRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `JWT ${admin_token}` },
      body: JSON.stringify(payload),
    });

    if (!signUpRes.ok) throw new Error((await signUpRes.json()).message || "Sign Up failed");

    return await signUpRes.json();
  } catch (error) {
    console.error("Registration Error:", error);
    return null;
  }
}

