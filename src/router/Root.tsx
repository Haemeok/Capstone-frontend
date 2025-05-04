import BottomNavBar from '@/components/BottomNavBar';
import TopNavBar from '@/components/TopNavBar';
import { Outlet } from 'react-router';

function Root() {
  return (
    <div className="">
      <div className="min-h-screen overflow-y-auto">
        <Outlet />
      </div>

      <BottomNavBar />
    </div>
  );
}

export default Root;
