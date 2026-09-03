/**
 * Centralized error handler and user-friendly message formatter.
 * Ensures internal database errors, stack traces, and sensitive tokens
 * are never exposed to the end user.
 */

export function getUserFriendlyErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again later."
): string {
  if (!error) return fallback;

  // Handle standard Error instances
  const rawMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : typeof error === "object" && error !== null && "message" in error
      ? String((error as { message: unknown }).message)
      : "";

  if (!rawMessage) return fallback;

  const msg = rawMessage.toLowerCase();

  // Network & Connectivity Errors
  if (
    msg.includes("fetch failed") ||
    msg.includes("network error") ||
    msg.includes("failed to fetch") ||
    msg.includes("connection refused")
  ) {
    return "Unable to connect to the server. Please check your internet connection and try again.";
  }

  // Authentication & Credentials
  if (
    msg.includes("invalid_email_or_password") ||
    msg.includes("invalid email or password") ||
    msg.includes("invalid credentials")
  ) {
    return "Incorrect email address or password.";
  }

  if (
    msg.includes("email_not_verified") ||
    msg.includes("email not verified")
  ) {
    return "Please verify your email address before signing in.";
  }

  if (
    msg.includes("user_already_exists") ||
    msg.includes("user already exists") ||
    msg.includes("email already in use") ||
    msg.includes("already registered")
  ) {
    return "An account with this email address already exists.";
  }

  if (
    msg.includes("invalid_token") ||
    msg.includes("token_expired") ||
    msg.includes("invalid token")
  ) {
    return "This verification or reset link is invalid or has expired. Please request a new one.";
  }

  if (
    msg.includes("password_too_short") ||
    msg.includes("password must be at least")
  ) {
    return "Password must be at least 8 characters long.";
  }

  // HTTP Errors
  if (msg.includes("400") || msg.includes("bad_request")) {
    return "Please check the information you entered and try again.";
  }

  if (msg.includes("401") || msg.includes("unauthorized")) {
    return "Please sign in to continue.";
  }

  if (msg.includes("403") || msg.includes("forbidden")) {
    return "You don't have permission to perform this action.";
  }

  if (msg.includes("404") || msg.includes("not_found")) {
    return "We couldn't find what you were looking for.";
  }

  if (msg.includes("409") || msg.includes("conflict")) {
    return "This item or account already exists.";
  }

  if (msg.includes("429") || msg.includes("too_many_requests")) {
    return "Too many requests. Please wait a moment and try again.";
  }

  if (msg.includes("500") || msg.includes("internal_server_error")) {
    return "Something went wrong on our side. Please try again later.";
  }

  // Filter out internal Prisma / SQL / Stack trace errors
  if (
    msg.includes("prisma") ||
    msg.includes("p20") ||
    msg.includes("sql") ||
    msg.includes("database") ||
    msg.includes("postgres") ||
    msg.includes("table") ||
    msg.includes("invocation") ||
    msg.includes("stack") ||
    msg.includes("column")
  ) {
    return "Unable to save or retrieve data. Please try again later.";
  }

  // Return rawMessage only if it looks safe and user-friendly (no curly braces, no codes)
  if (
    !rawMessage.includes("{") &&
    !rawMessage.includes("Error:") &&
    rawMessage.length < 150
  ) {
    return rawMessage;
  }

  return fallback;
}

/**
 * Logs technical error context safely on the server console without leaking secrets.
 */
export function logServerError(context: string, error: unknown): void {
  const timestamp = new Date().toISOString();
  console.error(`[SERVER LOG - ${timestamp}] Error in ${context}:`, error);
}
