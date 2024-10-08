"use client";

import { useUser } from "@/providers/UserProvider";
import { ConnectionType, UserType } from "@/types/types";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/fetchData";
import { Button } from "@/components/Button";
import { Spinner } from "./Spinner";

export default function Dashboard({ apiUrl }: { apiUrl: string | undefined }) {
  const { user } = useUser();

  const router = useRouter();

  const [data, setData] = useState<UserType[] | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      try {
        const connections: ConnectionType[] = await fetchData(
          `http://${apiUrl}/connections/${user}`,
        );

        // Fetch user data for each userId in the connections
        const userDataPromises = connections.map(async (connection) => {
          const userResponse: UserType = await fetchData(
            `http://${apiUrl}/user/${connection.userId}`,
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
  }, [user, apiUrl]);

  if (!user) {
    router.push("/");
  }

  if (loading) {
    <Spinner />;
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
  return <p>somthing went wrong </p>;
}
