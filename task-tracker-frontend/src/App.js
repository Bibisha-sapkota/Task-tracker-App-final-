import React, { useState, useEffect } from "react";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState("login"); // default page
  const [token, setToken] = useState(null);

  // Check if token saved in localStorage on load
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // If logged in, show dashboard
  if (token) {
    return <Dashboard onLogout={() => {
      localStorage.removeItem("token");
      setToken(null);
      setPage("login");
    }} />;
  }

  // If not logged in, show menu and signup/login pages
  return (
    <div className="p-4">
      <nav className="mb-4">
        <button
          className={`mr-2 px-4 py-2 ${page === "signup" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setPage("signup")}
        >
          Signup
        </button>
        <button
          className={`px-4 py-2 ${page === "login" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setPage("login")}
        >
          Login
        </button>
      </nav>

      {page === "signup" && <Signup onLogin={(token) => setToken(token)} />}
      {page === "login" && <Login onLogin={(token) => setToken(token)} />}
    </div>
  );
}

export default App;
