import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Auth from "./Auth.jsx";
import "./index.css";

function Root() {
  const [student, setStudent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nbkrist_session")) || null;
    } catch {
      return null;
    }
  });

  function handleLogin(user) {
    localStorage.setItem("nbkrist_session", JSON.stringify(user));
    setStudent(user);
  }

  function handleLogout() {
    localStorage.removeItem("nbkrist_session");
    setStudent(null);
  }

  return student
    ? <App student={student} onLogout={handleLogout} />
    : <Auth onLogin={handleLogin} />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode><Root /></React.StrictMode>
);
