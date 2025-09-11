"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentInfo } from "@/lib/store/slices/infoSlice";
import { useParams } from "next/navigation";
import ViewInfoSkeleton from "../skeleton/view-info-skeleton";

function ViewInfo() {
  const { id } = useParams(); // get student ID from URL
  const dispatch = useDispatch();
  const { student, loading, error } = useSelector((state) => state.info);

  useEffect(() => {
    if (id) dispatch(fetchStudentInfo(id));
  }, [id, dispatch]);

  if (loading || !student) return <ViewInfoSkeleton />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col w-full px-4 lg:px-6 space-x-2">
      <p className="sm:text-3xl text-xl px-1">{student.name}</p>
      <p className="px-1 mt-2 text-sm sm:text-lg">
        Coupon Group: {student.couponcode}
      </p>
      <p className={student.balance < 0 ? "text-red-500 font-semibold px-1 mt-2 text-sm sm:text-lg" : "px-1 mt-2 text-sm sm:text-lg"}>
        Balance: GHS {student.balance}
      </p>
    </div>
  );
}

export default ViewInfo;
