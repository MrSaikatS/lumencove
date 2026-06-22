"use client";

import { Checkbox } from "@/components/shadcnui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { authClient } from "@/lib/auth-client";
import { loginFormSchema, type LoginFormType } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../shadcnui/button";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
    mode: "all",
  });

  const onSubmit = useCallback(
    async (values: LoginFormType) => {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
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
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your password"
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
        name="rememberMe"
        control={control}
        render={({ field }) => (
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className={"cursor-pointer"}
            />
            Remember me
          </label>
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
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
};

export default LoginForm;
