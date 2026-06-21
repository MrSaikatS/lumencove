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
import RegisterForm from "@/components/Auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
};

const RegisterPage = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <p className="text-muted-foreground text-sm">
          Get started with Lumencove
        </p>
      </CardHeader>

      <CardContent>
        <Suspense fallback={null}>
          <RegisterForm />
        </Suspense>
      </CardContent>

      <CardFooter>
        <p className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link
            href="/"
            className="text-primary font-medium underline-offset-2 hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterPage;
