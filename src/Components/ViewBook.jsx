import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { db } from "./firebase-config";
import { useLocation } from "react-router-dom";
const ViewBook = () => {
  const location = useLocation();
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    let books = location.state.book;
    setBook(books);
    console.log(books);
  }, []);
  return (
    <div className="flex items-center justify-center w-full">
      <div className=" bg-slate-300 flex flex-col items-center gap-8 py-5">
        <img src={book.thumbnailUrl} alt="" />
        <h1 className="semibold">Title:{" "}{book.title}</h1>
        <h2>Authors:{book.authors}</h2>
        <p>Categories:{book.categories}</p>
        <p className="w-[50%] hidden">{book.longDescription}</p>
      </div>
    </div>
  );
};

export default ViewBook;
