import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import InputField from "@/components/form/Input";
import { updateUserProfile } from "@/utils/profile";
import { useRouter } from "next/router";
import { mediaUpload } from "@/utils/media";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { changePassword } from "@/utils/auth";
import { updateUser } from "@/utils/works";

export default function Profile({ data, refreshUserData }) {
  const [loading, setLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [userData, setUserData] = useState(data);
  const [openModal, setOpenModal] = useState(false);
  const [profileImageLoading, setProfileImageLoading] = useState(false);  
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setUserData(data)
  }, [data]);
  
  useEffect(() => {
    userData && Object.keys(userData).forEach(key => setValue(key, userData[key]));
  }, [setValue, userData]);

  const onSubmit = async (data) => {
    const { updatedFields } = compareObjects(data, userData);
    if (!updatedFields) {
      toast.error("No changes made.");
      return;
    }
    setLoading(true);
    try {
      const result = await updateUserProfile(updatedFields, userData?.id);
      toast.success("Profile updated successfully!");
      refreshUserData();
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while updating your profile.");
    } finally {
      setLoading(false);
    }
  };
  
  const compareObjects = (newObj, oldObj) => {
    const fieldsToCompare = [
      'firstname', 'lastname', 'email', 'phone', 'gradeOrDesignation', 'institutionOrOrganization', 'intro', 'linkedin', 'instagram', 'x'
    ];
    let updatedFields = {};
    fieldsToCompare.forEach((field) => {
      if (newObj[field] !== oldObj[field]) {
        updatedFields[field] = newObj[field];
      }
    });
  
    return Object.keys(updatedFields).length === 0
      ? { updatedFields: null }
      : { updatedFields };
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const updateProfileImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    data.append("alt", "Profile Image");
    setProfileImageLoading(true);

    try {
      const response = await mediaUpload(data, userData?.ProfileImage?.id);
      if(userData?.ProfileImage?.id) {
        refreshUserData();
      } else {
        const payload = { ProfileImage: response.doc?.id };
        await updateUserProfile(payload, userData?.id);
        refreshUserData();
      }
      toast.success("Profile image updated successfully!");
    } catch (error) {
      toast.error("Error uploading the profile image");
    } finally {
      setProfileImageLoading(false);
    }
  };

  const resetPassword = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match!')
      return;
    }
    setPwdLoading(true)
    const payload = {
      password: data.password
    }
    try {
      await updateUser(payload);
      toast.success("Password updated successfully!");
      setOpenModal(false)
    } catch (error) {
      toast.error("Error updating the password");
    } finally {
      setPwdLoading(false)
    }
  };

  return (
    <>
    <div className="mt-12">
      <ToastContainer position="top-right" autoClose={3000} />

      <section className="short_bio flex flex-wrap gap-7 items-center mb-7">
        <div className="w-32 h-32 bg-[#D9D9D9] rounded-full flex flex-col items-center justify-center overflow-hidden group relative">
          <img
            src={userData?.ProfileImage?.url || "/images/profile_placeholder.png"}
            alt="profile_img_placeholder"
            className="w-full h-full object-cover"
          />
          <input
            id="fileInput"
            className="hidden group-hover:block absolute inset-0 opacity-0 cursor-pointer"
            type="file"
            accept="image/*"
            onChange={updateProfileImage}
          />
          {profileImageLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex justify-center items-center w-full h-full">
                <div className="loader small"></div>
              </div>
            </div>
          ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => document.getElementById('fileInput').click()}
              className="px-2 py-1 bg-blue-600 text-white rounded-md text-[8px]"
            >
              {userData?.ProfileImage?.url ? "Replace Image" : "Upload Image"}
            </button>
          </div>
          )}
        </div>
        <div>
          <p className="font-bold">
            <span>{userData?.firstname || "Firstname"}</span>
            <span className="pl-2">{userData?.lastname || ""}</span>
          </p>
          <p className="mt-1">{userData?.email || 'email@address.com'}</p>
          <div className="flex flex-wrap gap-6 text-xs mt-2.5">
            <button type="button" onClick={()=> {setOpenModal(true)}}>Reset Password</button>
            <button type="button" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </section>

      <section className="profile_data mt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-8">
            <InputField label="First Name" name="firstname" type="text" register={register} placeholder="Enter your first name" error={errors.firstname} required/>
            <InputField label="Last Name" name="lastname" type="text" register={register} placeholder="Enter your last name" />
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <InputField label="Email" name="email" type="text" register={register} placeholder="Enter your email" />
            <InputField label="Phone Number" name="phone" type="tel" register={register} placeholder="Enter your contact number" />
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <InputField label="Grade / Designation" name="gradeOrDesignation" type="text" register={register} placeholder="Enter your Grade / Designation" />
            <InputField label="Institution / Organization" name="institutionOrOrganization" type="text" register={register} placeholder="Enter your Institution / Organization" />
          </div>
          
          <div>
            <label className="block font-bold">Intro</label>
            <textarea {...register("intro")} placeholder="Enter a brief introduction about yourself in 250 characters" rows="3" className="mt-1 p-2 w-full border-gray border rounded-md focus:ring focus:ring-blue-300"></textarea>
          </div>

          <InputField label="LinkedIn URL" name="linkedin" type="text" register={register} placeholder="Enter your LinkedIn profile url" />
          <InputField label="Instagram URL" name="instagram" type="text" register={register} placeholder="Enter your Instagram profile url" />
          <InputField label="X (Twitter) URL" name="x" type="text" register={register} placeholder="Enter your X profile url" />

          <div className="text-center">
            <button
              disabled={loading}
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2.5 ${loading && 'opacity-80'}`}
            >
              Save Changes{" "}
              {loading ? (
                <div className="loader small"></div>
              ) : (
                <img src="/images/save_icon.png" alt="" width="24" />
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
    {openModal && 
      <div className="z-10 fixed inset-0 backdrop-blur-2xl bg-black/80 flex justify-center items-center p-4">
        <div className="relative">
          <div className="bg-white max-h-[80vh] p-8 overflow-auto lg:min-w-96">
            <h2 className="text-lg font-bold mb-4">Reset Password</h2>
            <form onSubmit={handleSubmit(resetPassword)}>
              <div className="mb-6">
                <InputField
                  label="New Password"
                  type="password"
                  name="password"
                  register={register}
                  error={errors.password}
                  placeholder="Enter New Password"
                  required
                />
              </div>

              <div className="mb-6">
                <InputField
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  register={register}
                  error={errors.confirmPassword}
                  placeholder="Confirm New Password"
                  required
                />
              </div>

              <button
                disabled={pwdLoading}
                type="submit"
                className={`text-sm px-4 py-2 bg-blue-600 text-white rounded-md bg-primary flex items-center gap-2.5 ${pwdLoading && "opacity-80"}`}
              >
                Save{" "}
                {pwdLoading ? (
                  <div className="loader small"></div>
                ) : (
                  <img src="/images/save_icon.png" alt="" width="14" />
                )}
              </button>
            </form>
          </div>
          <button
            className="absolute -top-3 -right-3"
            onClick={() => setOpenModal(false)}
          >
            <img
              src="/images/close_icon.png"
              alt="Close icon"
              className="w-6"
            />
          </button>
        </div>
      </div>
    }
    </>
  );
}
