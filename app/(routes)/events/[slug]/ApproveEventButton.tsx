"use client";

import Button from "@/components/base/Button";
import { BaseUrl } from "@/shared/utils/env.utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ApproveEventButtonProps {
  slug: string;
}

export function ApproveEventButton({ slug }: ApproveEventButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleApprove() {
    setIsLoading(true);
    try {
      const response = await fetch(`${BaseUrl}/api/events/${slug}/approve`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "Failed to approve event");
      }

      toast.success(data?.message ?? "Event approved");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to approve event";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-end">
      <div className="w-40">
        <Button
          onClick={handleApprove}
          loading={isLoading}
          text="Approve event"
        />
      </div>
    </div>
  );
}
