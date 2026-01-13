import React, { useState, useContext, useRef, useEffect } from "react";
import { AppState } from "../../App";
import axios from "../../Api/axiosConfig";
import { toast } from "react-toastify";
import { IoIosContact, IoMdCamera } from "react-icons/io";
import styles from "./profile.module.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../Data/data";

function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AppState);

  const [profilePicture, setProfilePicture] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const res = await axios.get("/user/profile-picture", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.profilePicture) {
          setProfilePicture(res.data.profilePicture);

          // keep global state in sync
          setUser((prev) => ({
            ...prev,
            profile_picture: res.data.profilePicture,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch profile picture:", error);
      }
    };

    if (token) {
      fetchProfilePicture();
    }
  }, [token, setUser]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, or GIF images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    uploadProfilePicture(file);
  };

  const uploadProfilePicture = async (file) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const res = await axios.post("/user/upload-profile-picture", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const imageUrl = res.data.profilePictureUrl;

      setProfilePicture(imageUrl);
      setPreviewUrl("");

      setUser((prev) => ({
        ...prev,
        profile_picture: imageUrl,
      }));

      toast.success("Profile picture updated!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Upload failed");
      setPreviewUrl("");
    } finally {
      setUploading(false);
    }
  };

  const removeProfilePicture = async () => {
    try {
      await axios.delete("/user/remove-profile-picture", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfilePicture("");
      setPreviewUrl("");

      setUser((prev) => ({
        ...prev,
        profile_picture: "",
      }));

      toast.success("Profile picture removed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove profile picture");
    }
  };

  const renderProfileImage = () => {
    if (previewUrl) {
      return (
        <img src={previewUrl} alt="Preview" className={styles.profileImage} />
      );
    }

    if (profilePicture) {
      return (
        <img
          src={`${API_BASE_URL}${profilePicture}`}
          alt="Profile"
          className={styles.profileImage}
        />
      );
    }

    return (
      <div className={styles.defaultAvatar}>
        <IoIosContact size={120} />
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <h2>Profile Settings</h2>

        <div className={styles.profilePictureSection}>
          <div className={styles.pictureContainer}>
            {renderProfileImage()}

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
            hidden
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
              Upload New Photo
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
            <p>• JPEG, PNG, GIF</p>
            <p>• Max size: 5MB</p>
            <p>• Recommended: 400×400</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
