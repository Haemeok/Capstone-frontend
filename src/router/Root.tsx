import BottomNavBar from "@/components/BottomNavBar";
import { Outlet } from "react-router";

function Root() {
  return (
    <>
      <BottomNavBar />
      <Outlet />
    </>
  );
}

export default Root;
