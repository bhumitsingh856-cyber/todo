import React, { useState } from "react";
import axios from "../api/axios";

const Landing = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        const res = await axios.post("/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        setUser(res.data.user);
      } else {
        const res = await axios.post("/api/auth/register", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        setUser(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page-wrapper">
      <div className="landing-container">
        {/* Navigation */}
        <header className="landing-nav">
          <div className="landing-brand">
            <span className="brand-icon">✅</span> TodoMaster
          </div>
          <div className="landing-nav-badge">v1.2.0-stable</div>
        </header>

        {/* Hero Section */}
        <main className="landing-hero">
          {/* Left Column: Value Proposition & Product Showcases */}
          <div className="hero-content">
            <h1 className="hero-title">
              Organize your work, <br />
              <span className="gradient-text">Simplify your life.</span>
            </h1>
            <p className="hero-subtitle">
              TodoMaster is a beautifully designed, high-performance task management app built to help you track your goals, edit on the fly, and achieve clarity.
            </p>

            <div className="hero-features">
              <div className="feature-item">
                <div className="feature-icon edit-icon">✏️</div>
                <div className="feature-text">
                  <h3>Seamless Inline Editing</h3>
                  <p>Modify tasks directly in the list with a clean click-and-save experience. No complex modal flows.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon stats-icon">📊</div>
                <div className="feature-text">
                  <h3>Insightful Task Stats</h3>
                  <p>Real-time completion tracking with visually clean status badges showing what's pending and done.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon speed-icon">⚡</div>
                <div className="feature-text">
                  <h3>Vibrant Glassmorphic UI</h3>
                  <p>Experience a fast, responsive interface with beautiful glow highlights, smooth transitions, and premium dark theme.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Login/Register Form */}
          <div className="hero-auth">
            <div className="form-container">
              {/* Tab Switcher */}
              <div className="auth-tabs">
                <button
                  type="button"
                  className={`tab-btn ${isLogin ? "active" : ""}`}
                  onClick={() => {
                    setIsLogin(true);
                    setError("");
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`tab-btn ${!isLogin ? "active" : ""}`}
                  onClick={() => {
                    setIsLogin(false);
                    setError("");
                  }}
                >
                  Create Account
                </button>
              </div>

              <p className="tab-description">
                {isLogin
                  ? "Access your dashboard and resume your focus."
                  : "Sign up in seconds and build your first todo list."}
              </p>

              {error && <div className="error-msg">{error}</div>}

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      id="username"
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="e.g. johndoe"
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                  style={{ marginTop: "1rem" }}
                >
                  {loading ? (
                    <span className="spinner-loader">Please wait...</span>
                  ) : isLogin ? (
                    "Sign In to Dashboard"
                  ) : (
                    "Register & Start"
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Landing;
