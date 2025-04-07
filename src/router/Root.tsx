import BottomNavBar from "@/components/BottomNavBar";
import TopNavBar from "@/components/TopNavBar";
import { Outlet } from "react-router";

function Root() {
  return (
    <div className="flex flex-col relative">
      <div className="flex-1 mb-20 overflow-x-hidden">
        <Outlet />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30">
        <BottomNavBar />
      </div>
    </div>
  );
}

export default Root;
