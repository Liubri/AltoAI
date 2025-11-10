import React from "react";

export default function Loader() {
  return (
    <div className="flex justify-end items-end h-[40px]">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-2 mx-[5px] bg-primary rounded-md animate-loading-wave"
          style={{ animationDelay: `${i * 0.1}s` }}
        ></div>
      ))}
    </div>
  );
}