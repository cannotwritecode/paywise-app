"use client";
import { User } from "lucide-react";
import Image from "next/image";

interface UserAvatarProps {
  avatarUrl?: string | null;
  className?: string;
}

export function UserAvatar({ avatarUrl, className }: UserAvatarProps) {
  const sizeClasses = "w-9 h-9"; // Our 36px standard size

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt="User Avatar"
        width={36}
        height={36}
        className={`rounded-full object-cover ${sizeClasses} ${className}`}
      />
    );
  }

  // Fallback
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-primary/10 text-primary ${sizeClasses} ${className}`}
    >
      <User size={20} />
    </div>
  );
}
