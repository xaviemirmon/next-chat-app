"use client";

import { useUser } from "@/providers/UserProvider";
import { UserType } from "@/types/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/Spinner";

export default function Login({ data }: { data: UserType[] }) {
  const { user, updateUser } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  if (!user && data) {
    return (
      <div>
        <h1>Login to Chat</h1>
        <ul>
          {data.map((user) => (
            <li key={user.userId}>
              <button
                onClick={() => {
                  setLoading(true);
                  updateUser(user.userId);
                  router.push("/dashboard");
                }}
              >
                Login as {user.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (loading) {
    return <Spinner />;
  }
}
