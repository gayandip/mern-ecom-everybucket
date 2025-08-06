import React from "react";
import { Link } from "react-router-dom";

function Error({ message = "Oops! Something went wrong.", statusCode = 501 }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
        <div className="text-6xl mb-4 text-red-500">&#9888;</div>
        {statusCode && (
          <div className="text-xl font-bold text-red-400 mb-2">
            Error {statusCode}
          </div>
        )}
        <h1 className="text-center text-3xl font-bold mb-2 text-red-600">
          {message}
        </h1>
        <p className="mb-6 text-gray-700 text-center">
          The page you are looking for does not exist or an unexpected error has
          occurred.
        </p>
        <Link to="/" className="btn-green">
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default Error;
