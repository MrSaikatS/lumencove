"use client";

import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, MailCheck } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Field, FieldError, FieldLabel } from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { authClient } from "@/lib/auth-client";
import { forgotPasswordSchema, type ForgotPasswordType } from "@/lib/zodSchema";

import { Button } from "../shadcnui/button";

const ForgotPasswordForm = () => {
  const [sent, setSent] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "all",
  });

  const onSubmit = useCallback(async (values: ForgotPasswordType) => {
    const { error } = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      toast.error(error.message ?? error.statusText);
      return;
    }

    setSent(true);
  }, []);

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <MailCheck
          size={48}
          className="text-primary"
        />
        <p className="text-muted-foreground text-sm">
          If an account with that email exists, we&apos;ve sent a password reset
          link. Check your inbox.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate>
      <p className="text-muted-foreground mb-6 text-sm">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="email"
              autoComplete="email"
              aria-invalid={fieldState.invalid}
              placeholder="you@example.com"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full"
        size="lg">
        {isSubmitting && (
          <LoaderCircle
            size={18}
            className="animate-spin"
            data-icon="inline-start"
          />
        )}
        {isSubmitting ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
