import InputField from "@/components/form/Input";
import { mediaUpload } from "@/utils/media";
import { createWork, removeWork, updateUser, updateWork } from "@/utils/works";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Works({ data, refreshUserData }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();
  const [works, setWorks] = useState(data);
  const [selectedWork, setSelectedWork] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState(null);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  useEffect(() => {
    setWorks(data)
  }, [data]);
  const openModal = (work) => {
    setUploadedMedia(null);
    setSelectedWork(work);
    if (work) {
      Object.keys(work).forEach((key) => setValue(key, work[key]));
      setValue("date", work?.date ? new Date(work.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
    } else {
      setValue("title", "");
      setValue("description", "");
      setValue("works", null);
      setValue("date", new Date().toISOString().split("T")[0]);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedWork(null);
    setModalOpen(false);
  };

  const updateMedia = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const allowedTypes = ["image/", "video/"];
    if (!allowedTypes.some(type => file.type.startsWith(type))) {
      toast.error("Unsupported file format. Only images and videos are allowed.");
      return;
    }
  
    const data = new FormData();
    data.append("file", file);
    data.append("alt", "Work Image");
    setMediaLoading(true);

    try {
      const response = await mediaUpload(data);
      setUploadedMedia(response?.doc);
    } catch (error) {
      toast.error("Error uploading the media");
    }finally {
      setMediaLoading(false);
    }
  };  

  const onSubmit = async (data) => {
    const payload = {
      title: data?.title,
      description: data?.description,
      date: data?.date,
      works: uploadedMedia?.id || selectedWork?.works?.id
    };
    setLoading(true);
    try {
      let result;
      if (selectedWork) {
        result = await updateWork(payload, selectedWork?.id);
        toast.success("Work updated successfully");
      } else {
        result = await createWork(payload);
        if (result?.doc) {
          const updatedWorkIds = works?.map((work) => work.id) || [];
          updatedWorkIds.push(result.doc.id);
          await updateUser({ work: updatedWorkIds });
          toast.success("New work added successfully");
        }
      }
      refreshUserData();
      setLoading(false);
      closeModal();
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while updating your work");
    }
  };

  const deleteWork = async () => {
    setDeleteLoading(true);
    try {
      const response = await removeWork(selectedWork?.id);
      const updatedWorkIds = works.map(work => work.id).filter(id => id && id !== selectedWork?.id);
      console.log(updatedWorkIds);
      await updateUser({ work: updatedWorkIds });
      toast.success("Work deleted successfully!");
      refreshUserData()
    } catch (error) {
      toast.error("Error deleting the work");
    }finally {
      setDeleteLoading(false);
      setModalOpen(false)
    }
  }

  return (
    <div className="flex justify-center">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mt-6 grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          className="w-full h-70 min-[480px]:w-48 min-[480px]:h-56 flex items-center justify-center border border-[#B2B2B2] bg-[#EBEBEB] rounded-md cursor-pointer"
          onClick={() => openModal(null)}
        >
          <div className="text-center">
            <div className="mx-auto bg-[#264FD6] text-white w-16 h-16 flex items-center justify-center rounded-full">
              <img
                src="/images/plus.png"
                alt="Add new work"
                className="w-9 h-9"
              />
            </div>
            <p className="text-xs mt-2">Add new work</p>
          </div>
        </div>
        {works?.map((work, index) => (
          <div
            key={index}
            className="w-full h-70 min-[480px]:w-48 min-[480px]:h-56 border border-[#B2B2B2] bg-[#EBEBEB] rounded-md cursor-pointer overflow-hidden relative flex items-center justify-center"
            onClick={() => openModal(work)}
          >
            {work?.works?.mimeType?.includes("video") ?
              <>
              <video
                className="w-full h-full object-cover"
              >
                <source src={work?.works?.url} type="video/mp4" />
              </video>
              <button className="z-[2] absolute m-auto inset-0 flex items-center justify-center bg-black/40 text-white text-4xl rounded-full w-16 h-16 transition hover:bg-black/50">
                ▶
              </button>
              </>
            :
              <img
                src={work?.works?.url || '/images/gallery_icon.png'}
                alt="Work Image"
                className={`${work?.works?.url ? 'w-full h-full' : 'w-10 h-10'} object-cover`}
              />
            }
          </div>
        ))}
      </div>
      {modalOpen && (
        <div className="z-10 fixed inset-0 backdrop-blur-2xl bg-black/80 flex justify-center items-center p-4">
          <div
            className="relative top-4 max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white h-[80vh] p-8 overflow-auto">
              <h2 className="text-lg font-bold mb-4">
                {selectedWork ? `Edit ${selectedWork?.title}` : "Add New Work"}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <InputField
                  label="Title"
                  name="title"
                  type="text"
                  register={register}
                  placeholder="Enter title"
                />
                <div className="mb-4">
                  <label className="block font-bold">Description</label>
                  <textarea
                    {...register("description")}
                    placeholder="Enter a brief introduction about work"
                    rows="3"
                    className="mt-1 p-2 w-full border-gray border rounded-md focus:ring focus:ring-blue-300"
                  ></textarea>
                </div>
                <InputField
                  label="Date"
                  name="date"
                  type="date"
                  register={register}
                  placeholder="Select a date"
                />
                <label className="block font-bold">Media</label>
                <div
                  className={`relative ${!selectedWork?.works ? "w-32 h-32" : ""} max-w-[50%] bg-[#D9D9D9] flex flex-col items-center justify-center overflow-hidden group rounded-md`}
                >
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-70 transition-opacity"></div>
                  {uploadedMedia?.mimeType?.includes("video") ||
                  selectedWork?.works?.mimeType?.includes("video") ? (
                    <video
                      src={uploadedMedia?.url || selectedWork?.works?.url}
                      className="w-full h-full object-cover"
                      autoPlay
                    ></video>
                  ) : (
                    <img
                      src={
                        uploadedMedia?.url ||
                        selectedWork?.works?.url ||
                        "/images/gallery_icon.png"
                      }
                      alt="Work Preview"
                      className={`object-cover ${uploadedMedia?.url || selectedWork?.works?.url ? "w-full h-full" : "w-10 h-10"}`}
                    />
                  )}
                  <input
                    id="fileInput"
                    className="hidden absolute inset-0 cursor-pointer"
                    type="file"
                    accept="image/*,video/*"
                    onChange={updateMedia}
                  />
                  {mediaLoading ? (
                    <div className="overlay-button absolute inset-0 flex items-center justify-center opacity-100 transition-opacity z-10">
                      <div className="flex justify-center items-center w-full h-full">
                        <div className="loader small"></div>
                      </div>
                    </div>
                  ) : (
                  <div className="overlay-button absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        type="button"
                        onClick={() => document.getElementById("fileInput").click()}
                        className="px-2 py-1 bg-blue-600 text-white rounded-md text-[8px]"
                      >
                        {selectedWork?.works?.url ? "Replace Media" : "Upload Media"}
                      </button>
                  </div>
                  )}
                </div>
                <div className="text-center flex justify-end gap-4">
                  {selectedWork?.id && <button
                    disabled={deleteLoading}
                    type="button"
                    className={`px-4 py-2 bg-gray text-black rounded-md flex items-center gap-2.5 ${deleteLoading && "opacity-80"}`}
                    onClick={deleteWork}
                  >
                    Delete
                    {deleteLoading ? (
                      <div className="loader small"></div>
                    ) : (
                      <img src="/images/delete.svg" alt="" width="15" />
                    )}
                  </button>}
                  <button
                    disabled={loading}
                    type="submit"
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md bg-primary flex items-center gap-2.5 ${loading && "opacity-80"}`}
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
            </div>
            <button
              className="absolute -top-3 -right-3"
              onClick={() => closeModal(null)}
            >
              <img
                src="/images/close_icon.png"
                alt="Close icon"
                className="w-6"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
