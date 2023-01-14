import React, { useState } from "react";
import {

  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,

} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth"
import { useEffect } from "react";
import logo from "../assets/book.png";

const Login = ({ firebaseapp, setUser, setCookie }) => {

  const auth = getAuth(firebaseapp);
  const navigate = useNavigate();

  const [type , setType] = useState("");
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [loggedin, loading, error] = useAuthState(auth)
  useEffect(() => {
   
    if (loading ) {
      console.log("loading")
      return
    }

    if(!loggedin) {
      console.log("not logged in")
      navigate("/login")
      return
    }
    
    if (loggedin) {
      async function profileType () {
        const claim = await loggedin.getIdTokenResult().then((idTokenResult) => {
        return idTokenResult.claims['profileType'];
      });
      console.log(claim ,"is the claim");
      claim == "Volunteer"?  navigate('/volunteer') : navigate("/books")
    }
      profileType();
      return;
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
        

      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div class="grid gap-[1.5rem] sm:p-[4rem] md:p-[2rem] sm:grid-cols-[1fr] lg:grid-cols-[1fr,1fr] bg-gradient-to-br from-purple-400 to-green-500 ">
    <hero className = "flex h-[90vh] sm:p-[4rem] md:p-[2rem] justify-center align-middle relative">
      <h1 className=" absolute bottom-[10%] font-oswald font-light italic p-[4rem] text-5xl  md:text-7xl tracking-wider drop-shadow-lg text-stone-900   ">
      Read.<br />
      When You Wanna Read.<br />
      wReaders</h1>
      {/* <img src={logo}  alt="" className="w-1/2 h-1/2 ml-4 mt-10 bg-transparent self-center" /> */}

      </hero>
    <form
      class="flex items-center sm:mb-[2rem] md:mb-0 justify-center p-5 md:p-2 h-[90vh] bg-stone-300 bg-opacity-40 shadow-xl rounded-3xl"
      onSubmit={handleSubmit}
    >
      <div class="w-full md:w-1/2 flex flex-col items-center md:min-w-[400px] ">
        <h1 class="text-center font-text-pop text-6xl pb-4 font-bold text-neutral-800 mb-6">Login</h1>
        <div class="w-3/4 mb-6">
          <input
            type="email"
            name="email"
            id="email"
            required
            class="w-full py-4 px-8 bg-gray-600 bg-opacity-40 placeholder:font-semibold placeholder:font-text-mon placeholder:text-white rounded hover:ring-1 outline-blue-500"
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
            class="w-full py-4 px-8 bg-gray-600 bg-opacity-40 placeholder:font-semibold placeholder:text-white rounded hover:ring-1 outline-blue-500 "
            placeholder="Password"
            onChange={handleChange}
          />
        </div>
        <div class="w-3/4 flex flex-row justify-between">
          <div class=" flex items-center gap-x-1">
            <input type="checkbox" name="remembe  r" id="" class=" w-4 h-4 bg-slate-500 hover:bg-white checked:bg-green-500  " />
            <label for="" class="text-sm text-black " >
              Remember me
            </label>
          </div>
          <div>
            <a href="/" class="text-sm text-black hover:text-blue-500">
              Create an account
            </a>
          </div>
        </div>
        <div class="w-3/4 mt-4">
          <button
            type="submit"
            class="py-4 bg-blue-400 border-2 w-full rounded text-blue-50 font-bold hover:bg-transparent hover:text-blue-400 hover:border-blue-400"
          >
            Login
          </button>
        </div>
      </div>
    </form>
  </div>
    );
};

export default Login;
