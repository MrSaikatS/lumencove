"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/shadcnui/button";
import ThemeToggleButton from "../ThemeToggleButton";

const Header = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message ?? error.statusText);
      return;
    }

    router.push("/");
  };

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 border-b shadow"
      aria-label="app-header">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href={"/"}>
          <h1
            className="text-2xl font-semibold"
            aria-label="App Name">
            Lumencove
          </h1>
        </Link>

        <nav className="flex items-center gap-4">
          {isPending ?
            null
          : session ?
            <>
              <span className="text-muted-foreground text-sm">
                {session.user.name ?? session.user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          : <>
              <Link href="/">Sign in</Link>
              <Link href="/register">Sign up</Link>
            </>
          }

          <ThemeToggleButton />
        </nav>
      </div>
    </header>
  );
};

export default Header;
