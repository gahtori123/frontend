import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import tichome from "../../../images/home2.webp";
import { ChatContext } from "../../../Context/ChatProvider";
import NotificationBell from "../../NotificationBell";
const TttHome = () => {
  const [id, setId] = useState(null);
  const [gid, setGid] = useState(null);
  const navigate = useNavigate();
  const {
    user,
    setUser,
    friends,
    setFriends,
    socket,
    setSocket,
    notification,
    setNotification,
  } = useContext(ChatContext);
  // (friends);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id == null) {
      toast.error("Please fill all fields properly.");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      await axios.post(
        "http://localhost:5000/api/ttt/joinroom",
        {
          uId: id,
          userId: user._id,
        },
        config
      );
      toast.success("You have joined the room successfully!");
      navigate(`/games/ttt/${id}`);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const createRoom = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/ttt/createroom"
      );
      setGid(data);
      //  toast.success("Success message!", {
      //    position: "top-right",
      //    autoClose: 3000, // Time in milliseconds before the toast disappears
      //    hideProgressBar: false,
      //    closeOnClick: true,
      //    pauseOnHover: true,
      //    draggable: true,
      //    progress: undefined,
      //  });
    } catch (err) {
      toast.error("Failed to create a new room. Please try again.");
    }
  };

  const handleClick = (id) => {
    //  ("hello");
    //  (socket);

    // if(socket)
    socket.emit("sendMessage", { id, user, gid });
  };

  useEffect(() => {
    if (socket) {

      socket.on("sendMessageRecieved", ({ gid, user }) => {
        setNotification((prev) => [
          ...prev,
          `${user.name} invited you to tttRoom:${gid} `,
        ]);
      });

      return () => socket.off("sendMessageRecieved");
    }
  }, [socket]);

  return (
    <div
      className="flex flex-col relative  items-center h-[1600px] bg-gray-100 p-4"
      style={{
        backgroundImage: `url(${tichome})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className=" absolute right-20 ">
        <NotificationBell />
      </div>

      <div className="bg-white shadow-md  mt-[100px] rounded-lg p-6 max-w-lg w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
          Tic Tac Toe
        </h1>

        <div className="mb-6">
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder="Enter the room ID"
              className="border border-gray-400 p-3 rounded-md focus:outline-none focus:border-blue-500"
              onChange={(e) => setId(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Join Room
            </button>
          </form>
        </div>

        <div className="text-center text-gray-500 mb-4">OR</div>

        <div className="flex flex-col items-center">
          <button
            className="bg-red-500 text-white py-3 px-6 rounded-md hover:bg-red-600 transition duration-300 mb-4"
            onClick={createRoom}
          >
            Create a New Room
          </button>

          {gid && (
            <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-md">
              <p className="text-lg font-semibold">Room ID: {gid}</p>
              <span
                className="text-blue-600 hover:text-blue-500 cursor-pointer"
                onClick={() => navigator.clipboard.writeText(gid)}
              >
                <i className="ri-file-copy-2-fill" /> Copy Room ID
              </span>
              <p className="mt-2 text-sm text-gray-500">
                Please share this ID with your friends to join the game.
              </p>

              <form></form>
              <div className=" overflow-y-auto  h-60">
                {friends.map((friend) => (
                  <div
                    key={friend._id}
                    className="flex items-center bg-sky-400 w-[80%]  rounded-md gap-2 mb-1 hover:bg-sky-300 cursor-pointer"
                  >
                    <img
                      className="h-8 w-8 rounded-full "
                      src={friend.pic}
                      alt={friend.username}
                    ></img>
                    <p>{friend.name}</p>
                    <i
                      className="ri-add-circle-line text-4xl"
                      onClick={() => handleClick(friend._id)}
                    ></i>{" "}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default TttHome;
