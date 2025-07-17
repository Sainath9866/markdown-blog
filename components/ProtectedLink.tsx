"use client";

import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";

interface ProtectedLinkProps extends ComponentProps<typeof Button> {
  href: string;
  children: React.ReactNode;
}

export default function ProtectedLink({
  href,
  children,
  ...props
}: ProtectedLinkProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      router.push("/api/auth/signin");
    }
  };

  return (
    <Button {...props} asChild onClick={handleClick}>
      <Link href={href}>{children}</Link>
    </Button>
  );
} 