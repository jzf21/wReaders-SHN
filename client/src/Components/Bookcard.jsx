import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Bookcard = ({ book }) => {
  const navigate = useNavigate();

  return (
      <div className=" justify-center outline-1 outline-double hover:scale-110 rounded-md shadow-md dark:bg-gray-900 dark:text-gray-100 ">
        <img
          src={book.thumbnailUrl}
          alt=""
          className=" m-2 object-cover object-center w-full rounded-t-md h-72 dark:bg-gray-500"
        />
        <div className="flex flex-col justify-between p-6 space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-wide">
              {book.title}
            </h2>
            <p className="dark:text-gray-100">{book.authors.join(", ")}</p>
          </div>
          <button
            type="button"
            className="flex items-center justify-center w-full p-3 font-semibold tracking-wide rounded-md dark:bg-violet-400 dark:text-gray-900"
            keyProp="rent"
            disabled={!book.isReservable}
            onClick={() => {
              navigate("/view-book", { state: { book: book, id: book.id } });
              console.log("clicked");
            }}
          >
            {book.isReservable ? "About Book" : "Not Available to rent"}
          </button>
          <button
            type="button"
            className="flex items-center justify-center w-full p-3 font-semibold tracking-wide rounded-md dark:bg-violet-400 dark:text-gray-900"
            keyprop="reserve"
          >
            Add to Cart
          </button>
        </div>
      </div>
  );
};

export default Bookcard;
