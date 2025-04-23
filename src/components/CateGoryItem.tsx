import { END_POINTS } from '@/constants/api';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router';

type CateGoryItemProps = {
  id: number;
  name: string;
  imageUrl: string;
  onClick: () => void;
  className?: string;
};

const CateGoryItem = ({
  name,
  imageUrl,
  onClick,
  className,
}: CateGoryItemProps) => {
  const navigate = useNavigate();
  return (
    <div
      className={cn(
        'relative h-70 w-50 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg shadow-md',
        className,
      )}
      onClick={() => {
        navigate(END_POINTS.RECIPES_BY_CATEGORY(name));
      }}
    >
      <img
        src={imageUrl}
        alt={name}
        className="img-smooth h-70 w-50 object-cover"
      />
      <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <h3 className="truncate text-lg font-semibold text-white">{name}</h3>
      </div>
    </div>
  );
};

export default CateGoryItem;
