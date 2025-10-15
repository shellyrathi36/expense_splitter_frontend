import React from "react";

const Navbar = ({ userToken, handleLogout, setPage }) => {
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => setPage(userToken ? "dashboard" : "welcome")}
      >
        ExpenseSplitter
      </h1>

      <div className="space-x-4 flex items-center">
        {userToken ? (
          <>
            <button
              onClick={() => setPage("dashboard")}
              className="hover:text-blue-500"
            >
              Dashboard
            </button>
            <button
              onClick={() => setPage("group")}
              className="hover:text-blue-500"
            >
              Group
            </button>
            <button
              onClick={() => setPage("expense")}
              className="hover:text-blue-500"
            >
              Expense
            </button>
            <button
              onClick={() => setPage("faq")}
              className="hover:text-blue-500"
            >
              FAQ
            </button>
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setPage("register")}
              className="ml-4 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
            >
              Register
            </button>
            <button
              onClick={() => setPage("login")}
              className="ml-2 bg-gray-200 text-gray-800 py-1 px-3 rounded hover:bg-gray-300 transition"
            >
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
