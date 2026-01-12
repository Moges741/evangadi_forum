import React, { useState, useContext, useRef } from "react";
import { AppState } from "../../App";
import axios from "../../Api/axiosConfig";
import { toast } from "react-toastify";
import { IoIosContact, IoMdCamera } from "react-icons/io";
import styles from "./profile.module.css";

function Profile() {
  const { user, setUser } = useContext(AppState);
  const [profilePicture, setProfilePicture] = useState(
    user?.profile_picture || ""
  );
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, or GIF)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload the file
    uploadProfilePicture(file);
  };

  // Upload profile picture
  const uploadProfilePicture = async (file) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await axios.post(
        "/user/upload-profile-picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);

      const newProfilePictureUrl = response.data.profilePictureUrl;
      setProfilePicture(newProfilePictureUrl);

      // Update user context
      setUser((prev) => ({
        ...prev,
        profile_picture: newProfilePictureUrl,
      }));

      toast.success("Profile picture updated successfully!");
      setPreviewUrl(""); // Clear preview
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error(
        error.response?.data?.message || "Failed to upload profile picture"
      );
      setPreviewUrl(""); // Clear preview on error
    } finally {
      setUploading(false);
    }
  };

  // Remove profile picture
  const removeProfilePicture = async () => {
    try {
      await axios.delete("/user/remove-profile-picture", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfilePicture("");
      setPreviewUrl("");

      // Update user context
      setUser((prev) => ({
        ...prev,
        profile_picture: "",
      }));

      toast.success("Profile picture removed successfully!");
    } catch (error) {
      console.error("Error removing profile picture:", error);
      toast.error(
        error.response?.data?.message || "Failed to remove profile picture"
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <h2>Profile Settings</h2>

        <div className={styles.profilePictureSection}>
          <div className={styles.pictureContainer}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className={styles.profileImage}
              />
            ) : profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className={styles.profileImage}
              />
            ) : (
              <div className={styles.defaultAvatar}>
                <IoIosContact size={120} />
              </div>
            )}

            <div className={styles.uploadOverlay}>
              <button
                className={styles.uploadButton}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <IoMdCamera size={24} />
                {uploading ? "Uploading..." : "Change Photo"}
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />

          <div className={styles.profileInfo}>
            <h3>
              {user?.firstname} {user?.lastname}
            </h3>
            <p>@{user?.username}</p>
            <p>{user?.email}</p>
          </div>

          <div className={styles.actionButtons}>
            <button
              className={styles.uploadBtn}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload New Photo"}
            </button>

            {profilePicture && (
              <button
                className={styles.removeBtn}
                onClick={removeProfilePicture}
                disabled={uploading}
              >
                Remove Photo
              </button>
            )}
          </div>

          <div className={styles.uploadInfo}>
            <p>• Supported formats: JPEG, PNG, GIF</p>
            <p>• Maximum file size: 5MB</p>
            <p>• Recommended size: 400x400 pixels</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
