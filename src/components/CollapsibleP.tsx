import { Collapsible, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CardContent } from './ui/card';
import { Button } from './ui/button';
import { useState } from 'react';

const CollapsibleP = () => {
  const [isOpen, setIsOpen] = useState(false);
  const content =
    '캐서롤 접시 바닥에 토마토 소스를 한 겹 펴 바릅니다. 국수 층을 올린 다음 베샤멜 소스 층과 야채 층을 추가합니다. 그 위에 면과 토마토 소스를 한 겹 더 얹고 캐서롤 접시가 가득 찰 때까지 이 패턴을 반복합니다. 베샤멜 소스 층과 남은 버섯과 시금치로 마무리합니다. 타임 잎으로 장식합니다. 200°C/400°F에서 약 30~40분간 또는 측면에 기포가 생기고 윗면이 노릇노릇해질 때까지 구워줍니다. 살짝 식힌 후 슬라이스하여 제공합니다. 맛있게 드세요!';
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
