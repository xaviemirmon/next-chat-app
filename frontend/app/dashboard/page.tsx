import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
  return (
    <div className="container">
      <Dashboard
        apiUrl={
          process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL : ""
        }
      />
    </div>
  );
}
