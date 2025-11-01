"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EmailList from "@/components/EmailList";

// Separate component that uses useSearchParams
function DashboardContent() {
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClassifying, setIsClassifying] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [emailCount, setEmailCount] = useState(15);
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryColors = {
    Important: "#f44336",
    Promotional: "#ff9800",
    Social: "#2196f3",
    Marketing: "#9c27b0",
    Spam: "#795548",
    General: "#607d8b",
  };

  useEffect(() => {
    const initAuth = async () => {
      const tokensParam = searchParams.get("tokens");

      if (tokensParam) {
        try {
          const tokens = JSON.parse(decodeURIComponent(tokensParam));
          localStorage.setItem("google_tokens", JSON.stringify(tokens));

          // Remove tokens from URL
          router.replace("/dashboard");

          await fetchEmails(tokens.access_token);
        } catch (error) {
          console.error("Error parsing tokens:", error);
          router.push("/");
        }
      } else {
        const savedTokens = localStorage.getItem("google_tokens");
        if (savedTokens) {
          const tokens = JSON.parse(savedTokens);
          await fetchEmails(tokens.access_token);
        } else {
          router.push("/");
        }
      }
    };

    initAuth();
  }, [searchParams, router]);

  const categories = [
    "All",
    "Important",
    "Promotional",
    "Social",
    "Marketing",
    "Spam",
    "General",
    "Unknown",
  ];

  const filterEmails = (category) => {
    setActiveFilter(category);
    if (category === "All") {
      setFilteredEmails(emails);
    } else {
      setFilteredEmails(emails.filter((email) => email.category === category));
    }
  };

  const fetchEmails = async (accessToken) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/emails/fetch`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken, maxResults: emailCount }),
        }
      );

      const data = await response.json();

      localStorage.removeItem("classified_emails");
      await classifyEmails(data.emails);
    } catch (error) {
      console.error("Error fetching emails:", error);
      alert(`Failed to fetch emails: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const classifyEmails = async (emailsToClassify) => {
    setIsClassifying(true);
    try {
      const openaiKey = localStorage.getItem("openai_key");

      if (!openaiKey) {
        alert("OpenAI API key not found. Please login again.");
        router.push("/");
        return;
      }

      console.log(`Classifying ${emailsToClassify.length} emails...`);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/emails/classify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emails: emailsToClassify,
            openaiKey,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setEmails(data.emails);
      setFilteredEmails(data.emails);

      // Cache classified emails
      localStorage.setItem("classified_emails", JSON.stringify(data.emails));
      console.log("Classification complete!");
    } catch (error) {
      console.error("Error classifying emails:", error);
      alert(`Failed to classify emails: ${error.message}`);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleRefresh = async () => {
    const savedTokens = localStorage.getItem("google_tokens");
    if (savedTokens) {
      const tokens = JSON.parse(savedTokens);
      localStorage.removeItem("classified_emails");
      await fetchEmails(tokens.access_token);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("google_tokens");
    localStorage.removeItem("openai_key");
    localStorage.removeItem("classified_emails");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading your emails...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>📧 Email Classifier</h1>
        <div style={styles.headerActions}>
          <input
            type="number"
            value={emailCount}
            onChange={(e) =>
              setEmailCount(
                Math.max(1, Math.min(50, parseInt(e.target.value) || 15))
              )
            }
            style={styles.countInput}
            min="1"
            max="50"
            title="Number of emails to fetch"
          />
          <button onClick={handleRefresh} style={styles.refreshButton}>
            🔄 Refresh
          </button>
          <button onClick={handleLogout} style={styles.logoutButton}>
            🚪 Logout
          </button>
        </div>
      </header>

      {isClassifying && (
        <div style={styles.classifyingBanner}>
          <div style={styles.spinner}></div>
          <span>Classifying emails with AI...</span>
        </div>
      )}

      <div style={styles.filters}>
        {categories.map((category) => {
          const count =
            category === "All"
              ? emails.length
              : emails.filter((e) => e.category === category).length;

          return (
            <button
              key={category}
              onClick={() => filterEmails(category)}
              style={{
                ...styles.filterButton,
                ...(activeFilter === category ? styles.filterButtonActive : {}),
              }}
            >
              {category} ({count})
            </button>
          );
        })}
      </div>

      <div style={styles.emailListContainer}>
        <EmailList emails={filteredEmails} categoryColors={categoryColors} />
      </div>
    </div>
  );
}
