"use client";

import EmailCard from "./EmailCard";

export default function EmailList({ emails, categoryColors }) {
  if (emails.length === 0) {
    return (
      <div style={styles.noEmails}>
        <svg
          style={styles.noEmailsIcon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p style={styles.noEmailsText}>No emails in this category</p>
      </div>
    );
  }

  return (
    <div style={styles.emailList}>
      {emails.map((email) => (
        <EmailCard
          key={email.id}
          email={email}
          categoryColors={categoryColors}
        />
      ))}
    </div>
  );
}

const styles = {
  emailList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  noEmails: {
    background: "white",
    padding: "60px 40px",
    borderRadius: "8px",
    textAlign: "center",
    color: "#999",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  noEmailsIcon: {
    width: "64px",
    height: "64px",
    color: "#ccc",
  },
  noEmailsText: {
    fontSize: "16px",
    margin: 0,
  },
};
