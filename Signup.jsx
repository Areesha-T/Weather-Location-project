import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Firebase Auth mein Name update karne ke liye
        updateProfile(userCredential.user, {
          displayName: name,
        });
        alert("Account Created Successfully!");
        setName("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="signup-card">
      <h2>Sign Up</h2>

      <form onSubmit={handleSignup}>
        <input 
          type="text" 
          className="signup-input"
          placeholder="Enter Full Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required
        />

        <input 
          type="email" 
          className="signup-input"
          placeholder="Enter Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
        />

        <input 
          type="password" 
          className="signup-input"
          placeholder="Enter Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
        />

        <button type="submit" className="signup-btn">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;