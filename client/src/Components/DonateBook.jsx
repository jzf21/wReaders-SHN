import React from "react";
import { getFirestore, collection, getDocs, addDoc, setDoc, deleteDoc, collectionGroup, getDoc,doc ,query,orderBy, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { auth } from "./firebase-config";
import { useNavigate } from "react-router-dom";


const DonateBook = () =>
{
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    const [bookloading, setBookLoading] = useState(false);
    const [q, setQ] = useState("");
    const [searchParam] = useState(["title", "title"]);
    const [isbn, setISBN] = useState("");
    const [book, setBook] = useState({

      title: "OSGi in Depth",
      isbn: "193518217X",
      pageCount: 325,
      publishedDate: { $date: "2011-12-12T00:00:00.000-0800" },
      thumbnailUrl:
        "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/alves.jpg",
      shortDescription:
        "Enterprise OSGi shows a Java developer how to develop to the OSGi Service Platform Enterprise specification, an emerging Java-based technology for developing modular enterprise applications. Enterprise OSGi addresses several shortcomings of existing enterprise platforms, such as allowing the creation of better maintainable and extensible applications, and provide a simpler, easier-to-use, light-weight solution to enterprise software development.",
      longDescription:
        "A good application framework greatly simplifies a developer's task by providing reusable code modules that solve common, tedious, or complex tasks. Writing a great framework requires an extraordinary set of skills-ranging from deep knowledge of a programming language and target platform to a crystal-clear view of the problem space where the applications to be developed using the framework will be used.    OSGi Application Frameworks shows a Java developer how to build frameworks based on the OSGi service platform. OSGi, an emerging Java-based technology for developing modular applications, is a great tool for framework building. A framework itself, OSGi allows the developer to create a more intuitive, modular framework by isolating many of the key challenges the framework developer faces.    This book begins by describing the process, principles, and tools you must master to build a custom application framework. It introduces the fundamental concepts of OSGi, and then shows you how to put OSGi to work building various types of frameworks that solve specific development problems.    OSGi is particularly useful for building frameworks that can be easily extended by developers to create domain-specific applications. This book teaches the developer to break down a problem domain into its abstractions and then use OSGi to create a modular framework solution. Along the way, the developer learns software engineering practices intrinsic to framework building that result in systems with better software qualities, such as flexibility, extensibility, and maintainability.    Author Alexandre Alves guides you through major concepts, such as the definition of programming models and modularization techniques, and complements them with samples that have real applicability using industry-proved technologies, such as Spring-DM and Equinox.",
      status: "PUBLISH",
      authors: ["Alexandre de Castro Alves"],
      categories: ["Java"],
    });
    const [books, setBooks] = useState([]);

    const db = getFirestore();

    
      async function searchBook() {
          setBookLoading(true);
          const que = query(collection(db,"Book"),where("title",">=",q),where("title","<=",q+"\uf8ff"));
          console.log("done q");
          const qSnap = await getDocs(que);
          const bookData = qSnap.docs.map((doc1) => doc1.data());
          setBooks(bookData);
          console.log("books",books);
          setBookLoading(false);
        }          
      async function searchIsbn() {
          setBookLoading(true);
          const que = query(collection(db,"Book"),where("isbn","==",isbn));
          console.log("done q");
          const qSnap = await getDocs(que);
          const bookData = qSnap.docs.map((doc1)=>
          ({
              id : doc1.id,
              ...doc1.data()
          })
          );
          setBooks(bookData);
          console.log("books",books);
          setBookLoading(false);
        }


    useEffect(() => {
        if(loading || bookloading)
        {
            console.log("loading");
            return;
        }
        if(!user)
        {
            return navigate("/login");
        }
    }, [loading, user,bookloading]);
    const BookOptions = ({book}) =>
    {
    console.log(book);
    return (
        <div> 
            <p>Title : {book.title}</p>
            <p>Author : {book.authors}</p>
            <p>ISBN : {book.isbn}</p>
            <button onClick={(e)=>
            {
                e.preventDefault();
                const donationRef = collection(db,"User",user.uid,"donations");
                addDoc(donationRef,{
                  book : book.id,
                  donor : user.uid,
                  time : new Date(),
                  status : "requested",
                });
                console.log("donated");
            }}>Select</button>

        </div>
           )
    
}


    return(
        <div>
            <h1>Donate Book</h1>
            <form>
                <input type="text" placeholder="Enter the isbn" value ={isbn} onChange ={(e) => {
                    setISBN(e.target.value)
                    }} />
                <button onClick={(e) =>{
                    e.preventDefault();
                    searchIsbn();
                }}> Search</button>

                <input type="text" placeholder="Enter the title" value ={q} onChange ={(e) => {
                    setQ(e.target.value)
                    }} />


                <button onClick={
                      (e)=>{
                        e.preventDefault();
                      searchBook()}}> 
                      search
                </button>

                <h1>
                  Search Results
                </h1>

                {books.map((book) => (
                  <BookOptions book={book} />
                ))}

                
                {/* <input type="text" placeholder="Title" value={book.title} />
                <input type="text" placeholder="ISBN" value={book.isbn}  />
                <input type="text" placeholder="Page Count" value={book.pageCount}   />
                <input type="text" placeholder="Published Date" value={book.publishedDate}  />
                <input type="text" placeholder="Thumbnail URL" value={book.thumbnailUrl}   />
                <input type="text" placeholder="Short Description" value={book.shortDescription}   />
                <input type="text" placeholder="Long Description" value={book.longDescription}/>
                <input type="text" placeholder="Status" value={book.status}  />
                <input type="text" placeholder="Authors" value={book.authors}  />
                <input type="text" placeholder="Categories" value={book.categories}  /> */}
            </form>
            </div>
            
    )

}
export default DonateBook;

