import { Collapsible, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CardContent } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

type CollapsiblePProps = {
  content: string;
};

const CollapsibleP = ({ content }: CollapsiblePProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CardContent className="p-4">
        <div
          className="prose prose-sm relative w-full max-w-none"
          style={{
            height: isOpen ? 'auto' : '100px',
            transition: 'height 0.3s ease-in-out',
          }}
        >
          <div className={`${isOpen ? '' : 'max-h-24 overflow-hidden'}`}>
            <p className="mb-2 break-words">{content}</p>
          </div>

          {!isOpen && (
            <div className="absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
          )}
        </div>

        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 font-semibold text-[#526c04]"
          >
            {isOpen ? (
              <>
                숨기기 <ChevronUp size={16} className="ml-1" />
              </>
            ) : (
              <>
                더 읽기 <ChevronDown size={16} className="ml-1" />
              </>
            )}
          </Button>
        </CollapsibleTrigger>
      </CardContent>
    </Collapsible>
  );
};

export default CollapsibleP;
