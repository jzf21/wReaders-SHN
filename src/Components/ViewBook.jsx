import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { runTransaction } from "firebase/firestore";
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
    getDoc,
} from "firebase/firestore";
import { auth } from "./firebase-config"
import firebase from "firebase/compat/app";
import { db } from "./firebase-config";
import { useLocation } from "react-router-dom";

function ViewBook() {

    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    const [book, setBook] = useState({});
    const location = useLocation();


    const action = () => {

        setBook(location.state.book);

    };
    useEffect(() => {
        if (loading) {
            console.log("loading");
            return;
        }
        if (!user) {
            console.log("not logged in");
            return navigate("/login");
        }
        if (error) {
            console.log("In use effect ", error);
        }
        action();

    }, [user, loading]);

    return (
        <div className="flex items-center justify-center w-full">
            <div className=" bg-slate-300 flex flex-col items-center gap-8 py-5">
                <img src={book.thumbnailUrl} alt="" />
                <h1 className="semibold">Title:{" "}{book.title}</h1>
                <h2>Authors:{book.authors}</h2>
                <p>Categories:{book.categories}</p>
                <p className="w-[50%] hidden">{book.longDescription}</p>

                <button className="bg-blue-800 px-2 rounded-lg" disabled={!book.isRerservable} onClick={async () => {


                    try {
                        await runTransaction(db, async (transaction) => {
                            const docRef = doc(db, "Book", book.id);
                            const docSnap = await transaction.get(docRef);
                            const userLoansRef = collection(db, "User", user.uid, "loans");

                            if (!docSnap.exists()) {
                                throw "Document does not exist!";
                            }
                            const reservable = docSnap.data().isRerservable;
                            const newDocref = doc(userLoansRef,);

                            if (reservable) {
                                transaction.set(newDocref, {
                                    _id: book.id,
                                })


                                transaction.update(docRef, { isRerservable: false });

                                console.log("book id at then", book.id);
                                console.log("book reserved",)



                            }
                            else {
                                console.log("book not reserved")
                                
                            }

                        })





                    }
                    catch (err) {
                        console.log("Transaction failed: ", err);
                    }
                }}>
                    Rent
                </button>
            </div>
        </div>
    );
};

export default ViewBook;
