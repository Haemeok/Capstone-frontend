type CateGoryItemProps = {
  name: string;
  image: string;
  count: number;
};

const CateGoryItem = ({ name, image, count }: CateGoryItemProps) => {
  return (
    <div className="flex-shrink-0 w-50 h-70 rounded-xl overflow-hidden relative flex flex-col items-center justify-center mb-2">
      <div className="absolute inset-0 bg-gradient-to-b from-green-400 to-green-500 rounded-xl"></div>

      <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl mb-3">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-20 h-20 object-cover rounded-full"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
        )}
      </div>

      <div className="z-10 text-center mt-10">
        <h3 className="text-white text-lg">{name}</h3>
        <p className="text-white text-md">{count} recipes</p>
      </div>
    </div>
  );
};

export default CateGoryItem;
