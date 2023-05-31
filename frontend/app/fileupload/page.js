"use client";
import React, { useState, useEffect } from "react";
import { storage } from "@firebase/config";
import { ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Page() {
  const [imageUpload, setImageUpload] = useState(null);
  const [userFolder, setUserFolder] = useState("");

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserFolder(user.uid); // Obtener el ID de usuario y asignarlo como carpeta del usuario
      }
    });
  }, []);

  const uploadImage = () => {
    if (imageUpload == null) return alert("Por favor selecciona un archivo");
    const imageRef = ref(
      storage,
      `files/${userFolder}/${imageUpload.name + uuidv4()}`
    );
    uploadBytes(imageRef, imageUpload).then(() => {
      alert("Archivo subido");
    });
  };

  return (
    <div className="container">
      <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      <button onClick={uploadImage}>Subir Documento</button>
    </div>
  );
}

export default Page;
