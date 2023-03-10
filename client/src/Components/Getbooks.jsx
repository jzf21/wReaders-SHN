import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase-config";
import {
  getFirestore,
  collection,
  onSnapshot,
  getDoc,
  getDocs,
  query,
  limit,
  where,
  doc,
  DocumentReference,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase-config";
import Bookcard from "./Bookcard";

const Getbooks = () => {
  const [books, setBooks] = useState([]);
  const [genre, setGenre] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const [toggleG, setToggleG] = useState(false);
  const [searchG, setSearchG] = useState("")

  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      console.log("loading");
      return;
    }
    if (!user) {
      console.log("user not logged in");
      navigate("/login");
    }

    if(selectedGenre.length === 0)  
     {
      getBooks();
    }
    else {
      const bookref = query(collection(db,"Book"),where("categories","array-contains-any",selectedGenre));
      const bookshot = getDocs(bookref);
      bookshot.then((querySnapshot) => {
        const books = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(books);
      }
      );

    }

    

  }, [user, loading,selectedGenre]);

  const getBooks = async () => {

    try {
      const genreRef = doc(db ,"genre", "genre");
      const genreSnap = await getDoc(genreRef);
      if (genreSnap.exists()) {
        setGenre(genreSnap.data().genre);
      } else {
        console.log("No such genre!");
      }
      const collectionRef = collection(db, "Book");
      //order collectionRef by title in ascending order
      const q = query(collectionRef, orderBy("isReservable", "desc"), orderBy("title", "asc"));
      const querySnapshot = await getDocs(q);
      const books = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(books);
    } catch (error) {
      console.log(error);
    }
  };

  const [q, setQ] = useState("");
  const [searchParam] = useState(["title", "title"]);
  function search(items) {
    return items.filter((item) => {
      return searchParam.some((newItem) => {
        return (
          item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
        );
      });
    });
  }

  function searchGen(genreList){
   let newList=[];
    return genreList.filter((genre) => {
      return genre.toString().toLowerCase().indexOf(searchG.toLowerCase()) > -1;
    });

  }

  const ShowGenre = ()=>
  {
    
  }

  return (
    <div className="md:ml-[300px] flex flex-col bg-[#f2ffed] justify-center align-middle">
      <div className="flex justify-center">
        <div className="mb-3 xl:w-96">

          <div class="input-group relative flex flex-wrap items-stretch w-full mb-4 p-3">
            <input
              type="text"
              placeholder="Search for books"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              class="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              aria-label="Search"
              aria-describedby="button-addon2"
            />
            
            {/* <button
            class="btn inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center"
            type="button"
            id="button-addon2"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="search"
              class="w-4"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
              ></path>
            </svg>
          </button> */}
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1  gap-2 md:grid-cols-1 justify-center self-center">
        
        <input type="text" key="gsearchbox" value={searchG} className="w-[80] border-2" 
                    onFocus={()=>{setToggleG(true)}}
                    placeholder="Search Genre"
                    onChange={(e)=>{setSearchG(e.target.value)}}

        />
          
          <div className={`${toggleG ? "" :"hidden "}`}>
          {searchGen(genre).map((item) => (
            
            <div className={`bg-gray-100  shadow-md  text-start px-2 
                              text-lg md:text-xl font-medium  text-stone-600 cursor-pointer border-slate-400 border-b-[2px]
                              w-80 ${selectedGenre.includes(item) ? "bg-stone-300 text-white" : "text-gray-600"}`}
                    onClick={() => { 
                      setToggleG(false);
                      if(selectedGenre.includes(item))
                      {
                        setSelectedGenre(selectedGenre.filter((genre) => genre !== item));
                        
                      }
                      else
                      {
                        setSelectedGenre([...selectedGenre,item]);
                      }
                    }}
              >{item}

            </div>
                       
          
          ))
                  }
          </div>

        
     
            </div>

            <div className="grid sm:flex md:flex gap-4 p-4">
            {selectedGenre.map((item) => (
              <div className="flex bg-gray-100  w-max  h-6 shadow-md  justify-between px-2" key={item.id}>
                {item}
                <button className=" bg-orange-300 text-white ml-3 mt-1 mb-0.5 text-[10px] px-1 rounded-xl" onClick={() => {setSelectedGenre(selectedGenre.filter((genre) => genre !== item))}}>X</button>
              </div>
            ))

            }
          </div>
      <div className="grid  sm:grid-cols-1 md:grid-cols-3 lg:cols-3 gap-[2rem]  p-4 sm:p-3 justify-center">
        {search(books)
          .slice(0)
          .map((book) => {
            return <Bookcard
              key={book.id}
              book={book} />;
          })}
      </div>
    </div>
  );
};

export default Getbooks;
