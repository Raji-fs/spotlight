import { mediaUpload } from "@/utils/media";
import { updateTheme } from "@/utils/profile";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Theme({ data, refreshUserData }) {
  const [themeData, setThemeData] = useState(data);
  const [selectedTheme, setSelectedTheme] = useState("classic");
  const [coverImage, setCoverImage] = useState(null);
  const [themeLoading, setThemeLoading] = useState(false);
  const [coverImageLoading, setCoverImageLoading] = useState(false);
  useEffect(() => {
    setThemeData(data)
    setSelectedTheme(data?.theme || "classic");
    setCoverImage(data?.coverImage || null);
  }, [data]);

  const updateCoverImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    data.append("alt", "Cover Image");
    setCoverImageLoading(true);

    try {
      const response = await mediaUpload(data, coverImage?.id);
      if (coverImage?.id) {
        setCoverImage(response.doc);
        refreshUserData();
      } else {
        setCoverImage(response.doc);
        const payload = {
          coverImage: response.doc?.id
        };
        await updateTheme(payload, themeData?.id);
        refreshUserData();
      }
      toast.success("Cover image updated successfully!");
    } catch (error) {
      toast.error("Error uploading the cover image");
    } finally {
      setCoverImageLoading(false);
    }
  };

  const changeTheme = async (data) => {
    setThemeLoading(true)
    setSelectedTheme(data);
    const payload = {
      theme: data
    };
    try {
      await updateTheme(payload, themeData?.id);
      refreshUserData();
      toast.success("Theme updated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while updating the theme.");
    }
    finally {
      setThemeLoading(false);
    }
  };

  return (
    <section className="my-12 bg-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full">
        <p className="font-bold">Select your portfolio theme</p>
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 gap-7 mt-3 md:mt-4 lg:mt-5 mx-auto text-center">
          {["classic", "compact", "neo", "mega"].map((theme) => (
            <label
              key={theme}
              className={`flex flex-col relative bg-[#f9f9f9] border rounded-md cursor-pointer overflow-hidden ${ selectedTheme === theme ? "border-blue-500" : "border-gray"}`}
            >
              <input
                type="radio"
                name="theme"
                value={theme}
                className="hidden"
                checked={selectedTheme === theme}
                onChange={() => changeTheme(theme)}
              />
              <img
                src={`/images/${theme}.png`}
                className="h-44 object-cover object-top w-full"
                alt={`${theme} Theme`}
              />
              <div className="flex justify-between font-bold w-full p-3">
                <p className="capitalize">{theme}</p>
                {selectedTheme === theme && (
                  <img src="/images/tick_icon.png" alt="" className="w-5 h-5" />
                )}
              </div>
              {selectedTheme === theme && themeLoading && 
                <div className="absolute top-0 left-0 w-full h-full flex items-center items-center"><div className="loader small"></div></div>
              }
            </label>
          ))}
        </div>
      </div>
      <div className="w-full my-10 relative">
        <p className="font-bold">Cover Image</p>
        <div className="grid grid-cols-1 gap-7 mt-3 md:mt-4 lg:mt-5 mx-auto text-center relative">
          <input
            id="cover_image"
            className="hidden"
            type="file"
            accept="image/*"
            onChange={updateCoverImage}
          />
          <div className="w-full flex items-center justify-center">
            <button
              className="w-full"
              onClick={() => document.getElementById("cover_image").click()}
            >
              {coverImage ? (
                <div className="relative">
                  <img
                    src={coverImage?.url}
                    alt="Cover"
                    className="w-full h-56 object-cover border border-gray rounded-md"
                  />
                  <div className={`${coverImageLoading ?'opacity-100':'opacity-0'} absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center hover:opacity-100 transition-opacity`}>
                    {coverImageLoading ? (
                      <div className="h-56 w-full flex items-center justify-center bg-gray-200 border border-gray rounded-md">
                        <div className="loader small"></div>
                      </div>
                    ) : (
                      <p className="px-4 py-2 bg-blue-600 text-white rounded-md text-xs">
                        Replace Image
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 h-56 p-2 2xl:p-3 border bg-[#EBEBEB] border-gray rounded-md">
                  <div className="text-center my-auto">
                    <div className="mx-auto bg-[#264FD6] text-white w-16 h-16 flex items-center justify-center rounded-full">
                      <img
                        src="/images/gallery_icon.png"
                        alt="Add Cover Image"
                        className="w-9 h-9"
                      />
                    </div>
                    <p className="text-xs mt-2">Click here to upload</p>
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
