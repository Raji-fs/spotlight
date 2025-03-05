import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Layout from "@/components/Layout";
import InputField from "@/components/form/Input";
import { registerUser } from "@/utils/auth";
import { FiEye, FiEyeOff } from "react-icons/fi";
export const runtime = "experimental-edge";

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);
  
    const payload = {
      email: data?.email,
      password: data?.password,
      name: data?.name,
      roles: ["editor"],
    };
  
    try {
      const res = await registerUser(payload);
      if (!res) throw new Error("Sign Up failed");
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <Layout page='dashboard'>
      <div className="flex flex-col gap-8 items-center justify-center mt-6">
        <div className="flex flex-col justify-between bg-white p-12 rounded-xl w-80 sm:w-96 md:w-[465px] border border-[#B4B4B4] shadow-[0px_0px_25px_#a7a7a780]">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-4">
              <InputField
                label="Name"
                type="text"
                name="name"
                register={register}
                required="Name is required"
                error={errors.name}
                placeholder="Enter your name"
              />
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
              <div className="relative">
                <InputField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  register={register}
                  required="Password is required"
                  error={errors.password}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5 text-gray-500" /> : <FiEye className="w-5 h-5 text-gray-500" />}
                </button>
              </div>
              <div className="relative">
                <InputField
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  register={register}
                  required="Confirm Password is required"
                  error={errors.confirmPassword}
                  placeholder="Re-enter your password"
                  validate={(value) => value === password || "Passwords do not match"}
                />
                <button
                  type="button"
                  className="absolute right-3 top-10"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff className="w-5 h-5 text-gray-500" /> : <FiEye className="w-5 h-5 text-gray-500" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-600">{error}</p>}
            
            <button
              disabled={loading}
              type="submit"
              className={`text-xl font-medium w-full bg-blue-600 text-white p-2 md:p-3 rounded-md flex items-center justify-center ${loading && 'opacity-80'}`}
            >
              Sign Up{" "}
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
