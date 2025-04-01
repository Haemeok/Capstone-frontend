import BottomNavBar from "@/components/BottomNavBar";
import TopNavBar from "@/components/TopNavBar";
import { Outlet } from "react-router";

function Root() {
  return (
    <>
      <BottomNavBar />
      <Outlet />
      <TopNavBar label="해먹" isActivePrevButton={true} />
    </>
  );
}

export default Root;
