import React from "react";

const showSquare = (n, handleClick, val) => {
  return (
    <div
      className="box h-16 w-16 border border-gray-800 flex justify-center items-center
                 bg-sky-300 transition duration-200 ease-in-out 
                 hover:bg-black-400 cursor-pointer rounded-lg
                 md:h-20 md:w-20 lg:h-24 lg:w-24"
      value={n}
      onClick={() => handleClick(n)}
    >
      <span className="text-4xl font-bold">{val}</span>
    </div>
  );
};

export default showSquare;
