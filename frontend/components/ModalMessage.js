import { useState } from 'react';

const ModalMessage = ({ message, onClose }) => {
  return (
    <div className="modal ">
      <div className="modal-content smash">
        <p>{message}</p>
        <button onClick={onClose} className="control">Cerrar</button>
      </div>
    </div>
  );
};

export default ModalMessage;
