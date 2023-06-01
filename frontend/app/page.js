"use client";
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuthContext } from "@context/AuthContext";
import { useRouter } from "next/navigation";
import firebase_app from "@firebase/config";
import { getFirestore } from "firebase/firestore";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "@firebase/config";
import Navbar from "@components/NavBar";

export default function Home() {
  const db = getFirestore(firebase_app);
  const { user } = useAuthContext();
  const router = useRouter();
  const [files, setFiles] = useState([]);

  const isImage = (fileName) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const extension = fileName
      .substring(fileName.lastIndexOf("."))
      .toLowerCase();
    return imageExtensions.includes(extension);
  };

  const getPreviewComponent = (file) => {
    if (isImage(file.name)) {
      return (
        <div className="object-container">
          <object data={file.url} type="image">
            <img style={{ width: "100%" }} src={file.url} alt={file.name} />
          </object>
        </div>
      );
    } else {
      return (
        <div className="object-container">
          <object data={file.url} type="application/pdf">
            <p>La previsualización no está disponible</p>
          </object>
        </div>
      );
    }
  };

  React.useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;

        // Obtener la lista de archivos del usuario desde Firebase Storage
        const userFilesRef = ref(storage, `files/${userId}`);
        const fileList = await listAll(userFilesRef);

        const filesData = [];
        for (const file of fileList.items) {
          const downloadUrl = await getDownloadURL(file);
          filesData.push({ name: file.name, url: downloadUrl });
        }

        setFiles(filesData);
      }
    });

    if (user == null) router.push("/signin");
  }, [user]);

  return (
    <main className="page-pancake smush">
      <Navbar />
      <section >
        <h2>Mis Archivos</h2>
      <section className="aureole two mt13">
        {files.map((file, index) => (
          <div className="document" key={index}>

            <p className="file-name">{file.name}</p>
            {getPreviewComponent(file)}
            <a className="download-button" href={file.url} download={file.name}>
              Descargar
            </a>

            <a className="validate-button">Validar</a>
            <a className="delete-button">Eliminar</a>
          </div>
        ))}
        {/* Resto del código... */}
        </section>
      </section>
    </main>
  );
}
