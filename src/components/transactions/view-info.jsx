"use client";
import React from "react";

function ViewInfo() {
  return (
    <div className="flex flex-col w-full px-4 lg:px-6 space-x-2">
      <p className="sm:text-3xl text-xl px-1">
        Kweku Manu Amoah
      </p>
        <p className="px-1 mt-2 text-sm sm:text-lg">
            Coupon Group: ASSICAT2
        </p>
        <p className="px-1 mt-2 text-sm sm:text-lg">
            Balance: GHS 200
        </p>
    </div>
  );
}

export default ViewInfo;
