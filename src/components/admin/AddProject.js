import React, { useState } from "react";
import styled from "styled-components";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import PanelNavbar from "./PanelNavbar";
import { storage, db, auth } from "../../utils/firebase";

const Container = styled.div`
text-align: center;

`

const AddProject = () => {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tech: "",
    video: "",
    website: "",
    code: "",
    uiux: "",
    image: [],
  });

  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleImageChange = (e) => {
    setFormData({ ...formData, imageUrl: e.target.files });
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.websiteUrl) {
      alert("Please fill this field");
      return;
    }

    const storageRef = ref(
      storage,
      `/images/${formData.imageUrl.name}`
    );

    const uploadImage = uploadBytesResumable(storageRef, formData.imageUrl);

    uploadImage.on(
      "state_changed",
      (snapshot) => {
        const progressPercent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progressPercent);
      },
      (error) => {
        console.log(error);
      },
      () => {
        setFormData({
          title: "",
          description: "",
          tech: "",
          video: "",
          website: "",
          code: "",
          uiux: "",
          image: [],
        });

        getDownloadURL(uploadImage.snapshot.ref).then((url) => {
          const projectRef = collection(db, "Projects");
          addDoc(projectRef, {
            title: formData.title,
            description: formData.description,
            tech: formData.tech,
            video: formData.video,
            website: formData.website,
            code: formData.code,
            uiux: formData.uiux,
            image: [],

          })
            .then(() => {
              toast("Article added successfully", { type: "success" });
              setProgress(0);
            })
            .catch((err) => {
              toast("Error adding article", { type: "error" });
            });
        })
      }
    )
  }

  return (
    <Container>
      {!user ? (
        <>
          <h2>
            <Link to="/signin">Login to create</Link>
          </h2>
        </>
      ) : (
        <>
          <PanelNavbar />
          <div>
            <h2>Create Project</h2>
          </div>
          <div className="border-box">
            <label>Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="">
            <label>Tech</label>
            <input
              type="text"
              name="tech"
              className="form-control"
              value={formData.tech}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="">
            <label>Website</label>
            <input
              type="text"
              name="website"
              className="form-control"
              value={formData.website}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="">
            <label>Code</label>
            <input
              type="text"
              name="code"
              className="form-control"
              value={formData.code}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="">
            <label>UIUX</label>
            <input
              type="text"
              name="uiux"
              className="form-control"
              value={formData.website}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="">
            <label>Video</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.video}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div>
            <label>Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="form-control"
              onChange={(e) => handleImageChange(e)}
            />

            {progress === 0 ? null : (
              <div className="">
                <div
                  className=""
                  style={{ width: `${progress}%` }}
                >
                  {`uploading image ${progress}%`}
                </div>
              </div>
            )}
          </div>
          <button
            className=""
            onClick={handleSubmit}
          >
            save
          </button>
        </>
      )}
    </Container>
  )
}

export default AddProject;