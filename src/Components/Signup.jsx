import React, { useEffect, useState } from "react"

import { auth } from "./firebase-config"
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/compat";


import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase-config";
import { doc, addDoc, collection, setDoc, getDoc, getDocs, updateDoc } from "firebase/firestore";

const Signup = ({ firebaseapp, setUser, setCookie }) => {

  const navigate = useNavigate()
  const [state, setState] = useState({
    email: "",
    password: "",
    username: "",
    canSubmit: false,
  })
  const [user, loading, error] = useAuthState(auth);
  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      return navigate("/books")
    }
  }, [user, loading])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleUsernameChange = async (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (value != "") {
      const ref = doc(db, "usernames", value);
      const docSnap = await getDoc(ref);
      const isUsernameAvailable = !docSnap.exists();
      setState((prevState) => ({
        ...prevState,
        canSubmit: isUsernameAvailable,
      }));
      if (!isUsernameAvailable) {
        console.log("Username already taken");
        setNameError(true);
      }
    }
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(
      auth,
      state.email,
      state.password,
      state.username
    )
      .then((userCredential) => {
        // Signed in
        console.log("credential user", userCredential.user);
        setUser(userCredential.user);
        console.log(userCredential.user);
        // const id = userCredential.user.uid + "";
        setDoc(doc(db, "User", userCredential.user.uid), {
          _id: userCredential.user.uid,
          email: userCredential.user.email,
          score: 20000,
        });
        setDoc(doc(db, "usernames", state.username), {
          _id: userCredential.user.uid,
        });
        setCookie("firebaseAccessToken", userCredential.user.accessToken, {
          path: "/",
        });
        navigate("/books");
        // ...
      })
      .catch((error) => {
        console.log("error");
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  return (
    <form
      class="flex justify-center h-full w-full items-center mt-5"
      onSubmit={handleSubmit}
    >
      <div class="w-[400px] flex flex-col items-center ">
        <h1 class="text-center text-2xl font-bold text-gray-600 mb-6">
          Sign Up
        </h1>
        <div class="w-3/4 mb-6">
          <input
            required="true"
            type="email"
            name="email"
            id="email"
            class="w-full py-4 px-8 bg-slate-200 placeholder:font-semibold rounded hover:ring-1 outline-blue-500"
            placeholder="Email"
            onChange={handleChange}
          />
        </div>{" "}
        <div class="w-3/4 mb-6">
          <input
            required="true"
            type="text"
            name="username"
            id="username"
            class="w-full py-4 px-8 bg-slate-200 placeholder:font-semibold rounded hover:ring-1 outline-blue-500 "
            placeholder="Username"
            onChange={handleUsernameChange}
          />
        </div>
        <div class="w-3/4 mb-6">
          <input
            required="true"
            type="password"
            name="password"
            id="password"
            class="w-full py-4 px-8 bg-slate-200 placeholder:font-semibold rounded hover:ring-1 outline-blue-500 "
            placeholder="Password"
            onChange={handleChange}
          />
        </div>
        {/* <div class="w-3/4 flex flex-row justify-between">
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
        </div> */}
        {nameError && <span className="text-red-500">Username already taken</span>}
        <div class="w-3/4 mt-4">
          <button
            type="submit"
            id="submit"
            class="py-4 bg-blue-400 w-full rounded text-blue-50 font-bold hover:bg-blue-700"
            disabled={!state.canSubmit}
          >
            Signup
          </button>
        </div>
      </div>
    </form>
  );
};

export default Signup;
