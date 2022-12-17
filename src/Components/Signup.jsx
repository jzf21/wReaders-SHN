import React, { useState } from "react"

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"

const Signup = ({ firebaseapp, setUser }) => {
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
        // ...
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        // ..
      })
  }

  return (
    <form className="" onSubmit={handleSubmit}>
      <input name="email" type="email" className="" onChange={handleChange} />
      <input name="password" type="password" onChange={handleChange} />
      <button type="submit">Signup</button>
    </form>
  )
}

export default Signup
