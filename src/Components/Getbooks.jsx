import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase-config";
import Bookcard from "./bookcard";
import AddDoc from "./AddDoc";

const Getbooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showFiltered, setShowFiltered] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const getBooks = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "Book"));
      const books = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(books);
      console.log(books);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getBooks();
  }, []);
  return (
    <div>
      {books.map((book) => {
        return <Bookcard key={book.id} {...book} />;
      })}
      {/* <AddDoc/> */}
    </div>
  );
};

export default Getbooks;
