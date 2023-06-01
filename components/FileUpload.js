"use client";
import React, { useState, useEffect } from "react";
import { storage } from "@firebase/config";
import { ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ModalMessage from '@components/ModalMessage';


export default function FileUpload() {
  const [imageUpload, setImageUpload] = useState(null);
  const [userFolder, setUserFolder] = useState("");

  const [showModal, setShowModal] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState('');

  const openModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
};

const closeModal = () => {
    setShowModal(false);
};

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserFolder(user.uid); // Obtener el ID de usuario y asignarlo como carpeta del usuario
      }
    });
  }, []);

  const uploadImage = () => {
    if (imageUpload == null) return openModal("Por favor selecciona un archivo");
    const imageRef = ref(
      storage,
      `files/${userFolder}/${imageUpload.name + uuidv4()}`
    );
    uploadBytes(imageRef, imageUpload).then(() => {
      openModal("Archivo subido");
    });
  };

  return (
    <section>
      <h2>Subida de documentos</h2>
      <div className="aureole one smosh mt13 mb13">
        <label className="button-fill" >
          <input
            style={{ display: 'none' }}
            className="control"
            type="file"
            onChange={(event) => {
              setImageUpload(event.target.files[0]);
            }}

          />
          Seleccionar Documento
        </label>

        <button className="button-fill" onClick={uploadImage}>Subir Documento {imageUpload?.name}</button>
      </div>
      {showModal && (
                <ModalMessage message={modalMessage} onClose={closeModal} />
            )}
    </section>
  );
}

