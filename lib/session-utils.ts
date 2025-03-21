import { getSession, signIn } from "next-auth/react";

/**
 * Updates the session data by forcing a refresh
 * Call this function after updating user data in the database
 */
export async function refreshSession() {
  // This forces a re-fetch of the session, which will call the session callback
  // in the NextAuth config and get fresh data from the database
  await signIn("credentials", { redirect: false });
}

/**
 * Gets the latest session data from the server
 * Use this when you need the most up-to-date session information
 */
export async function getLatestSession() {
  // The 'true' parameter forces the session to be refreshed from the server
  return await getSession({ required: true });
}
