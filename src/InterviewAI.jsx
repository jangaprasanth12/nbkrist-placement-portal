import { useEffect, useMemo, useState } from "react";
import {
  BookOpen, Building2, Brain, MessagesSquare, Bookmark, CheckCircle2,
  ArrowRight, ArrowLeft, Trophy, Target, Lightbulb, GraduationCap, RotateCcw
} from "lucide-react";
import "./InterviewAI.css";

const companyQuestions = [
  { id:"tcs1", company:"TCS", role:"Software Developer", category:"Technical", question:"What is the difference between JDK, JRE and JVM?", answer:"JVM executes Java bytecode. JRE contains the JVM and libraries needed to run Java applications. JDK includes development tools such as the compiler, along with runtime components.", tip:"Explain the relationship: JDK is for development, JRE is for running, and JVM executes bytecode." },
  { id:"tcs2", company:"TCS", role:"Software Developer", category:"Technical", question:"What is the difference between an array and a linked list?", answer:"Arrays provide indexed access, typically O(1), while linked lists require traversal for indexed access, typically O(n). Insertions and deletions can be easier in linked lists when the position is already known.", tip:"Mention access time, memory layout, and insertion/deletion trade-offs." },
  { id:"infosys1", company:"Infosys", role:"Systems Engineer", category:"Technical", question:"What are the four pillars of object-oriented programming?", answer:"Encapsulation, abstraction, inheritance and polymorphism. They help organize code, hide implementation details, reuse behavior and support flexible interfaces.", tip:"Prepare a simple Java example for each pillar." },
  { id:"infosys2", company:"Infosys", role:"Systems Engineer", category:"HR", question:"Tell me about yourself.", answer:"Introduce your degree and branch, relevant skills, one project or achievement, and the role you want. Keep the answer structured and around 60–90 seconds.", tip:"Use genuine details from your education and projects." },
  { id:"wipro1", company:"Wipro", role:"Project Engineer", category:"Technical", question:"What is the difference between SQL and NoSQL databases?", answer:"Relational SQL databases use tables and relationships. NoSQL includes document, key-value, graph and wide-column models. The right choice depends on the data and application needs.", tip:"Give one example of each type." },
  { id:"wipro2", company:"Wipro", role:"Project Engineer", category:"HR", question:"How do you handle a difficult deadline?", answer:"Clarify the goal, break work into tasks, prioritize critical items, communicate risks early and test important functionality before delivery.", tip:"Use a real example when possible." },
  { id:"accenture1", company:"Accenture", role:"Associate Software Engineer", category:"Technical", question:"What is a REST API?", answer:"A REST API exposes resources through HTTP endpoints. GET retrieves data, POST creates resources, PUT or PATCH updates them, and DELETE removes them.", tip:"Know HTTP status codes such as 200, 201, 400, 401, 404 and 500." },
  { id:"accenture2", company:"Accenture", role:"Associate Software Engineer", category:"HR", question:"Describe a project you have built.", answer:"Explain the problem, your role, technologies used, main features, one challenge you solved, and what you would improve next.", tip:"Be ready to explain your own code and design decisions." },
  { id:"cognizant1", company:"Cognizant", role:"Programmer Analyst", category:"Technical", question:"What is the difference between a process and a thread?", answer:"A process is an executing program with its own resources and address space. Threads are execution paths within a process that share memory and resources.", tip:"Mention shared memory and context switching." },
  { id:"cognizant2", company:"Cognizant", role:"Programmer Analyst", category:"Technical", question:"What is normalization in DBMS?", answer:"Normalization organizes relational tables to reduce redundancy and update anomalies. Common normal forms include 1NF, 2NF and 3NF.", tip:"Prepare a small example using a functional dependency." },
  { id:"zoho1", company:"Zoho", role:"Junior Developer", category:"Technical", question:"How would you reverse a string in Java?", answer:"Use new StringBuilder(input).reverse().toString(), or traverse the string from its final character to its first and build the result.", tip:"Practise the loop approach without built-in methods." },
  { id:"zoho2", company:"Zoho", role:"Junior Developer", category:"Technical", question:"How do you find duplicate elements in an array?", answer:"Use a HashSet to track values already seen. When a value is already in the set, it is a duplicate. This has O(n) expected time.", tip:"Know whether the problem asks for unique duplicates or every occurrence." },
  { id:"tcs3", company:"TCS", role:"Software Developer", category:"Technical", question:"What is polymorphism in Java?", answer:"Polymorphism means one interface can represent different implementations. Java supports compile-time polymorphism through method overloading and runtime polymorphism through overriding.", tip:"Explain with a short code example." },
  { id:"infosys3", company:"Infosys", role:"Systems Engineer", category:"Technical", question:"What is the difference between an interface and an abstract class?", answer:"An interface defines a contract that classes implement. An abstract class can provide shared state and both abstract and concrete methods. A class can implement multiple interfaces but extend only one class.", tip:"Explain when you would choose each." }
];

const aptitudeQuestions = [
  { id:"a1", topic:"Percentages", question:"What is 20% of 450?", options:["45","80","90","100"], answer:2, explanation:"20% of 450 = 20/100 × 450 = 90." },
  { id:"a2", topic:"Profit and Loss", question:"An item costs ₹800 and sells for ₹1,000. What is the profit percentage?", options:["20%","25%","30%","15%"], answer:1, explanation:"Profit = ₹200. Profit percentage = 200/800 × 100 = 25%." },
  { id:"a3", topic:"Time and Work", question:"A completes a job in 10 days. What fraction of the job is completed in one day?", options:["1/5","1/10","1/2","10"], answer:1, explanation:"One day's work = 1 divided by 10 days = 1/10." },
  { id:"a4", topic:"Average", question:"Find the average of 12, 18, 20 and 30.", options:["18","19","20","22"], answer:2, explanation:"Sum = 80. Average = 80/4 = 20." },
  { id:"a5", topic:"Speed", question:"A car travels 150 km in 3 hours. What is its average speed?", options:["30 km/h","45 km/h","50 km/h","60 km/h"], answer:2, explanation:"Speed = distance/time = 150/3 = 50 km/h." },
  { id:"a6", topic:"Ratio", question:"Two numbers are in ratio 2:3 and their sum is 40. What is the smaller number?", options:["12","16","20","24"], answer:1, explanation:"There are 5 parts. Each part is 8, so the smaller number is 2 × 8 = 16." },
  { id:"a7", topic:"Simple Interest", question:"Find simple interest on ₹1,000 at 5% per year for 2 years.", options:["₹50","₹100","₹150","₹200"], answer:1, explanation:"SI = P × R × T / 100 = 1000 × 5 × 2 / 100 = ₹100." },
  { id:"a8", topic:"Percentages", question:"A price of ₹500 increases by 10%. What is the new price?", options:["₹510","₹525","₹550","₹600"], answer:2, explanation:"10% of ₹500 is ₹50. New price = ₹550." }
];

const reasoningQuestions = [
  { id:"r1", topic:"Number Series", question:"Find the next number: 2, 6, 12, 20, 30, ?", options:["36","40","42","44"], answer:2, explanation:"Differences are 4, 6, 8, 10; next difference is 12. Answer = 42." },
  { id:"r2", topic:"Odd One Out", question:"Which shape does not belong?", options:["Square","Triangle","Circle","Rectangle"], answer:2, explanation:"A circle has no straight sides or vertices; the others are polygons." },
  { id:"r3", topic:"Directions", question:"Face north, turn right, then right again. Which direction are you facing?", options:["North","South","East","West"], answer:1, explanation:"North → East → South." },
  { id:"r4", topic:"Analogy", question:"Book is to reading as fork is to:", options:["Writing","Drawing","Eating","Cutting"], answer:2, explanation:"A book is used for reading; a fork is commonly used for eating." },
  { id:"r5", topic:"Number Pattern", question:"Find the next number: 3, 9, 27, 81, ?", options:["162","189","243","324"], answer:2, explanation:"Each number is multiplied by 3. 81 × 3 = 243." },
  { id:"r6", topic:"Alphabet Series", question:"What comes next: A, C, E, G, ?", options:["H","I","J","K"], answer:1, explanation:"The series skips one letter each time: A, C, E, G, I." },
  { id:"r7", topic:"Logic", question:"All roses are flowers. Which statement must be true?", options:["All flowers are roses","All roses are flowers","No roses are flowers","All plants are roses"], answer:1, explanation:"This repeats the given statement; the reverse is not necessarily true." }
];

const mockQuestions = [
  { question:"Tell me about yourself.", hint:"Introduce your degree, branch, technical skills, projects and career goal." },
  { question:"Explain a technical project you built.", hint:"Describe the problem, your contribution, technologies and outcome." },
  { question:"What technical challenge did you solve?", hint:"Explain the issue, your approach, alternatives and result." },
  { question:"Why do you want this role?", hint:"Connect the role's requirements to your real skills and interests." },
  { question:"What would you like to improve about yourself?", hint:"Choose a genuine improvement and explain the steps you are taking." }
];

const initialProgress = { learned:[], bookmarks:[], quizHistory:[], mockHistory:[], mockDrafts:{} };
function loadProgress() {
  try {
    const data = JSON.parse(localStorage.getItem("nbkrist_interview_progress"));
    return data && typeof data === "object" ? { ...initialProgress, ...data } : initialProgress;
  } catch { return initialProgress; }
}

export default function InterviewAI() {
  const [section, setSection] = useState("Companies");
  const [company, setCompany] = useState("All");
  const [role, setRole] = useState("All");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState(loadProgress);
  const [revealed, setRevealed] = useState([]);
  const [quizType, setQuizType] = useState("Aptitude");
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [mockIndex, setMockIndex] = useState(0);
  const [mockRating, setMockRating] = useState({});
  const [mockFinished, setMockFinished] = useState(false);

  useEffect(() => localStorage.setItem("nbkrist_interview_progress", JSON.stringify(progress)), [progress]);

  const companies = [...new Set(companyQuestions.map(q => q.company))];
  const roles = [...new Set(companyQuestions.filter(q => company === "All" || q.company === company).map(q => q.role))];
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return companyQuestions.filter(q =>
      (company === "All" || q.company === company) &&
      (role === "All" || q.role === role) &&
      (category === "All" || q.category === category) &&
      `${q.company} ${q.role} ${q.question} ${q.answer}`.toLowerCase().includes(term)
    );
  }, [company, role, category, search]);

  const quizQuestions = quizType === "Aptitude" ? aptitudeQuestions : reasoningQuestions;
  const currentQuiz = quizQuestions[quizIndex];
  const toggle = (field, id) => setProgress(old => ({
    ...old, [field]: old[field].includes(id) ? old[field].filter(x => x !== id) : [...old[field], id]
  }));
  const resetQuiz = (type = quizType) => { setQuizType(type); setQuizIndex(0); setAnswers({}); setQuizFinished(false); };
  const score = quizQuestions.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0);
  const finishQuiz = () => {
    setProgress(old => ({ ...old, quizHistory:[...old.quizHistory, { type:quizType, score, total:quizQuestions.length, date:new Date().toISOString() }] }));
    setQuizFinished(true);
  };
  const saveMock = value => setProgress(old => ({ ...old, mockDrafts:{ ...old.mockDrafts, [mockIndex]:value } }));
  const finishMock = () => {
    const ratingTotal = Object.values(mockRating).reduce((sum, n) => sum + Number(n), 0);
    setProgress(old => ({ ...old, mockHistory:[...old.mockHistory, {
      date:new Date().toISOString(),
      answered:mockQuestions.filter((_, i) => (old.mockDrafts[i] || "").trim()).length,
      ratingTotal, maxRating:mockQuestions.length * 5
    }] }));
    setMockFinished(true);
  };

  const sections = [
    { name:"Companies", icon:Building2 }, { name:"Aptitude", icon:Brain },
    { name:"Reasoning", icon:Target }, { name:"Mock Interview", icon:MessagesSquare },
    { name:"Bookmarks", icon:Bookmark }, { name:"My Progress", icon:Trophy }
  ];

  return <div className="prep-page">
    <section className="prep-hero">
      <div><span className="prep-eyebrow">NBKRIST CAREER READINESS</span>
        <h2>Interview AI</h2>
        <p>Practise company questions, aptitude, reasoning and mock interviews in one place.</p>
        <div className="prep-hero-stats"><span><BookOpen size={15}/>{companyQuestions.length} interview questions</span><span><Brain size={15}/>{aptitudeQuestions.length + reasoningQuestions.length} practice problems</span></div>
      </div><div className="prep-hero-icon"><GraduationCap size={65}/></div>
    </section>

    <section className="prep-summary">
      <div className="prep-mini-stat"><span>Learned questions</span><strong>{progress.learned.length}</strong></div>
      <div className="prep-mini-stat"><span>Bookmarked</span><strong>{progress.bookmarks.length}</strong></div>
      <div className="prep-mini-stat"><span>Quizzes completed</span><strong>{progress.quizHistory.length}</strong></div>
      <div className="prep-mini-stat"><span>Mock sessions</span><strong>{progress.mockHistory.length}</strong></div>
    </section>

    <nav className="prep-tabs" aria-label="Interview AI sections">
      {sections.map(({ name, icon:Icon }) => <button key={name} className={`prep-tab ${section === name ? "active" : ""}`} onClick={() => {
        setSection(name);
        if (name === "Aptitude" || name === "Reasoning") resetQuiz(name);
      }}><Icon size={17}/>{name}</button>)}
    </nav>

    {section === "Companies" && <section className="prep-content">
      <div className="prep-section-title"><div><h3>Company interview questions</h3><p>Representative practice questions; actual interviews may differ.</p></div></div>
      <div className="prep-filters">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search company, role or question..." aria-label="Search questions"/>
        <select value={company} onChange={e => { setCompany(e.target.value); setRole("All"); }}><option>All</option>{companies.map(c => <option key={c}>{c}</option>)}</select>
        <select value={role} onChange={e => setRole(e.target.value)}><option>All</option>{roles.map(r => <option key={r}>{r}</option>)}</select>
        <select value={category} onChange={e => setCategory(e.target.value)}><option>All</option><option>Technical</option><option>HR</option></select>
      </div>
      <p className="prep-result-count">{filtered.length} questions found</p>
      <div className="question-list">{filtered.map(q => {
        const open = revealed.includes(q.id), learned = progress.learned.includes(q.id), saved = progress.bookmarks.includes(q.id);
        return <article className="prep-question-card" key={q.id}>
          <div className="prep-question-meta"><span className="company-tag">{q.company}</span><span className="topic-tag">{q.role}</span><span className="topic-tag">{q.category}</span></div>
          <h4>{q.question}</h4>
          {open && <div className="sample-answer"><strong><Lightbulb size={16}/>Sample answer</strong><p>{q.answer}</p><div className="answer-tip"><b>Interview tip:</b> {q.tip}</div></div>}
          <div className="question-actions">
            <button className="prep-action primary" onClick={() => setRevealed(old => open ? old.filter(id => id !== q.id) : [...old, q.id])}>{open ? "Hide answer" : "View answer"}</button>
            <button className={`prep-action ${saved ? "selected" : ""}`} onClick={() => toggle("bookmarks", q.id)}><Bookmark size={15}/>{saved ? "Bookmarked" : "Bookmark"}</button>
            <button className={`prep-action ${learned ? "selected" : ""}`} onClick={() => toggle("learned", q.id)}><CheckCircle2 size={15}/>{learned ? "Learned" : "Mark learned"}</button>
          </div>
        </article>;
      })}{!filtered.length && <div className="prep-empty">No questions found. Change your filters or search term.</div>}</div>
    </section>}

    {(section === "Aptitude" || section === "Reasoning") && <section className="prep-content">
      <div className="prep-section-title"><div><h3>{section} practice test</h3><p>Select an answer to see feedback and explanation.</p></div><span className="prep-counter">{quizFinished ? "Completed" : `Question ${quizIndex + 1} of ${quizQuestions.length}`}</span></div>
      <div className="quiz-switch"><button className={section === "Aptitude" ? "active" : ""} onClick={() => { setSection("Aptitude"); resetQuiz("Aptitude"); }}><Brain size={16}/>Aptitude</button><button className={section === "Reasoning" ? "active" : ""} onClick={() => { setSection("Reasoning"); resetQuiz("Reasoning"); }}><Target size={16}/>Reasoning</button></div>
      {!quizFinished ? <article className="prep-question-card quiz-card">
        <div className="quiz-topline"><span className="company-tag">{currentQuiz.topic}</span><span className="topic-tag">{quizIndex + 1} / {quizQuestions.length}</span></div>
        <div className="quiz-progress"><span style={{ width:`${(quizIndex + 1) / quizQuestions.length * 100}%` }}/></div>
        <h4>{currentQuiz.question}</h4>
        <div className="quiz-options">{currentQuiz.options.map((option, i) => {
          const chosen = answers[quizIndex] === i, show = answers[quizIndex] !== undefined, correct = i === currentQuiz.answer;
          return <button key={option} disabled={show} className={`quiz-option ${chosen ? "chosen" : ""} ${show && correct ? "correct" : ""} ${show && chosen && !correct ? "incorrect" : ""}`} onClick={() => setAnswers(old => ({ ...old, [quizIndex]:i }))}>
            <span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{option}</span>{show && correct && <CheckCircle2 size={17}/>}
          </button>;
        })}</div>
        {answers[quizIndex] !== undefined && <div className="quiz-explanation"><strong>{answers[quizIndex] === currentQuiz.answer ? "Correct answer!" : "Review the solution"}</strong><p>{currentQuiz.explanation}</p></div>}
        <div className="quiz-navigation"><button className="prep-action" disabled={quizIndex === 0} onClick={() => setQuizIndex(i => i - 1)}><ArrowLeft size={16}/>Previous</button>
          {quizIndex < quizQuestions.length - 1 ? <button className="prep-action primary" disabled={answers[quizIndex] === undefined} onClick={() => setQuizIndex(i => i + 1)}>Next question<ArrowRight size={16}/></button> : <button className="prep-action primary" disabled={answers[quizIndex] === undefined} onClick={finishQuiz}>Finish test<CheckCircle2 size={16}/></button>}
        </div>
      </article> : <div className="prep-question-card quiz-result"><div className="result-icon"><Trophy size={32}/></div><h3>Practice complete!</h3><strong className="result-score">{score}/{quizQuestions.length}</strong><p>You scored {Math.round(score / quizQuestions.length * 100)}% on this practice test.</p><div className="form-actions"><button className="prep-action" onClick={() => setSection("My Progress")}>View progress</button><button className="prep-action primary" onClick={() => resetQuiz()}>Try again<RotateCcw size={16}/></button></div></div>}
    </section>}

    {section === "Mock Interview" && <section className="prep-content">
      <div className="prep-section-title"><div><h3>Mock interview room</h3><p>Write your answers as if you were speaking to an interviewer.</p></div><span className="prep-counter">{mockFinished ? "Completed" : `${mockIndex + 1} / ${mockQuestions.length}`}</span></div>
      {!mockFinished ? <article className="prep-question-card mock-card">
        <div className="mock-heading"><div className="mock-icon"><MessagesSquare size={25}/></div><div><span className="prep-eyebrow dark">QUESTION {mockIndex + 1}</span><h3>{mockQuestions[mockIndex].question}</h3></div></div>
        <div className="mock-hint"><Lightbulb size={17}/><p>{mockQuestions[mockIndex].hint}</p></div>
        <label className="mock-label">Your answer<textarea rows="6" value={progress.mockDrafts[mockIndex] || ""} onChange={e => setProgress(old => ({ ...old, mockDrafts:{ ...old.mockDrafts, [mockIndex]:e.target.value } }))} placeholder="Write your answer here..."/></label>
        <div className="self-rating"><strong>How well did you answer?</strong><p>Rate yourself from 1 (needs work) to 5 (excellent).</p><div className="rating-buttons">{[1,2,3,4,5].map(n => <button key={n} className={mockRating[mockIndex] === n ? "active" : ""} onClick={() => setMockRating(old => ({ ...old, [mockIndex]:n }))}>{n}</button>)}</div></div>
        <div className="quiz-navigation"><button className="prep-action" disabled={mockIndex === 0} onClick={() => setMockIndex(i => i - 1)}><ArrowLeft size={16}/>Previous</button>{mockIndex < mockQuestions.length - 1 ? <button className="prep-action primary" onClick={() => setMockIndex(i => i + 1)}>Next question<ArrowRight size={16}/></button> : <button className="prep-action primary" onClick={finishMock}>Finish mock interview<CheckCircle2 size={16}/></button>}</div>
        <p className="privacy-note">Answers and ratings are saved locally in this browser.</p>
      </article> : <div className="prep-question-card quiz-result"><div className="result-icon"><Trophy size={32}/></div><h3>Mock interview completed!</h3><p>You answered {mockQuestions.filter((_, i) => (progress.mockDrafts[i] || "").trim()).length} of {mockQuestions.length} questions.</p><p>Self-rating total: {Object.values(mockRating).reduce((sum,n) => sum+n,0)} / {mockQuestions.length * 5}</p><button className="prep-action primary" onClick={() => { setMockIndex(0); setMockFinished(false); }}>Review answers<RotateCcw size={16}/></button></div>}
    </section>}

    {section === "Bookmarks" && <section className="prep-content"><div className="prep-section-title"><div><h3>Your saved questions</h3><p>Questions bookmarked for revision.</p></div></div><div className="question-list">
      {companyQuestions.filter(q => progress.bookmarks.includes(q.id)).map(q => <article className="prep-question-card" key={q.id}><div className="prep-question-meta"><span className="company-tag">{q.company}</span><span className="topic-tag">{q.role}</span></div><h4>{q.question}</h4><p className="bookmark-answer">{q.answer}</p><button className="prep-action" onClick={() => toggle("bookmarks", q.id)}><Bookmark size={15}/>Remove bookmark</button></article>)}
      {!progress.bookmarks.length && <div className="prep-empty">No bookmarks yet. Save questions from Companies.</div>}
    </div></section>}

    {section === "My Progress" && <section className="prep-content">
      <div className="prep-section-title"><div><h3>Your preparation report</h3><p>Progress and results saved in this browser.</p></div></div>
      <div className="prep-summary progress-summary"><div className="prep-mini-stat"><span>Learned</span><strong>{progress.learned.length}</strong></div><div className="prep-mini-stat"><span>Bookmarks</span><strong>{progress.bookmarks.length}</strong></div><div className="prep-mini-stat"><span>Average quiz score</span><strong>{progress.quizHistory.length ? Math.round(progress.quizHistory.reduce((s,h) => s+h.score/h.total,0)/progress.quizHistory.length*100)+"%" : "—"}</strong></div><div className="prep-mini-stat"><span>Mock sessions</span><strong>{progress.mockHistory.length}</strong></div></div>
      <div className="prep-question-card history-card"><h4><Trophy size={18}/>Quiz history</h4>{!progress.quizHistory.length ? <p className="history-empty">Complete a quiz to see results here.</p> : [...progress.quizHistory].reverse().map((h,i) => <div className="history-row" key={`${h.date}-${i}`}><div><strong>{h.type} practice</strong><span>{new Date(h.date).toLocaleString()}</span></div><strong>{h.score}/{h.total}</strong></div>)}</div>
      <div className="prep-question-card history-card"><h4><MessagesSquare size={18}/>Mock interview history</h4>{!progress.mockHistory.length ? <p className="history-empty">Complete a mock interview to see results here.</p> : [...progress.mockHistory].reverse().map((h,i) => <div className="history-row" key={`${h.date}-${i}`}><div><strong>{h.answered} answers written</strong><span>{new Date(h.date).toLocaleString()}</span></div><strong>{h.ratingTotal}/{h.maxRating}</strong></div>)}</div>
      <button className="prep-action danger" onClick={() => { if (window.confirm("Clear all Interview AI progress, bookmarks, quiz history and mock interview answers?")) { setProgress(initialProgress); setRevealed([]); resetQuiz("Aptitude"); setMockIndex(0); setMockRating({}); setMockFinished(false); } }}><RotateCcw size={16}/>Reset interview progress</button>
    </section>}
  </div>;
}
