import React from "react";

import { db } from "../firebase-config";
import { doc, addDoc, collection, setDoc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useState } from "react";

const AddGenre = async() => {
    
        const [genre, setGenre] = useState([]);
        const booksRef = collection(db,"Book");
        const booksShot = await getDocs(booksRef);
        let books = [];
        booksShot.docs.map(async(doc) => {
            const ar = doc.data().categories;
            ar.map((element) => {

                if (!books.includes(element)) {
                    
                    // setGenre((prevState) => [...prevState, element]);
                    books.push(element);
                    console.log(books)
                }
                else
                {
                    console.log("already present");
                }
            })
        }
        )
        const genreData = doc(db , "genre", "genre");
        await setDoc(genreData, {genre : books},);
    }

   

export default AddGenre;

    