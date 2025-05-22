import { TAG_CODES } from '@/constants/recipe';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router';

type CateGoryItemProps = {
  id: number;
  name: string;
  imageUrl: string;

  className?: string;
};

const CateGoryItem = ({ name, imageUrl, className }: CateGoryItemProps) => {
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        'relative h-70 w-50 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg shadow-md',
        className,
      )}
      onClick={() => {
        navigate(
          `/recipes/category/${TAG_CODES[name as keyof typeof TAG_CODES]}`,
        );
      }}
    >
      <img
        src={imageUrl}
        alt={name}
        className="img-smooth h-70 w-50 object-cover"
      />
      <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <p className="truncate px-2 text-lg font-semibold text-white">{name}</p>
      </div>
    </div>
  );
};

export default CateGoryItem;
