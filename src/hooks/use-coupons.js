import { useEffect, useState } from "react";
import { getCoupons } from "@/app/api/coupons/route";

export const useCoupons = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      const data = await getCoupons();
      setCoupons(data);
      console.log(data)
    };
    fetchCoupons();
  }, []);

  return coupons;
};
