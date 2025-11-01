"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [openaiKey, setOpenaiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");

    if (!openaiKey.trim()) {
      setError("Please enter your OpenAI API key");
      return;
    }

    if (!openaiKey.startsWith("sk-")) {
      setError("Invalid API key format. It should start with 'sk-'");
      return;
    }

    // Save OpenAI key to localStorage
    localStorage.setItem("openai_key", openaiKey);
    setIsLoading(true);

    try {
      console.log("Fetching Google OAuth URL...");

      // Get Google OAuth URL
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("OAuth URL received:", data.url);

      // Redirect to Google OAuth
      window.location.href = data.url;
    } catch (error) {
      console.error("Error initiating login:", error);
      setError(`Failed to initiate login: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <>
      <h1 style={styles.title}>📧 Gmail Email Classifier</h1>
      <p style={styles.description}>
        Classify your Gmail emails using AI-powered categorization
      </p>

      <div style={styles.form}>
        <label style={styles.label}>
          OpenAI API Key
          <input
            type="password"
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="sk-proj-..."
            style={{
              ...styles.input,
              ...(error ? styles.inputError : {}),
            }}
            disabled={isLoading}
          />
        </label>

        {error && <div style={styles.error}>{error}</div>}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          style={{
            ...styles.button,
            ...(isLoading ? styles.buttonDisabled : {}),
          }}
        >
          {isLoading ? (
            <span style={styles.buttonContent}>
              <span style={styles.spinner}></span>
              Redirecting...
            </span>
          ) : (
            <span style={styles.buttonContent}>
              <svg style={styles.googleIcon} viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </span>
          )}
        </button>
      </div>

      <div style={styles.infoBox}>
        <p style={styles.note}>
          🔒 Your OpenAI API key is stored locally and never sent to our
          servers.
        </p>
        <p style={styles.note}>
          📨 You'll be asked to grant access to your Gmail account in the next
          step.
        </p>
      </div>

      <div style={styles.helpSection}>
        <details style={styles.details}>
          <summary style={styles.summary}>
            Need help getting an API key?
          </summary>
          <ol style={styles.helpList}>
            <li>
              Visit{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                platform.openai.com/api-keys
              </a>
            </li>
            <li>Sign up or log in to your account</li>
            <li>Click "Create new secret key"</li>
            <li>Copy the key (starts with "sk-")</li>
            <li>Paste it above</li>
          </ol>
        </details>
      </div>
    </>
  );
}

const styles = {
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
    textAlign: "center",
  },
  description: {
    color: "#666",
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
  },
  input: {
    padding: "12px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "monospace",
  },
  inputError: {
    borderColor: "#f44336",
  },
  error: {
    padding: "10px",
    background: "#ffebee",
    color: "#c62828",
    borderRadius: "6px",
    fontSize: "13px",
    border: "1px solid #ef9a9a",
  },
  button: {
    padding: "14px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
  },
  buttonDisabled: {
    background: "#ccc",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  buttonContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  googleIcon: {
    width: "20px",
    height: "20px",
  },
  spinner: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    border: "3px solid rgba(255,255,255,0.3)",
    borderTop: "3px solid white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  infoBox: {
    background: "#f5f5f5",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "10px",
  },
  note: {
    fontSize: "12px",
    color: "#666",
    margin: "5px 0",
    lineHeight: "1.5",
  },
  helpSection: {
    marginTop: "15px",
  },
  details: {
    background: "#f9f9f9",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #e0e0e0",
  },
  summary: {
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    color: "#667eea",
    userSelect: "none",
  },
  helpList: {
    marginTop: "10px",
    paddingLeft: "20px",
    fontSize: "13px",
    color: "#666",
    lineHeight: "1.8",
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "500",
  },
};
