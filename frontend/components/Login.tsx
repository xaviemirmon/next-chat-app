"use client";

import { useUser } from "@/providers/UserProvider";
import { UserType } from "@/types/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login({ data }: { data: UserType[] }) {
  const { user, updateUser } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (loading) {
    <div>Loading...</div>;
  }

  if (!user && data) {
    return (
      <div>
        <h1>Login to Chat</h1>
        <ul>
          {data.map((user) => (
            <li key={user.id}>
              <button
                onClick={() => {
                  setLoading(true);
                  updateUser(user.id);
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
}
