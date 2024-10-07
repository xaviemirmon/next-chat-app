import Login from "@/components/Login";
import { UserType } from "@/types/types";

async function getData() {
  const res = await fetch("http://backend:3001/users");
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function HomePage() {
  const data: UserType[] = await getData();
  return (
    <div>
      <Login data={data} />
    </div>
  );
}
