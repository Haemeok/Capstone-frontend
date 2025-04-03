import BottomNavBar from "@/components/BottomNavBar";
import TopNavBar from "@/components/TopNavBar";
import { Outlet } from "react-router";

function Root() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="fixed top-0 left-0 right-0 z-30">
        <TopNavBar label="해먹" isActivePrevButton={true} />
      </div>

      <div className="flex-1 mt-16 mb-20 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30">
        <BottomNavBar />
      </div>
    </div>
  );
}

export default Root;
