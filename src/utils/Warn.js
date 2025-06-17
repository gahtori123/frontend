import { useEffect } from "react";

const Warn = (socket) => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      
      event.preventDefault(); // Prevent the default action
          socket.emit("leavingRoom", { intentional: true });    
        };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
};

export default Warn;
