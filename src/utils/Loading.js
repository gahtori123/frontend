// WaitingForPlayer.js
import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4"></div>
      <p className="text-xl font-semibold text-gray-700">
        Waiting for another player to join...
      </p>
    </div>
  );
};

export default Loading;
