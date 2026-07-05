import React from "react";
import "./Loading.css";

export default function Loading({
  text = "Loading...",
  size = "medium",
}) {
  return (
    <div className={`loading loading-${size}`}>
      <div className="loading-spinner"></div>
      <p>{text}</p>
    </div>
  );
}