import "./App.scss";
import Bookcard from "./Components/Bookcard";
import Sidebar from "./Components/Sidebar";
import ViewBook from "./Components/ViewBook";
import DonateBook from "./Components/DonateBook";
import Volunteer from "./Components/Volunteer";
import ViewDonations from "./Components/ViewDonations";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import { initializeApp } from "firebase/app";

import { app } from "./Components/firebase-config";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import { useState } from "react";
import Getbooks from "./Components/Getbooks";
import Mybooks from "./Components/Mybooks";

import { useCookies } from "react-cookie";
import Bottomnav from "./Components/Bottomnav";
import AboutUserform from "./Components/AboutUserform";

function App() {
  const [user, setUser] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies("firebaseAccessToken");

  return (
    <>
      {" "}
      <Router>

        <div>
             <Sidebar />
             

          <Bottomnav />
        
          <div className=" content-center justify-center mx-auto col-span-3">
          
            {/* {JSON.stringify(cookies.firebaseAccessToken)} */}
          
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
              <Route path="/view-book" element={<ViewBook />} />
              <Route path="/myprofile" element={<AboutUserform />} />
              <Route path="/my-loans" element={<Mybooks />} />
              <Route path="/donate-book" element={<DonateBook />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route
                path="/volunteer/view-donations"
                element={<ViewDonations />}
              />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
