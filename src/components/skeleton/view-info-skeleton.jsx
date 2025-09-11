import React from "react";
import { Skeleton } from "../ui/skeleton";

function ViewInfoSkeleton({ }) {
  return (
   <div className="flex flex-col w-full px-4 lg:px-6 space-y-2">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/3 mt-2" />
        <Skeleton className="h-4 w-1/4 mt-2" />
      </div>
  );
}

export default ViewInfoSkeleton;
