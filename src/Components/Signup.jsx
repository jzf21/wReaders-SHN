import React, { useState } from "react"

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"

const Signup = ({ firebaseapp, setUser, setCookie }) => {
  const [state, setState] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
    console.log(state)
  }

  const auth = getAuth(firebaseapp)

  const handleSubmit = (e) => {
    e.preventDefault()
    createUserWithEmailAndPassword(auth, state.email, state.password)
      .then((userCredential) => {
        // Signed in
        setUser(userCredential.user)
        console.log(user)
        setCookie("firebaseAccessToken", userCredential.user.accessToken, {
          path: "/",
        })
        // ...
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        // ..
      })
  }

  return (
    <form
      class="flex justify-center h-full w-full items-center"
      onSubmit={handleSubmit}
    >
      <div class="w-full md:w-1/2 flex flex-col items-center ">
        <h1 class="text-center text-2xl font-bold text-gray-600 mb-6">Sign Up</h1>
        <div class="w-3/4 mb-6">
          <input
            type="email"
            name="email"
            id="email"
            class="w-full py-4 px-8 bg-slate-200 placeholder:font-semibold rounded hover:ring-1 outline-blue-500"
            placeholder="Email"
            onChange={handleChange}
          />
        </div>
        <div class="w-3/4 mb-6">
          <input
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
        <div class="w-3/4 mt-4">
          <button
            type="submit"
            class="py-4 bg-blue-400 w-full rounded text-blue-50 font-bold hover:bg-blue-700"
          >
            Signup
          </button>
        </div>
      </div>
    </form>
  )
}

export default Signup
