import React from 'react';
import '../styles/Modal.css';

const Modal = ({ message, onClose }) => {
    return (
        <div className="modal-container">
            <div className="modal-content-box">
                <div className="modal-close">
                <button className="modal-close-btn" onClick={onClose}></button>
                </div>
                <p className="modal-text">{message}</p>
            </div>
        </div>
    );
};

export default Modal;
