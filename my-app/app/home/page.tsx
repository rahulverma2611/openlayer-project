import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <div className="flex justify-center items-center h-screen gap-5">
      <Link href="/pin-point">
        <button
          type="button"
          className="text-white bg-blue-600 hover:bg-blue-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 "
        >
          Pin-Point on Map
        </button>
      </Link>
      <Link href="/draw-on-map">
        <button
          type="button"
          className="text-white bg-red-600 hover:bg-red-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 "
        >
          Draw on Map
        </button>{" "}
      </Link>
    </div>
  );
};

export default HomePage;
