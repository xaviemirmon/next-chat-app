"use client";

import { useUser } from "@/providers/UserProvider";
import { ConnectionType, UserType } from "@/types/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/fetchData";
import { Button } from "@/components/Button";

export default function Dashboard() {
  const { user } = useUser();

  const router = useRouter();

  const [data, setData] = useState<UserType[] | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const connections: ConnectionType[] = await fetchData(
          `http://127.0.0.1:3001/connections/${user}`,
        );

        // Fetch user data for each userId in the connections
        const userDataPromises = connections.map(async (connection) => {
          const userResponse: UserType = await fetchData(
            `http://127.0.0.1:3001/user/${connection.userId}`,
          );
          return userResponse; // Return user data for each userId
        });

        // Wait for all user data promises to resolve
        const userDataArray = await Promise.all(userDataPromises);
        setData(userDataArray);
      } catch (error) {
        console.error("Error fetching connections or user data:", error);
      } finally {
        setLoading(false); // Set loading to false once fetching is done
      }
    };
    fetchConnections();
  }, [user]);

  if (!user) {
    router.push("/");
  }

  if (loading) {
    <div>Loading...</div>;
  }

  if (data) {
    return (
      <div>
        <h1>My connnections</h1>
        <ul>
          {data.map((connection) => (
            <li key={connection.userId}>
              Chat with{` `}
              <Button
                onClick={() => {
                  setLoading(true);
                  router.push(`/chat/${connection.userId}`);
                }}
              >
                {connection.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
