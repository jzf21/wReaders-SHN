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

    const today = new Date();
    const firestore = getFirestore();
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    const [book, setBook] = useState({});
    const [planId, setPlanId] = useState("");
    const [planName, setPlanName] = useState("Select Plan");
    const [planDays, setPlanDays] = useState(0);
    const [planPrice, setPlanPrice] = useState(0);
    const location = useLocation();

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
            console.log("Error In use effect ", error);
        }
        setBook(location.state.book);

    }, [user, loading]);

    const RentPlans = () => {
        console.log("Reached RentPlans")
        const [plans, setPlans] = useState([{}]);
        console.log("declared plans")

        const getPlans = async () => {
            const plansRef = collection(db, "Book", book.id, "plans");
            console.log("got plansRef")
            const querySnapshot = await getDocs(plansRef);
            const bookPlans = querySnapshot.docs.map((bookPlan) => ({
                id: bookPlan.id,
                ...bookPlan.data(),
            }));
            setPlans(bookPlans);
            console.log("got plans")
        };
        useEffect(() => {
            if (loading) {
                console.log("loading");
                return;
            }
            if (!book) {
                console.log("book not found")
                return;
            }
            if (!user) {
                console.log("user or book not found")
                return;
            } console.log("useEffect in getPlans")
            getPlans();
        }, [user, book]);

        // return a dropdown with plans 
        return (
            <div className="flex flex-col items-center gap-2">
                <select
                    value={planId}
                    className="bg-slate-300 px-2 rounded-lg"
                    onChange={(e) => {
                        setPlanId(e.target.value);
                        const selectedPlan = plans.find((plan) => plan.id === e.target.value);
                        setPlanName(selectedPlan.name);
                        setPlanDays(selectedPlan.duration);
                        setPlanPrice(selectedPlan.price);
                    }}
                >
                    <option value="" selected disabled>Select Plan</option>
                    {plans.map((plan) => (
                        <option key={plan.id} value={plan.id} disabled={!plan.active}>
                            {plan.name}
                        </option>
                    ))}
                </select>
                <div className="flex flex-col items-center gap-2">
                    <h3 className="semibold">Plan: {planName}</h3>
                    <h3>Days: {planDays}</h3>
                    <h3>Price: {planPrice}</h3>
                </div>
            </div>
        );
    };
    return (
        <div className="flex items-center justify-center w-full">
            <div className=" bg-slate-300 flex flex-col items-center gap-8 py-5">
                <img src={book.thumbnailUrl} alt="" />
                <h1 className="semibold">Title:{" "}{book.title}</h1>
                <h2>Authors:{book.authors}</h2>
                <p>Categories:{book.categories}</p>
                <p className="w-[50%] hidden">{book.longDescription}</p>
                <RentPlans />
                <button className="bg-blue-800 px-2 rounded-lg text-white hover:bg-blue-700 "
                    disabled={!book.isReservable}
                    onClick={async () => {
                        try {
                            await runTransaction(db, async (transaction) => {
                                const docRef = doc(db, "Book", book.id);

                                const stockRef =doc(docRef,"stock");
                                 
                                const docSnap = await transaction.get(docRef);
                                const userRef = doc(db, "User", user.uid);
                                const userLoansRef = collection(userRef, "loans");
                                const userSnap = await transaction.get(userRef);
                                const currentscore = userSnap.data().score;
                                const reservable = docSnap.data().isReservable;
                                const newDocref = doc(userLoansRef,);
                                                
                            

                                if (!docSnap.exists()) {
                                    throw "Document does not exist!";
                                }
                                if (currentscore < planPrice) {
                                    throw "Insufficient Balance";
                                }
                                else if (reservable) {


                                    transaction.set(newDocref, {
                                        userid: user.uid,
                                        bookId: book.id,
                                        title: book.title,
                                        plan: planId,
                                        planName: planName,
                                        planDays: planDays,
                                        planPrice: planPrice,
                                        thumbnailUrl: book.thumbnailUrl,
                                        returnDate: new Date(new Date().getTime() + planDays * 24 * 60 * 60 * 1000),
                                        status: "booked",
                                    })
                                    transaction.update(userRef, {
                                        score: currentscore - planPrice,
                                    });


                                    transaction.update(docRef, {
                                        isReservable: false,
                                    });

                                    console.log("New loan created")



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
