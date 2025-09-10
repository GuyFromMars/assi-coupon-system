"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import CouponGroup from "./coupon-group";
import { searchStudentsByCoupon } from "@/lib/store/slices/transactionsSlice";
import { toast } from "sonner";

function CouponGroupForm() {
  const dispatch = useDispatch();
  const { selectedCoupon, loading } = useSelector((state) => state.transactions);

  const handleSearch = () => {
    if (!selectedCoupon) {
      toast("Please select a coupon first");
      return;
    }
    console.log(selectedCoupon)
    dispatch(searchStudentsByCoupon(selectedCoupon));
  };

  return (
    <div className="flex justify-start w-full px-4 lg:px-6 space-x-2">
      <CouponGroup />
      <Button
        variant="outline"
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </Button>
    </div>
  );
}

export default CouponGroupForm;
