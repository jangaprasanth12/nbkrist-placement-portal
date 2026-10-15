import { useState } from "react";
import { GraduationCap, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import "./Auth.css";

const USERS_KEY = "nbkrist_demo_users";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", studentId: "", email: "", password: "" });
  const update = (field, value) => { setForm(old => ({ ...old, [field]: value })); setMessage(""); };
  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch { return []; }
  }
  function submit(event) {
    event.preventDefault();
    const users = getUsers();
    const email = form.email.trim().toLowerCase();
    if (mode === "register") {
      if (!form.name.trim() || !form.studentId.trim()) return setMessage("Enter your full name and student ID.");
      if (form.password.length < 6) return setMessage("Password must contain at least 6 characters.");
      if (users.some(u => u.email === email || u.studentId.toLowerCase() === form.studentId.trim().toLowerCase())) return setMessage("This email or student ID is already registered.");
      users.push({ name: form.name.trim(), studentId: form.studentId.trim(), email, password: form.password });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      setMode("login"); setForm(old => ({ ...old, password: "" }));
      setMessage("Registration successful! Please log in.");
      return;
    }
    const identity = form.email.trim().toLowerCase();
    const user = users.find(u => (u.email === identity || u.studentId.toLowerCase() === identity) && u.password === form.password);
    if (!user) return setMessage("Invalid email/student ID or password. Register first if you are a new student.");
    onLogin({ name: user.name, studentId: user.studentId, email: user.email });
  }
  return <main className="auth-page"><section className="auth-card">
    <div className="auth-brand"><img src="/nbkrist-logo.webp" alt="NBKRIST logo" onError={e => { e.currentTarget.style.display = "none"; }} /><div><h1>NBKRIST</h1><p>PLACEMENT PORTAL</p></div></div>
    <div className="auth-icon">{mode === "login" ? <LogIn size={25}/> : <UserPlus size={25}/>}</div>
    <h2>{mode === "login" ? "Welcome back!" : "Create your account"}</h2>
    <p className="auth-subtitle">{mode === "login" ? "Sign in to continue your placement journey." : "Register to access placement opportunities and Interview AI."}</p>
    <form onSubmit={submit}>
      {mode === "register" && <><label>Full name<input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Enter your full name" required /></label><label>Student ID / Roll number<input value={form.studentId} onChange={e => update("studentId", e.target.value)} placeholder="Enter your student ID" required /></label></>}
      <label>Email or student ID<input value={form.email} onChange={e => update("email", e.target.value)} placeholder="Enter email or student ID" autoComplete="username" required /></label>
      <label>Password<div className="auth-password"><input type={showPassword ? "text" : "password"} value={form.password} onChange={e => update("password", e.target.value)} placeholder="Enter password" autoComplete={mode === "login" ? "current-password" : "new-password"} required /><button type="button" onClick={() => setShowPassword(v => !v)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></label>
      {message && <p className="auth-message" role="status">{message}</p>}
      <button className="auth-submit" type="submit">{mode === "login" ? "Log in" : "Create account"}</button>
    </form>
    <p className="auth-switch">{mode === "login" ? "New student?" : "Already registered?"}<button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(""); }}>{mode === "login" ? " Create account" : " Log in"}</button></p>
    <p className="auth-footer"><GraduationCap size={15}/> N.B.K.R. Institute of Science and Technology · Vidyanagar</p>
    <p className="auth-security-note">Demo authentication: credentials are stored in this browser only. Do not use a real password.</p>
  </section></main>;
}
