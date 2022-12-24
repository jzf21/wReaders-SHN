import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "./firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";

import React, { useEffect } from "react";
const AboutUserform = () => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const [state, setState] = useState({
    email: "",
    firstName: "",
    lastName: "",
    Adress: "",
    city: "",
    state: "",
    zip: "",
  });
  const [editable, setEditable] = useState(true);

  const action = async () => {
    console.log(user.email);
    const userRef = doc(db, "User", user.uid, "Profile", "presentProfile");
    const userDoc = await getDoc(userRef)
      .then((doc) => {
        if (doc.exists()) {
          setState((prevState) => ({
            ...prevState,
            email: doc.data().email,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            Adress: doc.data().Adress,
            city: doc.data().city,
            state: doc.data().state,
            zip: doc.data().zip,
          })).catch((error) => {
            console.log("Error getting document:", error);
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };
  useEffect(() => {
    if (loading) {
      console.log("loading");
      return;
    }
    if (!user) {
      console.log("not logged in");
      return navigate("/login");
    }
    if (error) {
      console.log("In use effect ", error);
    }
    action();
  }, [user, loading]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const updateUserProfile = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "User", user.uid, "Profile", "presentProfile");
      await setDoc(userRef, {
        email: state.email,
        firstName: state.firstName,
        lastName: state.lastName,
        Adress: state.Adress,
        city: state.city,
        state: state.state,
        zip: state.zip,
      });
      console.log("Document written with ID: ", userRef.id);
      setEditable(!editable);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  console.log("returning now");

  return (
    <div>
      <div>Hello</div>
      <form class="w-full max-w-lg mt-5 my-5" onSubmit={updateUserProfile}>
        <fieldset disabled={editable}>
          <h1 className="flex justify-center text-3xl p-5 font-semibold ">
            My Profile
          </h1>
          <div class="flex flex-wrap -mx-3 mb-6">
            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-first-name"
              >
                First Name
              </label>
              <input
                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                name="firstName"
                placeholder="first name"
                onChange={handleChange}
                value={state.firstName}
              />
              <p class="text-red-500 text-xs italic">
                Please fill out this field.
              </p>
            </div>
            <div class="w-full md:w-1/2 px-3">
              <label
                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-last-name"
              >
                Last Name
              </label>
              <input
                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="text"
                placeholder="last name"
                name="lastName"
                onChange={handleChange}
                value={state.lastName}
              />
            </div>
          </div>
          <div class="flex flex-wrap -mx-3 mb-6">
            <div class="w-full px-3">
              <label
                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-password"
              >
                Address
              </label>
              <input
                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-password"
                type="address"
                name="Adress"
                placeholder="House no/name,XYZ STREET"
                onChange={handleChange}
                value={state.Adress}
              />
              <p class="text-gray-600 text-xs italic">
                Make it as long and as crazy as you'd like
              </p>
            </div>
          </div>
          <div class="flex flex-wrap -mx-3 mb-2">
            <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-city"
              >
                City
              </label>
              <input
                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-city"
                type="text"
                placeholder="City"
                name="city"
                onChange={handleChange}
                value={state.city}
              />
            </div>
            <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-state"
              >
                State
              </label>
              <div class="relative">
                <select
                  class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-state"
                  onChange={handleChange}
                  value={state.state}
                  name="state"
                >
                  <option>New Mexico</option>
                  <option>Missouri</option>
                  <option>Texas</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    class="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="grid-zip"
              >
                Zip
              </label>
              <input
                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-zip"
                type="text"
                name="zip"
                placeholder="zip code"
                onChange={handleChange}
                value={state.zip}
              />
            </div>
          </div>
        </fieldset>
        {editable ? (
          <button
            className="px-2 py-1 bg-blue-600 rounded-lg text-white my-4"
            onClick={() => {
              setEditable(false);
            }}
            disabled={!editable}
          >
            {" "}
            Edit profile
          </button>
        ) : (
          <button
            className="px-2 py-1 bg-green-600 rounded-lg text-white my-4"
            type="submit"
          >
            Update Profile
          </button>
        )}
      </form>
    </div>
  );
};

export default AboutUserform;
