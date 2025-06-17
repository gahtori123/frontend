import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
 import axios from "axios";

const Login = ({ setCheck }) => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setShake(true); // Trigger shake animation on error
      setTimeout(() => setShake(false), 500); // Remove shake after 500ms

      toast.error("Please fill all fields properly.");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
        withCredentials: true,
      };

      const  {data} = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password },
        config
      );
      console.log(data);

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/games");
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
    }
  };

  const fillGuestCredentials = () => {
    
    setEmail("guest@example.com");
    setPassword("123456");
  };

  // useEffect(()=>{
  //   const logged=localStorage.getItem("userInfo");
  //   if(logged) navigate("/games");

  // },[])

  return (
    <div className="flex items-center justify-center min-h-screen  animate-fade-in p-4 sm:p-0">
      <div
        className={`w-full max-w-sm sm:max-w-md lg:max-w-lg p-6 space-y-6 bg-white rounded-lg shadow-md transition-transform duration-500 ${
          shake ? "animate-shake" : ""
        }`}
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 animate-slide-down">
          Login
        </h2>
        <form onSubmit={submitHandler} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="w-full px-3 py-2 mt-1 text-sm border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              required
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full px-3 py-2 mt-1 text-sm border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={handleClick}
                className="absolute top-2 right-2 text-sm text-gray-500 hover:text-gray-700 transition-all duration-300"
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <button
          onClick={fillGuestCredentials}
          className="w-full px-4 py-2 mt-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
        >
          Get Guest User Credentials
        </button>
        <p className="text-sm text-center text-gray-500">
          Didn't have an account?{" "}
          <Link
            onClick={() => setCheck(false)}
            className="font-medium text-indigo-600 hover:underline"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
