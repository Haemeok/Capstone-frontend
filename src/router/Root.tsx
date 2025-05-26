import BottomNavBar from '@/components/BottomNavBar';
import AnimatedOutlet from './AnimatedOutlet';
import { Outlet } from 'react-router';

const Root = () => {
  return (
    <>
      <AnimatedOutlet />
      <BottomNavBar />
    </>
  );
};

export default Root;
