"use client";

import { Field, FieldError, FieldLabel } from "@/components/shadcnui/field";
import { Input } from "@/components/shadcnui/input";
import { authClient } from "@/lib/auth-client";
import { resetPasswordSchema, type ResetPasswordType } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../shadcnui/button";

const ResetPasswordForm = ({ token }: { token: string }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "all",
  });

  const onSubmit = useCallback(
    async (values: ResetPasswordType) => {
      const { error } = await authClient.resetPassword({
        newPassword: values.password,
        token,
      });

      if (error) {
        toast.error(error.message ?? error.statusText);
        return;
      }

      toast.success("Password reset successfully. Please sign in.");
      router.push("/");
    },
    [token, router],
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate>
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
            <div className="relative">
              <Input
                {...field}
                id={field.name}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
                placeholder="Enter new password"
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
                placeholder="Confirm new password"
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
        {isSubmitting ? "Resetting…" : "Reset password"}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
