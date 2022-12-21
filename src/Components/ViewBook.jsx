import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    doc,
    DocumentReference,
    addDoc,
    updateDoc,
} from "firebase/firestore";
import { db } from "./firebase-config";
import { Navigate, useLocation } from "react-router-dom";

const ViewBook = () => {
    const user = getAuth().currentUser;
    if (user == null)
        Navigate("/login");
    console.log(user.email);
    console.log(user.uid);
    const location = useLocation();
    const [book, setBook] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const userLoansRef = collection(db, "User", user.uid, "loans");


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

                <button disabled={!book.isRerservable} onClick={() => {
                    addDoc(userLoansRef, {
                        _id: book.id,
                    }).then(() => {
                        console.log("reached then")
                        console.log(book.id);
                        updateDoc(doc(db,"Book",book.id), {
                            isRerservable: false,
                        })
                        console.log("again reached then")
                    })
                        .catch((err) => {
                            console.log("didnt add doc" + err);
                        });
                }}>
                    Rent
                </button>
            </div>
        </div>
    );
};

export default ViewBook;
