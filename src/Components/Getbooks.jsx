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
import Bookcard from "./bookcard";
import AddDoc from "./AddDoc";

const Getbooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showFiltered, setShowFiltered] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [user, loading, error] = useAuthState(auth);
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
    if (user)
      getBooks();

  }, [user, loading]);

  const getBooks = async () => {

    try {
      const collectionRef = collection(db, "Book");
      //order collectionRef by title in ascending order
      const q = query(collectionRef, orderBy("isReservable", "desc"), orderBy("title", "asc"));
      const querySnapshot = await getDocs(q);
      const books = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const Ubooks = books.reduce((acc, book) => {
        //reduce to only books that have unique title
        if (!acc.some((b) => b.title === book.title)) {
          acc.push(book);
        }
        return acc;
      }, []);
      setBooks(Ubooks);
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

  return (
    <div>
      <div class="flex justify-center">
        <div class="mb-3 xl:w-96">
          <div class="input-group relative flex flex-wrap items-stretch w-full mb-4">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 content-center">
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
