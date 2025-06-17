import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NotificationBell from "./NotificationBell"; // Ensure this component exists and is imported correctly
import ProfileModal from "./Profilemodal"; // Ensure this component exists and is imported correctly

const Nav = () => {
  const navigate = useNavigate();
  const { user, socket, Notification, setNotification, friends } =
    useContext(ChatContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);
  const [sentRequests, setSentRequests] = useState(new Set());
  const [setOfFriends, setSetofFriends] = useState(new Set());
  const [reqlist, setReqList] = useState([]);
  const [accepted, setAccepted] = useState(new Set());
  const [rejected, setRejected] = useState(new Set());
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    if (friends) {
      setSetofFriends(new Set(friends.map((item) => item._id)));
    }
  }, [friends]);

  const handleLogout = async () => {
    try {
      // Wait for the API request to complete
      await axios.get("http://localhost:5000/api/users/logout", {
        withCredentials: true,
      });

      localStorage.clear();
      // toast.info("You have logged out successfully.");

      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const getUser = async () => {
    if (query.length === 0) return;
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/users/list?search=${query}`,
        { withCredentials: true }
      );

      setList(data);
    } catch (err) {
      const message = err.response?.data?.message || "An error occurred";
      toast.error(message);
    }
  };

  const handleAddUser = async (recieverId) => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
      withCredentials: true,
    };
    try {
      await axios.post(
        "http://localhost:5000/api/req/send",
        { recieverId },
        config
      );
      socket.emit("addUser", { id: recieverId, userId: user._id });
      setSentRequests((prev) => new Set(prev).add(recieverId)); // Mark this user as "request sent"
      toast.success("Request sent successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send request");
    }
  };
  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/req/getrequests",
        {
          withCredentials: true,
        }
      );
      setReqList(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAcceptUser = async (requestId) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    try {
      const data = await axios.post(
        "http://localhost:5000/api/req/accept",
        { requestId },
        config
      );
      socket.emit("accepted", { user, requestId });
      toast.success(" Request accepted Successfully");
      // ("response:"+data);
      setAccepted((prev) => new Set(prev).add(requestId));
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept request");
    }
  };

  const handleRejecttUser = async (requestId) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    try {
      const { response } = await axios.post(
        "http://localhost:5000/api/req/reject",
        { requestId },
        config
      );
      setRejected((prev) => new Set(prev).add(requestId));
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject request");
    }
  };

  useEffect(() => {
    getUser();
  }, [query]);

  useEffect(() => {
    if (socket) {
      fetchRequests();
      socket.on("requestsent", (data) => {
        //  ("Friend request received:", data.name);

        // Update the Notification list
        setNotification((prev) => [
          ...prev,
          `${data.name} sent you a friend request`,
        ]);
        // Fetch updated requests
        fetchRequests();
      });

      socket.on("requestAccepted", ({ name, pic }) => {

        // Add new Notification
        setNotification((prev) => [
          ...prev,
          `${name} accepted your friend request`,
        ]);
      });

      // Cleanup listeners on component unmount or socket change
      return () => {
        socket.off("requestsent");
        socket.off("requestAccepted");
      };
    }
  }, [socket, fetchRequests]);

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      {/* Left Side: Drawer for Search Users */}
      <div className="flex items-center h-full  z-50 ">
        <button
          onClick={toggleDrawer}
          className="text-white px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
        >
          Connect with new Friends
        </button>
        <div
          className={`fixed inset-y-0 left-0 bg-gray-900 w-64 p-4 transform ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <button
            onClick={toggleDrawer}
            className="text-white mb-4 focus:outline-none"
          >
            Close
          </button>
          <div className="flex gap-6 mb-3">
            <button
              className="bg-green-600 rounded-md p-1"
              onClick={() => setOpen(true)}
            >
              Search user
            </button>
            <button
              className="bg-blue-600 rounded-md p-1"
              onClick={() => setOpen(false)}
            >
              Requests
            </button>
          </div>
          {open ? (
            <div className="text-white">
              <input
                type="text"
                placeholder="Search users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded-md"
              />

              <ul className="h-[420px] mt-4 space-y-2 overflow-y-auto">
                {list.map(
                  (item) =>
                    !(item._id === user._id) && (
                      <li
                        key={item._id}
                        className="p-1 bg-gray-600 rounded-md hover:bg-blue-500 cursor-pointer"
                      >
                        <div className="flex justify-start gap-6">
                          <img
                            src={item.profilepic}
                            className="w-6 h-6 rounded-full mr-3"
                          />
                          <p>{item.name}</p>
                        </div>
                        {sentRequests.has(item._id) ? (
                          <div className="mt-3 bg-red-600 w-[80%] rounded-md p-2 flex hover:bg-red-500">
                            <i className="ri-user-x-line mr-4"></i>
                            <p>Request sent</p>
                          </div>
                        ) : setOfFriends.has(item._id) ? (
                          <div className="mt-3 bg-blue-600 w-[80%] rounded-md p-2 flex hover:bg-blue-500">
                            <i className="ri-group-3-line"></i>
                            <button>Friends</button>
                          </div>
                        ) : (
                          <div className="mt-3 bg-green-600 w-[80%] rounded-md p-2 flex hover:bg-green-500">
                            <i className="ri-user-add-line mr-4"></i>
                            <button onClick={() => handleAddUser(item._id)}>
                              Add Friend
                            </button>
                          </div>
                        )}
                      </li>
                    )
                )}
              </ul>
            </div>
          ) : (
            <div className="text-white overflow-y-auto h-80">
              <ul className="mt-4 space-y-2">
                {reqlist.map((item) => (
                  <li
                    key={item.requestId}
                    className="p-1 bg-gray-600 rounded-md hover:bg-blue-500 cursor-pointer"
                  >
                    {item.sender && (
                      <div className="flex justify-start gap-6">
                        <img
                          src={item.sender.profilepic}
                          alt={item.sender.profilepic}
                          className="w-6 h-6 rounded-full mr-3"
                        />
                        <p>{item.sender.name}</p>
                      </div>
                    )}

                    {accepted.has(item.requestId) ? (
                      <div className="mt-3 bg-green-600 rounded-md p-2 flex hover:bg-green-500">
                        <i className="ri-chat-check-fill"></i> <p>Accepted</p>
                      </div>
                    ) : rejected.has(item.requestId) ? (
                      <div className="mt-3 bg-red-600 rounded-md p-2 flex hover:bg-red-500">
                        <i className="ri-delete-bin-7-fill"></i> <p>Rejected</p>
                      </div>
                    ) : (
                      <div className="flex gap-2 text-sm">
                        <div
                          className="mt-3 bg-green-600 rounded-md p-2 flex hover:bg-green-500"
                          onClick={() => handleAcceptUser(item.requestId)}
                        >
                          <i className="ri-user-add-line mr-4"></i>
                          <p>Accept</p>
                        </div>
                        <div
                          className="mt-3 bg-red-600 rounded-md p-2 flex hover:bg-red-500"
                          onClick={() => handleRejecttUser(item.requestId)}
                        >
                          <i className="ri-close-circle-fill"></i>
                          <p>Reject</p>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Right Side: User Profile and Logout */}

      <div className="flex items-center space-x-4">
        <NotificationBell />
        <div>
          <button onClick={() => setModalOpen(true)}>
            <i className="ri-user-fill text-4xl text-white"></i>
          </button>
          <ProfileModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
          />
        </div>

        <button
          onClick={handleLogout}
          className="text-white px-4 py-2 mx-4 bg-gray-700 rounded-md hover:bg-gray-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Nav;
