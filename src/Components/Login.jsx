import React, { useState } from "react"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"

const Login = ({ firebaseapp, setUser }) => {
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
    console.log("loggingin")
    signInWithEmailAndPassword(auth, state.email, state.password)
      .then((userCredential) => {
        // Signed in
        console.log(userCredential.user)
        setUser(userCredential.user)
        // ...
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
      })
  }
  return (
    <form className="" onSubmit={handleSubmit}>
      <input name="email" type="email" className="" onChange={handleChange} />
      <input name="password" type="password" onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  )
}

export default Login
