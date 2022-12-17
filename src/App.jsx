import "./App.scss"
import Bookcard from "./Components/bookcard"
import Sidebar from "./Components/Sidebar"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { initializeApp } from "firebase/app"
import { firebaseConfig } from "./Components/firebase-config"

import Signup from "./Components/Signup"
import Login from "./Components/Login"
import { useState } from "react"

function App() {
  const app = initializeApp(firebaseConfig)

  const [user, setUser] = useState(null)

  return (
    <>
      <div className="grid grid-cols-2">

        <div className="col-span-1">
          <Sidebar />
        </div>
        <div className="col-span-1">
        {JSON.stringify(user)}
          <Router>
            <Routes>
              <Route
                path="/signup"
                element={<Signup firebaseApp={app} setUser={setUser} />}
              />
              <Route
                path="/login"
                element={<Login firebaseApp={app} setUser={setUser} />}
              />
            </Routes>
          </Router>
        </div>
      </div>
    </>
  )
}

export default App
