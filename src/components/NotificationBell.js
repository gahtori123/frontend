import React, { useContext, useState } from "react";
import { FaBell } from "react-icons/fa";
import { ChatContext } from "../Context/ChatProvider";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {Notification, setNotification} = useContext(ChatContext);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClearNotification = () => {
    setNotification([]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-400  focus:outline-none"
      >
        <FaBell size={24} className="text-white-700" />
        {Notification && Notification.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
            {Notification.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-y-auto z-50">
          <div className="p-4 border-b">
            <h4 className="font-bold text-gray-700">Notification</h4>
          </div>
          {!Notification && Notification.length == 0 ? (
            <div className="p-4 text-gray-500">No new Notification</div>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {Notification.map((notification) => (
                <li
                  key={notification.id}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  {notification}
                </li>
              ))}
            </ul>
          )}
          {Notification&&Notification.length > 0 && (
            <div className="p-4 border-t">
              <button
                onClick={handleClearNotification}
                className="w-full text-sm font-medium text-indigo-600 hover:underline"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
