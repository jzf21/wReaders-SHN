import React from "react";
import {auth} from "./firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase-config";
import { getFirestore, collection, getDocs, query, where, doc, setDoc, getDoc, updateDoc, collectionGroup, runTransaction } from "firebase/firestore";

const ViewDonations = () => {
        const navigate = useNavigate();
        const [Requests ,setRequests] = useState([])
        const [user,loading,error] = useAuthState(auth);

        useEffect(()=>{
            if(loading)
                return;
            if(!user)
                navigate('/login')
            const check = async() =>{await user.getIdTokenResult().then((idToken)=>{
                if(idToken.claims['profileType'] != "Volunteer"){
                    console.log("Access denied");
                    return(<h1>
                        Access Denied
                    </h1>)
                }})}
            
            check();
            async function fetchDonations(){

                const donationsRef = collectionGroup(db,'donations');
                const donationSnap = await getDocs(donationsRef);
                const donations = donationSnap.docs.map((doc1)=>
                    ({
                        id : doc1.id,
                        ...doc1.data(),
                    })
                )
                    setRequests(donations);
            }
            fetchDonations();

        },[user,loading])

        const RequestCard = ( {request} ) => {

            async function acceptRequest(id , cmd)
            {
                const requestRef = doc(db,"User",request.donor,"donations",request.id);
               
                                
                await runTransaction(db,async(transaction)=>{
    
                        const userRef = doc(db,"User",request.donor);
                            const userSnap = await transaction.get(userRef);
                            const userData = userSnap.data();
                            const points = userData.points;

                        const stockCollection = collection(db,"Book",request.book,"Stock");
                        const bookRef = doc(db,"Book",request.book);
                        const bookSnap = await transaction.get(bookRef);
                        const availableCopies = bookSnap.data().availableCopies;

                        const stockref = doc(stockCollection,);

                        let updatedStatus
                        if(cmd == "verify")
                            updatedStatus = "verified";
                        else if(cmd == "accept")
                            updatedStatus = "accepted";
                        else if(cmd == "reject")
                            updatedStatus = "rejected";
                        else if(cmd == "collect")
                            updatedStatus = "collected";
                        transaction.set(requestRef,{
                            status: updatedStatus,
                            ModifiedOn : new Date(),
                            ModifiedBy : user.email,
                            CollectonOn : updatedStatus == "collected" ? new Date() : null,
    
                        },{merge : true});

                        if(updatedStatus = "collected")
                        {
                            

                            const newPoints = points + 1000;
                            transaction.update(userRef,{
                                points : newPoints,
                            })

                            transaction.update(bookRef,{
                                availableCopies : availableCopies + 1,
                            })

                            transaction.set(stockref,{
                                    addedBy : request.donor,
                                    addedOn : new Date(),
                                    availableForLoanOn : new Date(),
                                    isReservable : true,
                                    bookId : 1000+availableCopies,
                            }
                                )
                        }
                        
    
                }).then(()=>{

                    //sendNotificationTO donor!
                    console.log("Transaction successfull");
                })
                .catch((error)=>{
                    console.log("Transaction failed: ",error);
                })

                
            }
            const buttonGroup = request.status === "requested" ? (
                <button onClick={e => {
                  e.preventDefault();
                  console.log("hello ", request.id);
                  acceptRequest(request.id, "accept");
                }}>
                  Add to list
                </button>
              ) : request.status === "accepted" ? (
                <button onClick={e => {
                  e.preventDefault();
                  acceptRequest(request.id, "collect");
                }}>
                  Collect
                </button>
              ) : request.status === "pending"  ?(
                <div>
                  <button onClick={e => {
                    e.preventDefault();
                    acceptRequest(request.id, "verify");
                  }}>
                    Verify
                  </button>
                  <button onClick={e => {
                    e.preventDefault();
                    acceptRequest(request.id, "reject");
                  }}>
                    Reject
                  </button>
                </div>
              ): request.status === "collected" ? (
                   
                    <span className="font-bold">Collected</span>
                ) : null;
            
              
              
            return (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">User :{request.donor}</h2>
                <div className="text-gray-600 mb-4">
                  <span className="font-bold">Book ID: {request.book}</span>
                </div>
                <div className="text-gray-600 mb-4">
                  <span className="font-bold">Status:</span> {request.status}
                </div>
                <div className="text-gray-600 mb-4">
                  <span className="font-bold">Request Date:</span> {request.addedOn}
                </div>
                {buttonGroup}
               
                    
              </div>
            );
          };

        if(!user || loading)
                return null;
        
        return (
            <div>
                <h1>Request List</h1>
                {
                    Requests.map((request)=>{
                        return <RequestCard request = {request} key={request.id} />
                    })
                }
            </div>
            
            )
        }
    
        


export default ViewDonations;
        



