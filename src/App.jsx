import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, BriefcaseBusiness, ClipboardList, UserRound,
  Search, Bell, Menu, X, MapPin, CalendarDays, IndianRupee,
  ArrowUpRight, CheckCircle2, GraduationCap, TrendingUp, Plus,
  Filter, BookOpen, LogOut
} from "lucide-react";
import InterviewAI from "./InterviewAI.jsx";
import "./App.css";

const initialJobs = [
  { id: 1, company: "Infosys", role: "Systems Engineer", type: "Full-time", location: "Bengaluru", package: "3.6 LPA", branch: "CSE, IT, ECE", deadline: "2026-11-20", color: "#087f8c", description: "Sample listing for enterprise software and digital solutions." },
  { id: 2, company: "TCS", role: "Assistant System Engineer", type: "Full-time", location: "Hyderabad", package: "3.8 LPA", branch: "All branches", deadline: "2026-11-25", color: "#5269c7", description: "Sample listing for software development and enterprise technology." },
  { id: 3, company: "Wipro", role: "Project Engineer", type: "Full-time", location: "Chennai", package: "4.0 LPA", branch: "CSE, IT, ECE", deadline: "2026-12-02", color: "#a34db8", description: "Sample listing for technology solutions and engineering." },
  { id: 4, company: "Zoho", role: "Junior Developer", type: "Full-time", location: "Chennai", package: "6.0 LPA", branch: "CSE, IT", deadline: "2026-12-10", color: "#df7439", description: "Sample listing for product development and programming." },
  { id: 5, company: "Accenture", role: "Associate Software Engineer", type: "Internship", location: "Bengaluru", package: "4.5 LPA", branch: "CSE, IT, ECE", deadline: "2026-12-15", color: "#7952b3", description: "Sample listing for software engineering and client projects." },
  { id: 6, company: "Tech Mahindra", role: "Graduate Engineer Trainee", type: "Full-time", location: "Pune", package: "3.5 LPA", branch: "All branches", deadline: "2026-12-20", color: "#218b71", description: "Sample listing for digital technology and application development." }
];

const defaultProfile = {
  name: "Student", rollNo: "", email: "", phone: "", branch: "CSE",
  cgpa: "", graduationYear: "2028", skills: "Java, Python, HTML, CSS, JavaScript"
};

function readLocal(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function Field({ label, value, onChange, type = "text", ...props }) {
  return <label className="field">{label}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} {...props} />
  </label>;
}

function StatCard({ icon: Icon, label, value, note, tone }) {
  return <div className="stat-card">
    <div className={`stat-icon ${tone}`}><Icon size={21} /></div>
    <span className="stat-label">{label}</span>
    <strong className="stat-value">{value}</strong>
    <span className="stat-note">{note}</span>
  </div>;
}

function EmptyState({ message }) {
  return <div className="empty-state"><BriefcaseBusiness size={28} /><p>{message}</p></div>;
}

function JobCard({ job, applied, onApply }) {
  return <article className="job-card">
    <div className="job-card-top">
      <div className="company-mark" style={{ "--mark": job.color }}>{job.company[0]}</div>
      <span className={`job-type ${job.type === "Internship" ? "internship" : ""}`}>{job.type}</span>
    </div>
    <h3>{job.role}</h3><p className="job-company">{job.company}</p>
    <p className="job-description">{job.description}</p>
    <div className="job-meta">
      <span><MapPin size={15} />{job.location}</span>
      <span><IndianRupee size={15} />{job.package}</span>
      <span><GraduationCap size={15} />{job.branch}</span>
      <span><CalendarDays size={15} />Deadline: {job.deadline || "Not set"}</span>
    </div>
    <button className={`primary-btn job-apply-btn ${applied ? "applied-btn" : ""}`} onClick={() => onApply(job)}>
      {applied ? <><CheckCircle2 size={16} /> Applied</> : <>Apply now <ArrowUpRight size={16} /></>}
    </button>
  </article>;
}

export default function App({ student, onLogout }) {
  const [page, setPage] = useState("Dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [toast, setToast] = useState("");
  const [jobs, setJobs] = useState(() => readLocal("nbkrist_jobs", initialJobs));
  const [profile, setProfile] = useState(() => readLocal("nbkrist_profile", { ...defaultProfile, name: student?.name || defaultProfile.name, rollNo: student?.studentId || "", email: student?.email || "" }));
  const [applications, setApplications] = useState(() => readLocal("nbkrist_applications", []));
  const [showJobForm, setShowJobForm] = useState(false);
  const [newJob, setNewJob] = useState({
    company: "", role: "", package: "", location: "Bengaluru", type: "Full-time",
    branch: "CSE, IT", deadline: "", description: ""
  });

  useEffect(() => localStorage.setItem("nbkrist_jobs", JSON.stringify(jobs)), [jobs]);
  useEffect(() => localStorage.setItem("nbkrist_profile", JSON.stringify(profile)), [profile]);
  useEffect(() => localStorage.setItem("nbkrist_applications", JSON.stringify(applications)), [applications]);

  const notify = message => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };

  const appliedIds = applications.map(a => a.jobId);
  const filteredJobs = useMemo(() => jobs.filter(job => {
    const term = search.trim().toLowerCase();
    return `${job.company} ${job.role} ${job.location} ${job.branch}`.toLowerCase().includes(term)
      && (filter === "All" || job.type === filter);
  }), [jobs, search, filter]);

  const applyJob = job => {
    if (appliedIds.includes(job.id)) return notify("You have already applied to this demo listing.");
    if (!profile.name.trim() || !profile.email.trim()) {
      setPage("My Profile");
      return notify("Please add your name and email before applying.");
    }
    setApplications(old => [...old, {
      jobId: job.id, company: job.company, role: job.role, package: job.package,
      appliedOn: new Date().toISOString(), status: "Applied"
    }]);
    notify(`Application saved for ${job.company}.`);
  };

  const addJob = event => {
    event.preventDefault();
    setJobs(old => [{ ...newJob, id: Date.now(), color: "#3267d5" }, ...old]);
    setNewJob({ company: "", role: "", package: "", location: "Bengaluru", type: "Full-time", branch: "CSE, IT", deadline: "", description: "" });
    setShowJobForm(false);
    notify("Demo job listing added.");
  };

  const updateStatus = (jobId, status) => {
    setApplications(old => old.map(a => a.jobId === jobId ? { ...a, status } : a));
    notify("Application status updated.");
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Find Jobs", icon: BriefcaseBusiness },
    { label: "My Applications", icon: ClipboardList },
    { label: "Interview AI", icon: BookOpen },
    { label: "My Profile", icon: UserRound }
  ];

  return <div className="portal">
    <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
      <div className="brand">
        <img src="/nbkrist-logo.webp" alt="NBKRIST logo" className="college-logo"
          onError={e => { e.currentTarget.style.display = "none"; }} />
        <div><strong>NBKRIST</strong><span>PLACEMENT PORTAL</span></div>
        <button className="icon-btn close-menu" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={18} /></button>
      </div>
      <div className="nav-label">WORKSPACE</div>
      <nav className="nav-list">
        {navItems.map(({ label, icon: Icon }) => <button key={label}
          className={`nav-item ${page === label ? "active" : ""}`}
          onClick={() => { setPage(label); setMobileMenu(false); }}>
          <Icon size={19} /><span>{label}</span>
          {label === "My Applications" && applications.length > 0 && <span className="nav-count">{applications.length}</span>}
        </button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="support-card"><GraduationCap size={23} /><strong>Build your future</strong><p>Prepare today. Get placed tomorrow.</p></div>
        <div className="college-caption">N.B.K.R. Institute of Science and Technology<br />Vidyanagar</div>
      </div>
    </aside>
    {mobileMenu && <button className="mobile-overlay" onClick={() => setMobileMenu(false)} aria-label="Close navigation" />}
    <main className="main-area">
      <header className="topbar">
        <div className="topbar-left">
          <button className="icon-btn mobile-menu-btn" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu size={21} /></button>
          <div><div className="breadcrumb">Workspace / {page}</div><h1>{page}</h1></div>
        </div>
        <div className="topbar-right">
          <div className="semester-pill"><span className="online-dot" /> Student workspace</div>
          <button className="icon-btn notification-btn" onClick={() => notify("You are all caught up!")} aria-label="Notifications"><Bell size={18} /></button>
          <button className="profile-chip" onClick={() => setPage("My Profile")}><span className="avatar">{(profile.name || "S").trim()[0].toUpperCase()}</span><span className="profile-chip-name">{profile.name || "Student"}</span></button><button className="icon-btn" onClick={onLogout} title="Log out" aria-label="Log out"><LogOut size={18} /></button>
        </div>
      </header>

      <div className="page-content">
        {page === "Dashboard" && <>
          <section className="welcome-banner">
            <div className="welcome-content">
              <span className="eyebrow">YOUR CAREER JOURNEY</span>
              <h2>Hello, {profile.name || "Student"}! 👋</h2>
              <p>Discover opportunities, track applications and practise for your next interview.</p>
              <button className="primary-btn banner-btn" onClick={() => setPage("Find Jobs")}>Explore jobs <ArrowUpRight size={16} /></button>
              <button className="primary-btn banner-btn interview-cta" onClick={() => setPage("Interview AI")}><BookOpen size={16} /> Practise with Interview AI</button>
            </div>
            <div className="banner-art"><div className="art-circle"><GraduationCap size={74} /></div><span className="art-spark spark-one">✦</span><span className="art-spark spark-two">✧</span></div>
          </section>

          <div className="section-heading"><div><h2>Placement overview</h2><p>Your current placement activity.</p></div><span className="today-tag">Saved in this browser</span></div>
          <section className="stats-grid">
            <StatCard icon={BriefcaseBusiness} label="Available jobs" value={jobs.length} note="Sample opportunities" tone="blue" />
            <StatCard icon={ClipboardList} label="Applications" value={applications.length} note="Your saved applications" tone="purple" />
            <StatCard icon={CheckCircle2} label="Shortlisted" value={applications.filter(a => ["Shortlisted", "Selected"].includes(a.status)).length} note="Shortlisted or selected" tone="green" />
            <StatCard icon={TrendingUp} label="Profile CGPA" value={profile.cgpa || "—"} note="Your academic score" tone="orange" />
          </section>

          <div className="content-grid">
            <section className="panel">
              <div className="panel-heading"><div><h3>Latest opportunities</h3><p>Sample listings for demonstration.</p></div><button className="text-btn" onClick={() => setPage("Find Jobs")}>View all <ArrowUpRight size={15} /></button></div>
              {jobs.slice(0, 3).map(job => <div className="job-row" key={job.id}>
                <div className="company-mark" style={{ "--mark": job.color }}>{job.company[0]}</div>
                <div className="job-row-info"><strong>{job.role}</strong><span>{job.company} · {job.location}</span></div>
                <div className="job-row-right"><strong>{job.package}</strong><button className="small-link" onClick={() => applyJob(job)}>{appliedIds.includes(job.id) ? "Applied" : "Apply"}</button></div>
              </div>)}
              {jobs.length === 0 && <EmptyState message="No jobs listed yet." />}
            </section>
            <section className="panel progress-panel">
              <div className="panel-heading"><div><h3>Get interview-ready</h3><p>Build your skills every day.</p></div></div>
              <div className="progress-ring"><div className="progress-inner"><strong>{applications.length}</strong><span>Applications</span></div></div>
              <p className="progress-help">Practise company questions, aptitude, reasoning and mock interviews.</p>
              <button className="secondary-btn full-btn" onClick={() => setPage("Interview AI")}>Open Interview AI <ArrowUpRight size={16} /></button>
            </section>
          </div>
        </>}

        {page === "Find Jobs" && <section>
          <div className="jobs-intro"><div><h2>Find your opportunity</h2><p>Sample listings; verify real vacancies through official employer channels.</p></div><button className="primary-btn" onClick={() => setShowJobForm(v => !v)}><Plus size={17} /> Add demo job</button></div>
          {showJobForm && <form className="panel job-form" onSubmit={addJob}>
            <h3>Add a demo listing</h3><div className="form-grid">
              <Field label="Company" value={newJob.company} onChange={v => setNewJob({ ...newJob, company: v })} required />
              <Field label="Job role" value={newJob.role} onChange={v => setNewJob({ ...newJob, role: v })} required />
              <Field label="Package" value={newJob.package} onChange={v => setNewJob({ ...newJob, package: v })} required />
              <Field label="Location" value={newJob.location} onChange={v => setNewJob({ ...newJob, location: v })} required />
              <Field label="Eligible branches" value={newJob.branch} onChange={v => setNewJob({ ...newJob, branch: v })} required />
              <Field label="Deadline" type="date" value={newJob.deadline} onChange={v => setNewJob({ ...newJob, deadline: v })} required />
            </div>
            <label className="field">Employment type<select value={newJob.type} onChange={e => setNewJob({ ...newJob, type: e.target.value })}><option>Full-time</option><option>Internship</option></select></label>
            <label className="field">Description<textarea rows="3" value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} /></label>
            <div className="form-actions"><button type="button" className="secondary-btn" onClick={() => setShowJobForm(false)}>Cancel</button><button className="primary-btn">Save listing</button></div>
          </form>}
          <div className="job-toolbar"><div className="search-box"><Search size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search company, role or location..." /></div><div className="filter-box"><Filter size={16} /><select value={filter} onChange={e => setFilter(e.target.value)}><option>All</option><option>Full-time</option><option>Internship</option></select></div></div>
          <p className="results-label">{filteredJobs.length} opportunities found</p>
          <div className="job-grid">{filteredJobs.map(job => <JobCard key={job.id} job={job} applied={appliedIds.includes(job.id)} onApply={applyJob} />)}</div>
          {!filteredJobs.length && <EmptyState message="No matching jobs. Try another search." />}
        </section>}

        {page === "My Applications" && <section className="panel applications-panel">
          <div className="panel-heading"><div><h3>Application tracker</h3><p>Track the demo applications saved in this browser.</p></div><span className="today-tag">{applications.length} total</span></div>
          {!applications.length ? <EmptyState message="No applications yet. Open Find Jobs and apply to a sample listing." /> :
            <div className="table-wrap"><table><thead><tr><th>Company / role</th><th>Package</th><th>Date applied</th><th>Status</th></tr></thead><tbody>
              {applications.map(app => <tr key={app.jobId}><td><strong>{app.company}</strong><span className="table-subtitle">{app.role}</span></td><td>{app.package}</td><td>{new Date(app.appliedOn).toLocaleDateString()}</td><td><select className={`status-select status-${app.status.toLowerCase()}`} value={app.status} onChange={e => updateStatus(app.jobId, e.target.value)}><option>Applied</option><option>Shortlisted</option><option>Interview</option><option>Selected</option><option>Rejected</option></select></td></tr>)}
            </tbody></table></div>}
        </section>}

        {page === "Interview AI" && <InterviewAI />}

        {page === "My Profile" && <section className="profile-layout">
          <div className="panel profile-summary"><div className="large-avatar">{(profile.name || "S").trim()[0].toUpperCase()}</div><h2>{profile.name || "Student name"}</h2><p>{profile.branch} Student</p><span className="student-tag"><GraduationCap size={15} /> Class of {profile.graduationYear}</span><div className="summary-divider" /><div className="summary-stat"><span>CGPA</span><strong>{profile.cgpa || "—"}</strong></div><div className="summary-stat"><span>Applications</span><strong>{applications.length}</strong></div><p className="local-note"><CheckCircle2 size={15} /> Saved in this browser</p></div>
          <form className="panel profile-form" onSubmit={e => { e.preventDefault(); notify("Profile saved."); }}>
            <div className="panel-heading"><div><h3>Student profile</h3><p>Profile data is saved automatically in local storage.</p></div></div>
            <div className="form-grid">
              <Field label="Full name" value={profile.name} onChange={v => setProfile({ ...profile, name: v })} required />
              <Field label="Roll number" value={profile.rollNo} onChange={v => setProfile({ ...profile, rollNo: v })} />
              <Field label="Email address" type="email" value={profile.email} onChange={v => setProfile({ ...profile, email: v })} required />
              <Field label="Phone" type="tel" value={profile.phone} onChange={v => setProfile({ ...profile, phone: v })} />
              <label className="field">Branch<select value={profile.branch} onChange={e => setProfile({ ...profile, branch: e.target.value })}><option>CSE</option><option>IT</option><option>ECE</option><option>EEE</option><option>Mechanical</option><option>Civil</option><option>Other</option></select></label>
              <Field label="CGPA" type="number" min="0" max="10" step="0.01" value={profile.cgpa} onChange={v => setProfile({ ...profile, cgpa: v })} />
              <Field label="Graduation year" type="number" value={profile.graduationYear} onChange={v => setProfile({ ...profile, graduationYear: v })} />
            </div>
            <label className="field">Skills<textarea rows="3" value={profile.skills} onChange={e => setProfile({ ...profile, skills: e.target.value })} /></label>
            <div className="form-actions"><button type="button" className="secondary-btn" onClick={() => setProfile(defaultProfile)}>Reset profile</button><button type="submit" className="primary-btn">Save profile</button></div>
          </form>
        </section>}

        <footer className="app-footer"><span>© {new Date().getFullYear()} NBKRIST Placement Portal</span><span>Student career workspace · Local demo</span></footer>
      </div>
    </main>
    {toast && <div className="toast" role="status"><CheckCircle2 size={18} />{toast}</div>}
  </div>;
}
