// utils/media.js
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const mediaUpload = async (data, id) => {
    try {
      let response;
      if (id) {
        response = await fetch(
          `${API_BASE_URL}/media/${id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `JWT ${localStorage.getItem("auth_token")}`,
            },
            body: data,
          }
        );
      } else {
        response = await fetch(`${API_BASE_URL}/media`, {
          method: "POST",
          headers: {
            Authorization: `JWT ${localStorage.getItem("auth_token")}`,
          },
          body: data,
        });
      }
  
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      return await response.json();
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw new Error("Error uploading image");
    }
};
