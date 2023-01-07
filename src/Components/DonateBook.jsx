import React from "react";
import { getFirestore, collection, getDocs, addDoc, setDoc, deleteDoc, collectionGroup, getDoc,doc ,query,orderBy } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { auth } from "./firebase-config";
import { useNavigate } from "react-router-dom";


const DonateBook = () =>
{
    const [display , setDisplay] = useState(false);
    const [user, loading, error] = useAuthState(auth);
    const [q, setQ] = useState("");
    const [searchParam] = useState(["title", "title"]);
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

    
      function search(items) {
        return items.filter((item) => {
          return searchParam.some((newItem) => {
            return (
              item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
            );
          });
        });
      }
    useEffect(() => {
        if(loading)
        {
            console.log("loading");
            return;
        }
        if(!user)
        {
            const navigate = useNavigate();
            return navigate("/login");
        }
        const getBooks = async () => {

            try {
              const collectionRef = collection(db, "Book");
              //order collectionRef by title in ascending order
              const qu = query(collectionRef, orderBy("isReservable", "desc"), orderBy("title", "asc"));
              const querySnapshot = await getDocs(qu);
              const bookdatas = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setBooks(bookdatas);
            } catch (error) {
              console.log(error);
            }
          };
          
        getBooks();
    }, [loading, user]);

    return(
        <div>
            <h1>Donate Book</h1>
            <form>
                <input type="text" placeholder="Search by book name" value ={q} onChange ={(e) => {
                    console.log("setting");setQ(e.target.value)
                    }} />
                <button onClick={(e)=>{e.preventDefault();setDisplay(true)}}> search</button>
               {display && search(books).slice(0).map((bookItem) => {
                return(<BookOptions  key = {bookItem.id} book={bookItem} />)}) }
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
            }}>Donate</button>
        </div>

           )
}

export default DonateBook;