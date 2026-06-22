"use client";

import { Field, FieldError, FieldLabel } from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { authClient } from "@/lib/auth-client";
import { registerFormSchema, type RegisterFormType } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../shadcnui/button";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "all",
  });

  const onSubmit = useCallback(
    async (values: RegisterFormType) => {
      const { error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: searchParams.get("redirect") ?? "/",
      });

      if (error) {
        toast.error(error.message ?? error.statusText);
      }
    },
    [searchParams],
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4"
      noValidate>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="text"
              autoComplete="name"
              aria-invalid={fieldState.invalid}
              placeholder="Your full name"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

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

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
            <div className="relative">
              <Input
                {...field}
                id={field.name}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ?
                  <EyeOff size={18} />
                : <Eye size={18} />}
              </button>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
            <div className="relative">
              <Input
                {...field}
                id={field.name}
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                tabIndex={-1}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }>
                {showConfirmPassword ?
                  <EyeOff size={18} />
                : <Eye size={18} />}
              </button>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button
        type="submit"
        disabled={isSubmitting}>
        {isSubmitting && (
          <LoaderCircle
            size={18}
            className="animate-spin"
            data-icon="inline-start"
          />
        )}
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
};

export default RegisterForm;
