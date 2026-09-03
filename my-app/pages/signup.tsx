import { SignupForm } from "@/components/signup-form";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(context.req.headers),
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

export default function Signup() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-100">
      <div className="w-full max-w-sm bg-primary">
        <SignupForm />
      </div>
    </div>
  );
}

