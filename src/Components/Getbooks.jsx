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
      const bookitem = await getDocs(collection(db, "book_item"));
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
    <>
      {" "}
      <input
        className="Search mx-2"
        type="text"
        placeholder="Search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="grid grid-cols-3 gap-8 ">
        {search(books)
          .slice(0)
          .map((book) => {
            return (
              <Bookcard
                key={book.id}
                url={book.thumbnailUrl}
                title={book.title}
                authors={book.authors}
              />
            );
          })}
        {/* <AddDoc/> */}
      </div>
    </>
  );
};

export default Getbooks;
