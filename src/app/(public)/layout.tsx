import type { LayoutChildrenProps } from "@/lib/types";

const PublicLayout = ({ children }: LayoutChildrenProps) => {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      {children}
    </main>
  );
};

export default PublicLayout;
