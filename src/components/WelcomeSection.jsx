//import logo from "../assets/logo.png";
import React from "react";

export default function WelcomeSection() {
  return (
    <div className="text-center max-w-2xl p-8">
      {/* <img
        src={logo}
        alt="ExpenseSplit Logo"
        className="mx-auto mb-6 w-28 h-28 rounded-full shadow-lg"
      /> */}
      <h2 className="text-3xl font-bold text-blue-700 mb-4">
        Welcome to ExpenseSplit 💰
      </h2>
      <p className="text-gray-700 text-lg mb-6">
        Simplify your shared expenses with friends, roommates, or travel groups.
        <br />
        Track, split, and settle costs fairly — no more awkward money talks!
      </p>
      <p className="text-gray-500 italic">
        “Because every rupee deserves fairness.”
      </p>
    </div>
  );
}
