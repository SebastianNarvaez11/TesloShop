import React from "react";
import Skeleton from "react-loading-skeleton";

export const OrderSummarySkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-5">
      <Skeleton count={5} />
      <Skeleton count={5} />
    </div>
  );
};
