import "./App.scss"
import Bookcard from "./Components/bookcard"
import Sidebar from "./Components/Sidebar"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom"

import { initializeApp } from "firebase/app"

import { app } from "./Components/firebase-config"
import Signup from "./Components/Signup"
import Login from "./Components/Login"
import { useState } from "react"
import Getbooks from "./Components/Getbooks"
import Search from "./Components/Search"

import { useCookies } from "react-cookie"

function App() {
  const [user, setUser] = useState(null)
  const [cookies, setCookie, removeCookie] = useCookies("firebaseAccessToken")

  return (
    <>
      <div className="grid grid-cols-4">
        <div className="col-span-1">
          <Sidebar />
        </div>
        <div className="col-span-3">
          {/* {JSON.stringify(cookies.firebaseAccessToken)} */}

          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <Signup
                    firebaseApp={app}
                    setUser={setUser}
                    setCookie={setCookie}
                  />
                }
              />
              <Route
                path="/login"
                element={
                  <Login
                    firebaseApp={app}
                    setUser={setUser}
                    setCookie={setCookie}
                  />
                }
              />
              <Route path="/books" element={<Getbooks />} />
            </Routes>
          </Router>
        </div>
      </div>
    </>
  )
}

export default App
