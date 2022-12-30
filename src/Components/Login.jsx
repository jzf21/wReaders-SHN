import React, { useState } from "react";
import {

  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,

} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth"
import { useEffect } from "react";
// import AddDoc from "./AddDoc"

const Login = ({ firebaseapp, setUser, setCookie }) => {
  const auth = getAuth(firebaseapp);
  const navigate = useNavigate();

  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [loggedin, loading, error] = useAuthState(auth)
  useEffect(() => {
    if (loggedin) {
      setUser(loggedin)
      console.log(loggedin.email + " logged in")
      navigate("/books");
      return;
    }
    if (loading) {
      console.log("loading")
      return
    }
    if (error) {
      console.log(error)
    }

  }, [loggedin, loading])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("loggingin");
    signInWithEmailAndPassword(auth, state.email, state.password)
      .then((userCredential) => {
        // Signed in
        console.log("logged in");
        console.log(userCredential.user);
        setUser(userCredential.user);
        setCookie("firebaseAccessToken", userCredential.user.accessToken, {
          path: "/",
        });
        navigate("/books");

        // ...
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <form
      class="flex justify-center h-full w-full md:min-w-[600px] items-center mt-5"
      onSubmit={handleSubmit}
    >
      <div class="w-full md:w-1/2 flex flex-col items-center md:min-w-[400px] ">
        <h1 class="text-center text-2xl font-bold text-gray-600 mb-6">Login</h1>
        <div class="w-3/4 mb-6">
          <input
            type="email"
            name="email"
            id="email"
            required
            class="w-full py-4 px-8 bg-slate-200 placeholder:font-semibold rounded hover:ring-1 outline-blue-500"
            placeholder="Email"
            onChange={handleChange}
          />
          {/* <AddDoc /> */}
        </div>
        <div class="w-3/4 mb-6">
          <input
            type="password"
            name="password"
            id="password"
            required
            class="w-full py-4 px-8 bg-slate-200 placeholder:font-semibold rounded hover:ring-1 outline-blue-500 "
            placeholder="Password"
            onChange={handleChange}
          />
        </div>
        <div class="w-3/4 flex flex-row justify-between">
          <div class=" flex items-center gap-x-1">
            <input type="checkbox" name="remember" id="" class=" w-4 h-4  " />
            <label for="" class="text-sm text-slate-400">
              Remember me
            </label>
          </div>
          <div>
            <a href="#" class="text-sm text-slate-400 hover:text-blue-500">
              Forgot?
            </a>
          </div>
          <div>
            <a href="/" class="text-sm text-slate-400 hover:text-blue-500">
              Create an account
            </a>
          </div>
        </div>
        <div class="w-3/4 mt-4">
          <button
            type="submit"
            class="py-4 bg-blue-400 w-full rounded text-blue-50 font-bold hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    </form>
  );
};

export default Login;
