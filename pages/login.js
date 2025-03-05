import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Layout from "@/components/Layout";
import InputField from "@/components/form/Input";
import { getAuthToken } from "@/utils/auth";
export const runtime = "experimental-edge";

export default function Login() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true); // New state to prevent flickering
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      router.push("/admin");
    } else {
      setCheckingAuth(false); // Only show login form after checking token
    }
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);
    try {
      const token = await getAuthToken(data?.email, data?.password);
      if (!token) {
        throw new Error("Invalid credentials");
      }
      localStorage.setItem("auth_token", token); // Ensure token is saved
      router.push("/admin");
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // Don't render login form until auth check is complete
  if (checkingAuth) {
    return null; // Or a loading spinner
  }

  return (
    <Layout page='dashboard'>
      <div className="flex flex-col gap-8 items-center justify-center min-h-screen">
        <div className="flex flex-col justify-between bg-white p-12 rounded-xl w-80 sm:w-96 md:w-[465px] border border-[#B4B4B4] shadow-[0px_0px_25px_#a7a7a780]">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-4">
              <InputField
                label="Email Address"
                type="email"
                name="email"
                register={register}
                validation={/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/}
                errorMessage="Invalid email address"
                required="Email is required"
                error={errors.email}
                placeholder="Enter your email address"
              />
              <InputField
                label="Password"
                type="password"
                name="password"
                register={register}
                required="Password is required"
                error={errors.password}
                placeholder="Enter your password"
              />
            </div>
            {error && <p className="text-red-600">{error}</p>}
            
            <button
              disabled={loading}
              type="submit"
              className={`text-xl font-medium w-full bg-blue-600 text-white p-2 md:p-3 rounded-md flex items-center justify-center ${loading && 'opacity-80'}`}
            >
              Login{" "}
              {loading ? (
                <span className="loader !ml-2 !m-0 small"></span>
              ) : (
                <img src="/images/right_arrow.png" alt="login_icon" className="ml-2 w-6" />
              )}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
