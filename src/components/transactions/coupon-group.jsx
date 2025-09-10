"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCoupon } from "@/lib/store/slices/transactionsSlice";
import { fetchCoupons } from "@/lib/store/slices/couponsSlice";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

function CouponGroup() {
  const dispatch = useDispatch();
  const coupons = useSelector((state) => state.coupons.data) || [];
  const cloading = useSelector((state) => state.coupons.cloading);
  const cerror = useSelector((state) => state.coupons.cerror);

  const selectedCoupon = useSelector((state) => state.transactions.selectedCoupon);
  //console.log(selectedCoupon)

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  return (
    <Select
      //value={selectedCoupon || ""}
      onValueChange={(codename) => dispatch(setSelectedCoupon(codename))}
      disabled={cloading || cerror}
    >
      <SelectTrigger className="w-[200px] uppercase">
        <SelectValue placeholder={cloading ? "Loading..." : "Select Coupon"} />
      </SelectTrigger>
      <SelectContent className="uppercase">
        {coupons.map((c) => (
          <SelectItem key={c.id} value={c.codename}>
            {c.codename} - GHS {c.amount}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default CouponGroup;
