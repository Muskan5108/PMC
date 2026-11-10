
import { useEffect, useState } from "react";
import "./App.css";

const sections = [
  {
    icon: "📚",
    title: "Spiritual Library",
    desc: "Explore Vaani, Teeka, Beetak Saheb and Charchani.",
  },
  {
    icon: "🪷",
    title: "Aaj Ki Chaupai",
    desc: "Read the daily Chaupai with its meaning and reference.",
  },
  {
    icon: "🌌",
    title: "Paramdham Darshan",
    desc: "Explore the divine beauty of Paramdham.",
  },
  {
    icon: "🎶",
    title: "Dhyan & Simran",
    desc: "A peaceful space for meditation, bhajans and kirtan.",
  },
  {
    icon: "🗓️",
    title: "Events & Satsang",
    desc: "Discover upcoming satsang, shivir and community events.",
  },
  {
    icon: "🌼",
    title: "Kids Learning Zone",
    desc: "Interactive spiritual learning for children.",
  },
];

const adminSections = [
  {
    icon: "👥",
    title: "Manage Users",
    desc: "View and manage community accounts.",
  },
  {
    icon: "📚",
    title: "Manage Content",
    desc: "Organize spiritual learning resources.",
  },
  {
    icon: "🗓️",
    title: "Manage Events",
    desc: "Manage programs and event announcements.",
  },
  {
    icon: "🌼",
    title: "Seva Requests",
    desc: "Review community seva requirements.",
  },
];

const pdfFiles = [
  "01_रास_टिका_सरकारश्री_1-2.pdf",
  "02_प्रकास_गुज_टिका_सरकार_श्री.pdf",
  "03_खतऋतु_टिका_सरकार_श्री.pdf",
  "04_कलश_गुजराती_टिका_सरकार_श्री.pdf",
  "05_प्रकाश_हिन्दु_सरकारश्री_टीका-3.pdf",
  "06_कलस_हिंदी_तौरेत_सरकारश्री_.pdf",
  "07.सनन्ध.टिका सरकारश्री.pdf",
  "08_किरंतन_सरकारश्री_टीका-2.pdf",
  "09_खुलासा_सरकारश्री_टीका.pdf",
  "10_खिलवत_सरकारश्री_टीका.pdf",
  "11_परिक्रमा_सरकार_श्री_टीका.pdf",
  "12. सागर. सरकारश्री टीका.pdf",
  "13_सिनगार_सरकारश्री_टीका.pdf",
  "14_सिन्धी_सरकारश्री_टीका.pdf",
  "15_मारफत_सागर_सरकारश्री_टीका.pdf",
  "16_छोटा_कयामत_सरकारश्री_.pdf",
  "श्री_बितक_साहेबसरकारश्री_टीका.pdf",
];

function getPdfTitle(filename) {
  return filename
    .replace(/\.pdf$/i, "")
    .replace(/^\d+[_.\s]*/, "")
    .replace(/_/g, " ")
    .replace(/\./g, " ")
    .trim();
}

function App() {
  const [page, setPage] = useState("home");
  const [role, setRole] = useState("user");
  const [showMenu, setShowMenu] = useState(false);
  const [language, setLanguage] = useState("English");
  const [activeSection, setActiveSection] = useState("");

  // Authentication states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manage Users states
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  // PDF Viewer states
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");

  const isDashboard =
    page === "userDashboard" || page === "adminDashboard";

  const isSectionPage = page === "section";

  // Open login
  const openLogin = (selectedRole = "user") => {
    setRole(selectedRole);
    setPage("login");
    setShowMenu(false);
    setAuthMessage("");
    setPassword("");
  };

  // Open registration
  const openRegister = () => {
    setPage("register");
    setRole("user");
    setShowMenu(false);
    setAuthMessage("");
    setPassword("");
  };

  // Go to home
  const goHome = () => {
    setPage("home");
    setShowMenu(false);
    setAuthMessage("");
    setActiveSection("");
    closePdf();
  };

  // Open dashboard section
  const openSection = (title) => {
    setActiveSection(title);
    setPage("section");
    setShowMenu(false);
  };

  // Back to dashboard
  const backToDashboard = () => {
    closePdf();
    setActiveSection("");

    setPage(
      role === "admin" ? "adminDashboard" : "userDashboard"
    );
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("pmcToken");

    closePdf();

    setPage("home");
    setRole("user");
    setName("");
    setEmail("");
    setPassword("");
    setAuthMessage("");
    setShowMenu(false);
    setActiveSection("");
    setUsers([]);
    setUsersError("");
  };

  // Registration and Login
  async function handleAuthSubmit(e) {
    e.preventDefault();
    setAuthMessage("");

    if (!email.trim() || !password) {
      setAuthMessage("Please enter your email and password.");
      return;
    }

    if (page === "register" && !name.trim()) {
      setAuthMessage("Please enter your name.");
      return;
    }

    setIsSubmitting(true);

    const isRegister = page === "register";

    const endpoint = isRegister
      ? "/api/auth/register"
      : "/api/auth/login";

    const payload = isRegister
      ? {
          name: name.trim(),
          email: email.trim(),
          password,
        }
      : {
          email: email.trim(),
          password,
          role: role.toUpperCase(),
        };

    try {
      const response = await fetch(
        `http://localhost:8080${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Request failed. Please check your details."
        );
      }

      if (isRegister) {
        setAuthMessage(
          data.message ||
            "Account created successfully. Please sign in."
        );

        setPage("login");
        setRole("user");
        setName("");
        setPassword("");
      } else {
        const loggedInRole = String(
          data.role || ""
        ).toUpperCase();

        if (
          loggedInRole !== "USER" &&
          loggedInRole !== "ADMIN"
        ) {
          throw new Error(
            "The server returned an invalid user role."
          );
        }

        if (!data.token) {
          throw new Error(
            "Login token was not received from the server."
          );
        }

        sessionStorage.setItem("pmcToken", data.token);

        setName(data.name || "");
        setEmail(data.email || email.trim());
        setPassword("");
        setRole(loggedInRole.toLowerCase());
        setAuthMessage("");

        setPage(
          loggedInRole === "ADMIN"
            ? "adminDashboard"
            : "userDashboard"
        );
      }
    } catch (error) {
      setAuthMessage(
        error.message === "Failed to fetch"
          ? "Cannot connect to PMC server. Make sure the backend is running."
          : error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Fetch registered users for Admin
  useEffect(() => {
    if (
      page !== "section" ||
      activeSection !== "Manage Users" ||
      role !== "admin"
    ) {
      return;
    }

    let isActive = true;

    async function fetchUsers() {
      setUsersLoading(true);
      setUsersError("");

      try {
        const token = sessionStorage.getItem("pmcToken");

        if (!token) {
          throw new Error("Login session not found. Please sign in again.");
        }

        const response = await fetch(
          "http://localhost:8080/api/admin/users",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json().catch(() => []);

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Session expired. Please sign in again.");
          }

          if (response.status === 403) {
            throw new Error("Admin access denied.");
          }

          throw new Error(
            data.message || `Unable to load users (${response.status}).`
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("Invalid users data received from server.");
        }

        if (isActive) {
          setUsers(data);
        }
      } catch (error) {
        if (isActive) {
          setUsersError(error.message || "Unable to load users.");
        }
      } finally {
        if (isActive) {
          setUsersLoading(false);
        }
      }
    }

    fetchUsers();

    return () => {
      isActive = false;
    };
  }, [page, activeSection, role]);

  // Open PDF inside the application
  const openPdf = async (file) => {
    setPdfLoading(true);
    setPdfError("");
    setPdfTitle(getPdfTitle(file));

    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl("");
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/pdfs/${encodeURIComponent(file)}`
      );

      if (!response.ok) {
        throw new Error(
          `Unable to load PDF (${response.status}).`
        );
      }

      const blob = await response.blob();

      if (
        blob.type &&
        !blob.type.includes("pdf") &&
        blob.type !== "application/octet-stream"
      ) {
        throw new Error("The server did not return a valid PDF.");
      }

      const objectUrl = URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );

      setPdfUrl(objectUrl);
    } catch (error) {
      setPdfError(
        error.message === "Failed to fetch"
          ? "Cannot connect to the PMC server."
          : error.message || "Unable to open PDF."
      );
    } finally {
      setPdfLoading(false);
    }
  };

  // Close PDF viewer
  function closePdf() {
    setPdfUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
      return "";
    });

    setPdfTitle("");
    setPdfError("");
    setPdfLoading(false);
  }

  return (
    <div className="app-shell">
      <div className="cosmic-glow glow-one" />
      <div className="cosmic-glow glow-two" />

      {/* NAVBAR */}
      <header className="navbar">
        <button
          className="brand"
          onClick={
            isDashboard || isSectionPage
              ? backToDashboard
              : goHome
          }
          aria-label="PMC Home"
        >
          <img
            src="/pmc-logo.png"
            alt="Paramdham Meditation Centre logo"
            className="brand-logo"
          />

          <span className="brand-copy">
            <strong>PARAMDHAM MEDITATION CENTRE</strong>
          </span>
        </button>

        <nav className="desktop-nav">
          <button onClick={goHome}>Home</button>

          <a
            href="#explore"
            onClick={() => {
              if (page !== "home") goHome();
            }}
          >
            Explore
          </a>

          <a
            href="#daily"
            onClick={() => {
              if (page !== "home") goHome();
            }}
          >
            Daily Chaupai
          </a>

          <a
            href="#events"
            onClick={() => {
              if (page !== "home") goHome();
            }}
          >
            Events
          </a>
        </nav>

        <div className="nav-actions">
          <select
            aria-label="Choose language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
          >
            <option>English</option>
            <option>हिन्दी</option>
            <option>ગુજરાતી</option>
          </select>

          {isDashboard || isSectionPage ? (
            <button
              className="signin-button"
              onClick={handleLogout}
            >
              Sign Out ↗
            </button>
          ) : (
            <div className="signin-wrap">
              <button
                className="signin-button"
                onClick={() => setShowMenu(!showMenu)}
                aria-expanded={showMenu}
              >
                Sign In <span>↗</span>
              </button>

              {showMenu && (
                <div className="signin-menu">
                  <p>Welcome to PMC</p>

                  <button onClick={() => openLogin("user")}>
                    <span>👤</span>
                    <span>
                      <strong>User Sign In</strong>
                      <small>
                        Access your spiritual space
                      </small>
                    </span>
                  </button>

                  <button onClick={() => openLogin("admin")}>
                    <span>🔐</span>
                    <span>
                      <strong>Admin Sign In</strong>
                      <small>
                        Manage platform content
                      </small>
                    </span>
                  </button>

                  <div className="menu-register">
                    New to PMC?{" "}
                    <button onClick={openRegister}>
                      Create account
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* HOME PAGE */}
      {page === "home" && (
        <main>
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                A SPACE FOR SPIRITUAL AWAKENING
              </div>

              <h1>
                Discover the
                <br />
                <span>Divine Within.</span>
              </h1>

              <p className="hero-description">
                A digital sanctuary for spiritual learning, dhyan,
                simran and the timeless wisdom of our Sampraday.
              </p>

              <div className="hero-actions">
                <button
                  className="primary-button"
                  onClick={() =>
                    document
                      .getElementById("explore")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Begin Your Journey <span>→</span>
                </button>

                <button
                  className="secondary-button"
                  onClick={() => openLogin("user")}
                >
                  Join Sundarsaath
                </button>
              </div>

              <div className="hero-note">
                <span className="note-star">✧</span>
                Learn. Reflect. Experience Nijaanand.
              </div>
            </div>

            <div
              className="hero-art"
              aria-label="Cosmic spiritual artwork"
            >
              <div className="orbit orbit-outer" />
              <div className="orbit orbit-inner" />
              <div className="planet planet-large" />
              <div className="planet planet-small" />

              <div className="star star-one">✦</div>
              <div className="star star-two">✧</div>
              <div className="star star-three">✦</div>

              <div className="art-center">
                <img
                  src="/pmc-logo.png"
                  alt="Paramdham Darshan"
                  className="hero-circular-logo"
                />
              </div>

              <div className="art-caption">
                <span className="caption-line" />
                <span>
                  Beyond the visible, discover the eternal.
                </span>
              </div>
            </div>

            <div className="hero-bottom-label">
              <span>01</span> &nbsp; WISDOM &nbsp;·&nbsp; DEVOTION
              &nbsp;·&nbsp; INNER PEACE
            </div>
          </section>

          <section className="welcome-strip">
            <span className="welcome-symbol">✧</span>
            <p>
              A place to learn, contemplate and grow through the
              wisdom of our spiritual tradition.
            </p>
            <span className="welcome-symbol">✧</span>
          </section>

          <section className="explore-section" id="explore">
            <div className="section-heading">
              <span className="section-kicker">
                YOUR SPIRITUAL SPACE
              </span>

              <h2>
                Explore the <span>Path Within</span>
              </h2>

              <p>
                Knowledge, devotion and community — thoughtfully
                brought together in one place.
              </p>
            </div>

            <div className="feature-grid">
              {sections.map((item) => (
                <article
                  className="feature-card"
                  key={item.title}
                  id={
                    item.title === "Events & Satsang"
                      ? "events"
                      : undefined
                  }
                >
                  <div className="feature-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>

                  <button
                    className="text-link"
                    onClick={() => openLogin("user")}
                  >
                    Explore <span>↗</span>
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="daily-banner" id="daily">
            <div className="daily-content">
              <span className="section-kicker">
                PARAMDHAM MEDITATION CENTRE
              </span>

              <h2>
                अपने असली स्वरूप को पहचानें।
                <br />
                <span>
                  निजानंद को जानें, आत्मा के सच्चे आनंद को पहचानें।
                </span>
              </h2>

              <p>
                Discover the path of Nijaanand through spiritual
                wisdom, Vaani Manthan, Dhyan and Simran.
              </p>
            </div>

            <button
              className="secondary-button"
              onClick={() => openLogin("user")}
            >
              Begin Your Spiritual Journey →
            </button>
          </section>

          <footer className="footer">
            <div className="footer-brand">
              <img src="/pmc-logo.png" alt="PMC logo" />
              <span>PARAMDHAM MEDITATION CENTRE</span>
            </div>

            <p>
              Created with reverence for spiritual learning and
              the Sundarsaath community.
            </p>

            <small>
              PMC Digital Platform · {new Date().getFullYear()}
            </small>
          </footer>
        </main>
      )}

      {/* LOGIN AND REGISTER */}
      {(page === "login" || page === "register") && (
        <main className="auth-page">
          <button className="back-button" onClick={goHome}>
            ← Back to Home
          </button>

          <section className="auth-card">
            <div className="auth-logo">
              <img src="/pmc-logo.png" alt="PMC logo" />
            </div>

            <span className="section-kicker">
              {page === "register"
                ? "JOIN OUR COMMUNITY"
                : role === "admin"
                  ? "AUTHORISED ACCESS"
                  : "WELCOME TO PMC"}
            </span>

            <h1>
              {page === "register"
                ? "Create your account"
                : role === "admin"
                  ? "Admin Sign In"
                  : "Welcome back"}
            </h1>

            <p className="auth-subtitle">
              {page === "register"
                ? "Join our spiritual learning community."
                : role === "admin"
                  ? "Sign in to manage the PMC platform."
                  : "Continue your journey of learning and reflection."}
            </p>

            {page === "login" && (
              <div className="role-switch">
                <button
                  type="button"
                  className={role === "user" ? "active" : ""}
                  onClick={() => {
                    setRole("user");
                    setAuthMessage("");
                  }}
                >
                  User
                </button>

                <button
                  type="button"
                  className={role === "admin" ? "active" : ""}
                  onClick={() => {
                    setRole("admin");
                    setAuthMessage("");
                  }}
                >
                  Admin
                </button>
              </div>
            )}

            <form onSubmit={handleAuthSubmit}>
              {page === "register" && (
                <label>
                  Full name
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </label>
              )}

              <label>
                Email address
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    page === "register"
                      ? "new-password"
                      : "current-password"
                  }
                  minLength={8}
                  required
                />
              </label>

              <button
                type="submit"
                className="primary-button auth-submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Please wait..."
                  : page === "register"
                    ? "Create Account →"
                    : "Sign In →"}
              </button>
            </form>

            {authMessage && (
              <p className="security-note" role="status">
                {authMessage}
              </p>
            )}

            {role === "admin" && page === "login" && (
              <p className="security-note">
                🔒 Admin access is restricted. Admin privileges
                must be assigned securely by the backend.
              </p>
            )}

            {role === "user" && (
              <p className="auth-toggle">
                {page === "register"
                  ? "Already have an account?"
                  : "New to PMC?"}{" "}

                <button
                  type="button"
                  onClick={() => {
                    setPage(
                      page === "register" ? "login" : "register"
                    );
                    setRole("user");
                    setAuthMessage("");
                    setPassword("");
                  }}
                >
                  {page === "register"
                    ? "Sign in"
                    : "Create an account"}
                </button>
              </p>
            )}
          </section>
        </main>
      )}

      {/* USER AND ADMIN DASHBOARD */}
      {isDashboard && (
        <main className="explore-section">
          <div className="section-heading">
            <span className="section-kicker">
              {page === "adminDashboard"
                ? "PMC ADMINISTRATION"
                : "YOUR SPIRITUAL SPACE"}
            </span>

            <h2>
              Welcome, <span>{name || "Sundarsaath"}!</span>
            </h2>

            <p>
              {page === "adminDashboard"
                ? "Manage PMC content and community activities."
                : "Continue your spiritual learning and seva journey."}
            </p>
          </div>

          <div className="feature-grid">
            {(page === "adminDashboard"
              ? adminSections
              : sections
            ).map((item) => (
              <article
                className="feature-card"
                key={item.title}
              >
                <div className="feature-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>

                <button
                  className="text-link"
                  onClick={() => openSection(item.title)}
                >
                  Open Section <span>↗</span>
                </button>
              </article>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <button
              className="primary-button"
              onClick={handleLogout}
            >
              Sign Out ↗
            </button>
          </div>
        </main>
      )}

      {/* SECTION PAGES */}
      {isSectionPage && (
        <main className="explore-section">
          <div className="section-heading">
            <span className="section-kicker">
              {role === "admin"
                ? "PMC ADMINISTRATION"
                : "YOUR SPIRITUAL SPACE"}
            </span>

            <h2>
              <span>{activeSection}</span>
            </h2>

            <p>
              {activeSection === "Spiritual Library"
                ? "Explore Vaani Teeka and spiritual learning resources."
                : `Explore ${activeSection} and its resources.`}
            </p>
          </div>

          {/* SPIRITUAL LIBRARY */}
          {activeSection === "Spiritual Library" ? (
            <div className="feature-grid">
              {pdfFiles.map((file, index) => (
                <article
                  className="feature-card"
                  key={file}
                >
                  <div className="feature-icon">📄</div>

                  <span className="section-kicker">
                    DOCUMENT {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3>{getPdfTitle(file)}</h3>

                  <p>
                    Read the PDF document from the PMC spiritual library.
                  </p>

                  <button
                    className="text-link"
                    type="button"
                    onClick={() => openPdf(file)}
                  >
                    Open PDF <span>↗</span>
                  </button>
                </article>
              ))}
            </div>

          ) : activeSection === "Manage Users" && role === "admin" ? (
            /* ADMIN MANAGE USERS */
            <div className="feature-grid">
              <article className="feature-card">
                <div className="feature-icon">👥</div>
                <span className="section-kicker">
                  COMMUNITY ACCOUNTS
                </span>
                <h3>Registered Users</h3>
                <p>
                  Total users: <strong>{users.length}</strong>
                </p>
              </article>

              {usersLoading && (
                <article className="feature-card">
                  <p>Loading registered users...</p>
                </article>
              )}

              {usersError && (
                <article className="feature-card">
                  <h3>Unable to load users</h3>
                  <p>{usersError}</p>

                  <button
                    className="text-link"
                    onClick={() => {
                      setActiveSection("");
                      setTimeout(() => {
                        setActiveSection("Manage Users");
                      }, 0);
                    }}
                  >
                    Try Again ↻
                  </button>
                </article>
              )}

              {!usersLoading &&
                !usersError &&
                users.length === 0 && (
                  <article className="feature-card">
                    <p>No registered users found.</p>
                  </article>
                )}

              {!usersLoading &&
                !usersError &&
                users.map((user, index) => (
                  <article
                    className="feature-card"
                    key={user.id ?? user.email ?? index}
                  >
                    <div className="feature-icon">👤</div>

                    <span className="section-kicker">
                      USER {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>{user.name || "Unnamed User"}</h3>

                    <p>{user.email}</p>

                    <p>
                      Role: <strong>{user.role}</strong>
                    </p>
                  </article>
                ))}
            </div>

          ) : (
            /* OTHER SECTION PLACEHOLDERS */
            <div className="feature-grid">
              <article className="feature-card">
                <div className="feature-icon">🪷</div>

                <h3>{activeSection}</h3>

                <p>
                  This section is ready for its content and features
                  to be added next.
                </p>
              </article>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <button
              className="secondary-button"
              onClick={backToDashboard}
            >
              ← Back to Dashboard
            </button>
          </div>
        </main>
      )}

      {/* PDF VIEWER */}
      {(pdfUrl || pdfLoading || pdfError) && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(3, 8, 25, 0.96)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              marginBottom: "15px",
              color: "white",
            }}
          >
            <h3>{pdfTitle || "PDF Viewer"}</h3>

            <button
              className="secondary-button"
              onClick={closePdf}
            >
              ✕ Close
            </button>
          </div>

          {pdfLoading && (
            <p style={{ color: "white", textAlign: "center" }}>
              Loading PDF...
            </p>
          )}

          {pdfError && (
            <p style={{ color: "#ff9999", textAlign: "center" }}>
              {pdfError}
            </p>
          )}

          {pdfUrl && (
            <iframe
              src={pdfUrl}
              title={pdfTitle}
              style={{
                width: "100%",
                flex: 1,
                border: "none",
                borderRadius: "10px",
                background: "white",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
