export function formatChatTime(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (diffHours < 48) {
    return "Yesterday";
  }

  if (diffHours < 168) {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });
  }

  return new Date(date).toLocaleDateString();
}
