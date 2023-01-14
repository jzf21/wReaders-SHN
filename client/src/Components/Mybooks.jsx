import React from "react";
import { auth } from "./firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase-config";
import { doc, addDoc, collection, setDoc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { runTransaction } from "firebase/firestore";


const Mybooks = () => {

    const [books, setBooks] = useState([{}]);
    const [returnedBooks, setReturnedBooks] = useState([{}]);

    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) {
            console.log("loading");
            return;
        }
        if (!user) {
            return navigate("/login");
        }
        if (error) {
            console.log("error", error);
        }
        console.log("user", user);

        fetchUserBooks();

    }, [user, loading])

    const fetchUserBooks = async () => {

        const userRef = doc(db, "User", user.uid);
        await getDoc(userRef).then(async (userSnap) => {
            if (userSnap.exists()) {
                const userDetails = userSnap.data();
            } else {
                console.log("No such User!");
            }

            const userBooksRef = collection(userRef, "loans");
            const userReturnedRef = collection(userRef, "returnedLoans");

            const userBooksShot = await getDocs(userBooksRef);
            const userReturnedShot = await getDocs(userReturnedRef);

            const userBooks = userBooksShot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            const userReturned = userReturnedShot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setReturnedBooks(userReturned);
            setBooks(userBooks);

            console.log("books", books);
        })
            .catch((e) => {

                console.log("in catch ", e);
            })
    }
    const returnBook = async (loanId, bookId, itemId) => {
        console.log("returning book", loanId, bookId);
        const userRef = doc(db, "User", user.uid);
        const userLoanRef = doc(userRef, "loans", loanId);
        const userReturnedRef = doc(userRef, "returnedLoans", loanId);
        const bookRef = doc(db, "Book", bookId);
        const itemRef = doc(bookRef, "stock", itemId);

        console.log("Entering transaction")
        await runTransaction(db, async (transaction) => {
            const userLoanSnap = await transaction.get(userLoanRef);

            const bookSnap = await transaction.get(itemRef);

            transaction.delete(userLoanRef);
            transaction.set(userReturnedRef, userLoanSnap.data());
            transaction.update(userReturnedRef, {
                status: "returned",
                returnedDate: new Date(),
            }
            )

            transaction.update(bookRef, {
                availableCopies: bookSnap.data().availableCopies + 1,
            });
            transaction.update(itemRef, {
                isReservable: true,
            }

            )
        }).then(() => {
            console.log("Transaction successfully committed!");
        }).catch((error) => {
            console.log("Transaction failed: ", error);
        });
    }


    const Zdate = (date) => {


        if (date) {
            console.log(date);
            const dateh = new Date(date);
            const dateString = dateh.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });

            return (
                <div>
                    {dateString}
                </div>
            )
        }
    }



    //return a horizontal card for each book in books array with proper styling
    return (
        //tailwind
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            
            
            
            <h1 className="text-2xl font-bold p-5">
                My Books</h1>
            <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
                {books.length === 0 ? <h2>No current Rents</h2> :
                    books.map((book) => {

                        return (
                            <div key={book.id} class="flex rounded-lg shadow-lg p-2">
                                <div class="w-1/2">
                                    <img src={book.thumbnailUrl} class="rounded-lg" />
                                </div>
                                <div class="w-1/2 p-4">
                                    <h2 class="text-xl font-bold">{book.title}</h2>
                                    <p class="text-gray-700">{book.planName}</p>
                                    <p class="text-gray-600">Return By :<Zdate date={book.returnDate} /></p>
                                    {/* <p class="text-gray-600">Issued On :{book.issueDate}</p> */}
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => {
                                            returnBook(book.id, book.modelId, book.itemId)
                                        }}>

                                        Return

                                    </button>
                                </div>
                            </div>

                        )
                    })}
            </div>
            <h1 className="text-2xl font-bold p-10">
                Returned books</h1>
            <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
                {returnedBooks.length === 0 ? <h2>No Return History</h2> :
                    returnedBooks.map((book) => {

                        return (
                            <div class="flex rounded-lg shadow-lg p-4">
                                <div class="w-1/2">
                                    <img src={book.thumbnailUrl} class="rounded-lg" />
                                </div>
                                <div class="w-1/2 p-4">
                                    <h2 class="text-xl font-bold">{book.title}</h2>
                                    <p class="text-gray-700">{book.planName}</p>
                                    <p class="text-gray-600">Returned On :<Zdate date={book.returnedDate} />
                                    </p>
                                    {/* <p class="text-gray-600">Issued On :{book.issueDate}</p> */}
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => {
                                            navigate('/addReview', { state: { bookId: book.bookId } })
                                        }
                                        }>
                                        Add Review
                                    </button>
                                </div>
                            </div>

                        )
                    })}
            </div>

        </div>
    )



}


export default Mybooks;








