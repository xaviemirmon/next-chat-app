import Login from "@/components/Login";
import { fetchData } from "@/lib/fetchData";
import { UserType } from "@/types/types";

export default async function HomePage() {
  const data: UserType[] = await fetchData(
    `http://${process.env.API_URL}/users`,
  );
  return (
    <div className="container">
      <Login data={data} />
    </div>
  );
}
