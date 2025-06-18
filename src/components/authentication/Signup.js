import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = ({ setCheck }) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState();
  const [picPreview, setPicPreview] = useState(null);
  const [picLoading, setPicLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const submitHandler = async (e) => {
    e.preventDefault();
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      alert("Please fill all the fields");
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      alert("Passwords do not match");
      setPicLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        "https://game-diei.onrender.com/api/users/signup",
        { name, email, password, pic },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      navigate("/games");
    } catch (error) {
      alert(error.response.data.message);
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      alert("Please select an image!");
      setPicLoading(false);
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicPreview(reader.result);
      };
      reader.readAsDataURL(pics);

      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-App");
      data.append("cloud_name", "dmvaoezsl");
      fetch("https://api.cloudinary.com/v1_1/dmvaoezsl/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          setPicLoading(false);
        });
    } else {
      alert("Please select a valid image format (jpeg/png)!");
      setPicLoading(false);
      return;
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length >= 8) setPasswordStrength(100);
    else if (password.length >= 6) setPasswordStrength(75);
    else if (password.length >= 4) setPasswordStrength(50);
    else setPasswordStrength(25);
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Sign Up
        </h2>
        <form className="space-y-4" onSubmit={submitHandler}>
          <div className="relative group">
            <label className="absolute -top-2 left-2 bg-white text-gray-700 text-sm px-1 transition-all group-focus-within:-top-5 group-focus-within:text-indigo-600">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              required
            />
          </div>
          <div className="relative group">
            <label className="absolute -top-2 left-2 bg-white text-gray-700 text-sm px-1 transition-all group-focus-within:-top-5 group-focus-within:text-indigo-600">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              required
            />
          </div>
          <div className="relative">
            <label className="block text-sm text-gray-700">Password</label>
            <div className="relative group">
              <input
                type={show ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  checkPasswordStrength(e.target.value);
                }}
                className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
              <button
                type="button"
                onClick={handleClick}
                className="absolute right-2 top-2 text-sm text-gray-600"
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
            <div className="h-2 mt-1 bg-gray-300 rounded-full">
              <div
                className={`h-full rounded-full transition-all ${
                  passwordStrength === 100
                    ? "bg-green-500"
                    : passwordStrength >= 75
                    ? "bg-yellow-500"
                    : passwordStrength >= 50
                    ? "bg-orange-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${passwordStrength}%` }}
              ></div>
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm text-gray-700">
              Confirm Password
            </label>
            <div className="relative group">
              <input
                type={show ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmpassword}
                onChange={(e) => setConfirmpassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
              <button
                type="button"
                onClick={handleClick}
                className="absolute right-2 top-2 text-sm text-gray-600"
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700">
              Upload your Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => postDetails(e.target.files[0])}
              className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            {picPreview && (
              <div className="mt-4">
                <img
                  src={picPreview}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={picLoading}
            className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-indigo-500 focus:outline-none transition-all transform hover:scale-105"
          >
            {picLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <button
            className="font-medium text-indigo-600 hover:underline"
            onClick={() => {
              setCheck(true);
            }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
