import { useState } from "react";
import { uploadToCloudinary } from "../services/cloudinary";
import api from "../services/api";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [price, setPrice] = useState("");
  const [video, setVideo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video) return alert("Upload a video");

    const mediaUrl = await uploadToCloudinary(video);

    await api.post("/products", {
      title,
      caption,
      price,
      mediaUrl,
      quantityLeft: 10,
    });

    alert("Product uploaded!");
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Upload Product</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        /><br/>

        <input
          placeholder="Caption"
          onChange={(e) => setCaption(e.target.value)}
        /><br/>

        <input
          placeholder="Price"
          type="number"
          onChange={(e) => setPrice(e.target.value)}
        /><br/>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
        /><br/>

        <button type="submit">Upload</button>
      </form>
    </div>
  );
}