import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import LoginForm from "@/components/Auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
};

const LoginPage = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Welcome back</CardTitle>
        <p className="text-muted-foreground text-sm">
          Sign in to your account to continue
        </p>
      </CardHeader>

      <CardContent>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </CardContent>

      <CardFooter className="flex-col justify-center gap-2">
        <Link
          href="/forgot-password"
          className="text-muted-foreground text-sm underline-offset-2 hover:underline">
          Forgot your password?
        </Link>

        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-medium underline-offset-2 hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginPage;
