import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { runTransaction } from "firebase/firestore";
import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    doc,
    setDoc,
    DocumentReference,
    addDoc,
    updateDoc,
    getDoc,
} from "firebase/firestore";
import { auth } from "./firebase-config"
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
    const [review, setReview] = useState("");
    const [reviews,setReviews] = useState([{}]);
    const [plans, setPlans] = useState([{}]);

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
       if(location.state && location.state.book){
         setBook(location.state.book);
        getReviews().catch((err) => console.log("error in getting reviews ", err));
        getPlans().catch((err) => console.log("error in getting plans ", err));
}
    }, [user, loading,book]);

    const getReviews = async () => {
        if (!book.id) return;
        try
       { 
        const reviewRef = collection(db, "Book", book.id, "reviews");
        const reviewSnapshot = await getDocs(reviewRef);
        const reviewslist = reviewSnapshot.docs.map((review) => ({
            id: review.id,
            ...review.data(),
        }));
        setReviews(reviewslist);
        console.log("got reviews",reviewslist)}
        catch(err){
            console.log("error in getting reviews ", err);
        }
    };
    const getPlans = async () => {
        if (!book.id) return;
        try{  const plansRef = collection(db, "Book", book.id, "plans");
         
          console.log("got plansRef")
          const querySnapshot = await getDocs(plansRef);
          const bookPlans = querySnapshot.docs.map((bookPlan) => ({
              id: bookPlan.id,
              ...bookPlan.data(),
          }));
          setPlans(bookPlans);
          console.log("got plans")}
          catch(err){
              console.log("error in getting plans ", err);
          }
      };

    const RentPlans = () => {
        // return a dropdown with plans
        return (
            <div className="flex flex-col gap-2  items-center">
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

    if(!user || loading)
    return null;
    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className=" bg-slate-300 flex flex-col items-center gap-8 py-5">
                <img src={book.thumbnailUrl} alt="" />
                <h1 className="semibold">Title:{" "}{book.title}</h1>
                <h2>Authors:{book.authors}</h2>
                <p>Categories:{book.categories}</p>
                <p className="w-[50%] hidden">{book.longDescription}</p>
                <RentPlans key= "rentplans"/>
                <button className="bg-blue-800 px-2 rounded-lg text-white hover:bg-blue-700 "
                    disabled={!book.isReservable}
                    onClick={async () => {
                        try {
                            let success = false;
                            const modelRef = doc(db, "Book", book.id);
                            const stockref = collection(db, "Book", book.id, "stock");
                            const stockSnap = await getDocs(stockref).then((querySnapshot) => {
                                querySnapshot.forEach(async (item) => {
                                    console.log("Entering transaction")
                                    if (success) return;
                                    await runTransaction(db, async (transaction) => {
                                        const docRef = item.ref;
                                        const docSnap = await transaction.get(docRef);
                                        const userRef = doc(db, "User", user.uid);
                                        const userLoansRef = collection(userRef, "loans");
                                        const userSnap = await transaction.get(userRef);
                                        const currentscore = userSnap.data().score;
                                        const reservable = docSnap.data().isReservable;
                                        const newDocref = doc(userLoansRef,);

                                        if (!reservable) {
                                            throw "Item not available";
                                        }
                                        if (currentscore < planPrice) {
                                            throw "Insufficient Balance";
                                        }
                                        else if (reservable) {


                                            transaction.set(newDocref, {
                                                userid: user.uid,
                                                modelId: book.id,
                                                itemId: item.id,
                                                title: book.title,
                                                plan: planId,
                                                planName: planName,
                                                planDays: planDays,
                                                planPrice: planPrice,
                                                thumbnailUrl: book.thumbnailUrl,
                                                returnDate: new Date(new Date().getTime() + planDays * 24 * 60 * 60 * 1000),
                                                status: "requested",
                                            })
                                            transaction.update(userRef, {
                                                score: currentscore - planPrice,
                                            });


                                            transaction.update(docRef, {
                                                isReservable: false,
                                            });
                                            transaction.set(modelRef, {
                                                stock: docSnap.data().stock - 1,
                                            }, { merge: true });

                                            success = true;
                                            console.log("New loan created");



                                        }
                                        else {
                                            console.log("book not reserved")

                                        }

                                    })

                                })
                            })
                        }
                        catch (err) {
                            console.log("Transaction failed: ", err);
                        }
                    }}>
                    Rent
                </button>
            </div>
            <div>
                <h1>Add a Review</h1>
                <form className="flex flex-col gap-2">
                    <textarea name="review" id= {user.uid} value={review} onChange={(e)=>{
                        setReview(e.target.value);
                    }} cols="30" rows="10"></textarea>
                    <button className="bg-blue-800 px-2 rounded-lg text-white hover:bg-blue-700" onClick={async (e) => {
                        e.preventDefault();
                        const review = document.getElementById(user.uid).value;
                        const reviewRef = doc(db, "Book", book.id,"reviews", user.uid);
                        
                        
                        console.log(user.email ,"displayname")
                        await setDoc(reviewRef, {
                            review: review,
                            user: user.email,
                            book: book.id,
                        });
                    }}>Submit</button>
                </form>
            </div>
            <div className="flex flex-col gap-2">
                <h1>Reviews</h1>
                <div className="flex flex-col gap-2">
                    {reviews.map((review) => (
                            <div key={review.id} className="flex flex-col gap-2">
                            <h3>{review.user}</h3>
                            <textarea className="bg-slate-300 px-2 rounded-lg h-10" name="yourReview" id="adad" cols="30" rows="10" value={review.review} readOnly></textarea>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewBook;
