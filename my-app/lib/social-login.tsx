import { authClient } from "@/lib/auth-client";

export type SocialProvider = "google" | "github";

export async function handleSocialLogin(
  provider: SocialProvider,
  callbackURL = "/dashboard",
) {
  return await authClient.signIn.social({
    provider,
    callbackURL,
  });
}
