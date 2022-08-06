import { Navbar } from "@/components/Navbar";
import { MainLayout } from "@/components/dashboard/MainLayout";
import { DefaultHead } from "@/components/DefaultHead";

function Dashboard() {
  return (
    <div>
      <DefaultHead title="Dashboard" />
      <Navbar />
      <MainLayout>
        <></>
      </MainLayout>
    </div>
  );
}

export default Dashboard;