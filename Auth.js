import React, { useState } from "react";
import { auth } from "../firebase"; // Apni firebase file  path check 
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile 
} from "firebase/auth";
import "../App.css";

function Auth() {
  const [isLoginView, setIsLoginView] = useState(true);

  // Form Fields States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Toggle between Login and Sign Up views
  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError("");
  };

  // Submit Handler for Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLoginView) {
        // Firebase Login
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Firebase Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Save Name to Firebase Profile
        if (fullName && userCredential.user) {
          await updateProfile(userCredential.user, { displayName: fullName });
        }
      }
    } catch (err) {
      let msg = err.message.replace("Firebase: ", "");
      if (msg.includes("auth/invalid-credential") || msg.includes("auth/user-not-found")) {
        msg = "Invalid email or password.";
      } else if (msg.includes("auth/email-already-in-use")) {
        msg = "Email is already registered.";
      } else if (msg.includes("auth/weak-password")) {
        msg = "Password should be at least 6 characters.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-root">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">
            {isLoginView ? "Welcome Back" : "Create Account"}
          </h1>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Full Name Field (Only in Sign Up) */}
            {!isLoginView && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="areeshatasawar760@gmail.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
              />
            </div>

            {/* Gender and DOB Fields (Only in Sign Up) */}
            {!isLoginView && (
              <>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Processing..." : isLoginView ? "Login" : "Sign Up"}
            </button>
          </form>

          {/* Toggle Option Link */}
          <div className="auth-options">
            {isLoginView ? (
              <span>
                Need an account?{" "}
                <button type="button" className="auth-option-link" onClick={toggleView}>
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button type="button" className="auth-option-link" onClick={toggleView}>
                  Login
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;