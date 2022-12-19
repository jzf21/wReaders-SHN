import React from "react";
import { useState } from "react";

const Bookcard = ({ title, authors, url, isReservable }) => {
  const handleReserve = () => {
    console.log("Reserve button clicked");
    
  };
  return (
    <>
      <div className="max-w-xs rounded-md shadow-md dark:bg-gray-900 dark:text-gray-100">
        <img
          src={url}
          alt=""
          className="object-cover object-center w-full rounded-t-md h-72 dark:bg-gray-500"
        />
        <div className="flex flex-col justify-between p-6 space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-wide">{title}</h2>
            <p className="dark:text-gray-100">{authors}</p>
          </div>
          <button
            type="button"
            className="flex items-center justify-center w-full p-3 font-semibold tracking-wide rounded-md dark:bg-violet-400 dark:text-gray-900"
            keyProp="rent"
            disabled={!isReservable}
            onClick={() => {
              console.log("clicked");
            }}
          >
            {isReservable ? "Rent" : "Not Available to rent"}
          </button>
          <button
            type="button"
            className="flex items-center justify-center w-full p-3 font-semibold tracking-wide rounded-md dark:bg-violet-400 dark:text-gray-900"
            keyprop="reserve"
          >
            Reserve
          </button>
        </div>
      </div>
    </>
  );
};

export default Bookcard;
