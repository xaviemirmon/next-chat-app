import Login from "@/components/Login";
import { fetchData } from "@/lib/fetchData";
import { UserType } from "@/types/types";

export default async function HomePage() {
  const data: UserType[] = await fetchData("http://backend:3001/users");
  return (
    <div>
      <Login data={data} />
    </div>
  );
}
