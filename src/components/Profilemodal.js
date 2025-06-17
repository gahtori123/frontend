// ProfileModal.js
import React from "react";
import Modal from "react-modal";
import { ChatContext } from "../Context/ChatProvider";
import "./ProfileModal.css";

const ProfileModal = ({ isOpen, onClose }) => {
  const { user } = React.useContext(ChatContext);

  // Debugging check to confirm prop and user data
  React.useEffect(() => {
    
  }, [isOpen, user]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="profile-modal"
      overlayClassName="overlay"
      ariaHideApp={false}
    >
      <div className="modal-content  ">
        <button onClick={onClose} className="close-button text-black">
          &times;
        </button>
        {user && (
          <>
            <div className="flex justify-center items-center">
              <img
                src={user?.pic}
                alt={user?.name}
                className="profile-picture"
              />
            </div>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ProfileModal;
