import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { MainLayout } from "@/components/dashboard/MainLayout";

function Dashboard() {
  return (
    <div>
      <Navbar />
      <MainLayout>
        <></>
      </MainLayout>
      <Footer />
    </div>
  );
}

export default Dashboard;