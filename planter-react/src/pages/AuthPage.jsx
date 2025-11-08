import React, { useState } from "react";
import {auth} from "/src/firebaseConfig";
import {signOut} from "firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import { LoginButton, RegisterButton } from "../components/ui/AuthButtons";  
import {Navigate} from "react-router-dom";
import {createUserWithEmailAndPassword,
    signInWithEmailAndPassword
    } from "firebase/auth";
import "/src/theme/pages/AuthPage.css"; 

const AuthPage = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [user] = useAuthState(auth);

    useEffect(() => {
        if (user) {
          navigate("/"); 
        }
      }, [user, navigate]);


    // Switch between login and regsitration forms based on the state of isRegistering
    const toggleForm = () => {
        setIsRegistering((prev) => !prev);
        setError(""); 
      };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>{isRegistering ? "Create an Account" : "Login"}</h2>
                {error && <p className="error-message">{error}</p>}

        
            <form className="auth-form">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />

            {isRegistering && ( 
            <>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />

              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />

              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </>
            )}

            {!isRegistering && ( // Only show password for login
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          )}        
                        
                    
            {isRegistering ? (
                    <RegisterButton email={email} name={name} password={password} confirmPassword ={confirmPassword} setError={setError} />
                    ) : (
                    <LoginButton email={email} password={password} setError={setError} />
                    )}
                </form>
                <p className="toggle-text">
                        {isRegistering ? "Already have an account?" : "Don’t have an account?"}{" "}
                        <span onClick={toggleForm} className="toggle-link">
                        {isRegistering ? "Login here" : "Register here"}
                        </span>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
