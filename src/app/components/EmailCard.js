"use client";

export default function EmailCard({ email, categoryColors }) {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const extractEmail = (fromString) => {
    const match = fromString.match(/<(.+?)>/);
    return match ? match[1] : fromString;
  };

  const extractName = (fromString) => {
    const match = fromString.match(/^(.+?)\s*</);
    return match ? match[1].replace(/"/g, "") : fromString.split("@")[0];
  };

  return (
    <div style={styles.emailCard} className="email-card">
      <div style={styles.emailHeader}>
        <div style={styles.emailInfo}>
          <div style={styles.emailFrom}>
            <span style={styles.senderName}>{extractName(email.from)}</span>
            <span style={styles.senderEmail}>{extractEmail(email.from)}</span>
          </div>
          <div style={styles.emailSubject}>{email.subject}</div>
        </div>
        {email.category && (
          <span
            style={{
              ...styles.categoryBadge,
              background: categoryColors[email.category] || "#757575",
            }}
          >
            {email.category}
          </span>
        )}
      </div>
      <div style={styles.emailSnippet}>{email.snippet}</div>
      <div style={styles.emailDate}>{formatDate(email.date)}</div>
    </div>
  );
}

const styles = {
  emailCard: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  emailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
    gap: "15px",
  },
  emailInfo: {
    flex: 1,
    minWidth: 0,
  },
  emailFrom: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    marginBottom: "8px",
  },
  senderName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },
  senderEmail: {
    fontSize: "12px",
    color: "#999",
  },
  emailSubject: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  categoryBadge: {
    padding: "6px 14px",
    borderRadius: "12px",
    color: "white",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  emailSnippet: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "12px",
    lineHeight: "1.5",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  emailDate: {
    fontSize: "12px",
    color: "#999",
  },
};
