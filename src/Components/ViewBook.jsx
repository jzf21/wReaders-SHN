
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where, doc, DocumentReference } from "firebase/firestore";
import { db } from "./firebase-config";
import { useLocation } from 'react-router-dom';
const ViewBook = () => {
    const location = useLocation();
    const [book, setBook] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        let books = location.state.book;
        setBook(books);
        

    }, []);
    return (
        <div>
            <h1>{book.title}</h1>
            <button onClick>

            </button>
        </div>
    )
}

export default ViewBook;




