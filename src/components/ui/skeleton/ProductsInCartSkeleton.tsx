import React from "react";
import Skeleton from "react-loading-skeleton";

export const ProductsInCartSkeleton = () => {
  return (
    <div className="grid grid-cols-3 gap-5">
      <Skeleton className="col-span-1" height={90}/>
      <div className="col-span-2">
        <Skeleton count={4} />
      </div>
    </div>
  );
};
