import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { GalleryVerticalEndIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await auth.api.getSession({
    headers: new Headers(context.req.headers as unknown as Record<string, string>),
  });

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEndIcon className="size-4" />
          </div>
          Acme Inc.
        </a>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
