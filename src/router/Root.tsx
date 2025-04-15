import BottomNavBar from '@/components/BottomNavBar';
import TopNavBar from '@/components/TopNavBar';
import { Outlet } from 'react-router';

function Root() {
  return (
    <div className="relative flex flex-col">
      <div className="mb-20 flex-1 overflow-x-hidden">
        <Outlet />
      </div>

      <div className="fixed right-0 bottom-0 left-0 z-30">
        <BottomNavBar />
      </div>
    </div>
  );
}

export default Root;
