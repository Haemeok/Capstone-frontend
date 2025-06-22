import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useState, useEffect } from 'react';

const AIBadgeButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => {
        setIsOpen(false);
      };

      window.addEventListener('scroll', handleScroll, true);

      const timerId = setTimeout(() => {
        setIsOpen(false);
      }, 3000);

      return () => {
        clearTimeout(timerId);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <p style={{ cursor: 'pointer' }}>🧪</p>
      </PopoverTrigger>
      <PopoverContent className="w-fit py-2">
        <p className="text-sm text-gray-500">
          AI의 도움을 받아 작성된 레시피예요
        </p>
      </PopoverContent>
    </Popover>
  );
};

export default AIBadgeButton;
