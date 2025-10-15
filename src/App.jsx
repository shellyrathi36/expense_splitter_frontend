import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AuthForm from "./components/AuthForm.jsx";
import WelcomeSection from "./components/WelcomeSection.jsx";
import Sidebar from "./components/Sidebar.jsx";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import About from "./pages/About.jsx";
import Group from "./pages/Group.jsx";
import Expense from "./pages/Expense.jsx";
import Faq from "./pages/Faq.jsx";

export default function App() {
  const [page, setPage] = useState("welcome"); // welcome | register | login | dashboard
  const [userToken, setUserToken] = useState(localStorage.getItem("token"));
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Dummy groups for demonstration
  const groups = [
    { _id: 1, name: "Friends" },
    { _id: 2, name: "Roommates" },
    { _id: 3, name: "Travel" },
  ];

  useEffect(() => {
    if (userToken) setPage("dashboard"); // navigate to dashboard if already logged in
  }, [userToken]);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setUserToken(token);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserToken(null);
    setPage("welcome");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar
        userToken={userToken}
        handleLogout={handleLogout}
        setPage={setPage}
      />

      <div className="flex flex-grow">
        {/* Sidebar only for logged-in users */}
        {userToken && page !== "welcome" && (
          <Sidebar groups={groups} setSelectedGroup={setSelectedGroup} />
        )}

        {/* Main Content */}
        <main className="flex-grow p-4 bg-gray-50 flex justify-center items-start">
          {page === "welcome" && <WelcomeSection />}
          {page === "login" && (
            <AuthForm
              mode="login"
              setPage={setPage}
              handleLogin={handleLogin}
            />
          )}
          {page === "register" && (
            <AuthForm mode="register" setPage={setPage} />
          )}
          {page === "dashboard" && userToken && (
            <Dashboard selectedGroup={selectedGroup} />
          )}
          {userToken && page === "about" && <About />}
          {userToken && page === "group" && <Group />}
          {userToken && page === "expense" && <Expense />}
          {userToken && page === "faq" && <Faq />}
        </main>
      </div>

      <Footer />
    </div>
  );
}
