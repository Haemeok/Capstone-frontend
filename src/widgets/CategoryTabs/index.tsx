import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/shadcn/carousel";
import { TAG_ITEMS } from "@/shared/config/constants/recipe";

import CateGoryItem from "./CateGoryItem";

type CategoryTabsProps = {
  title: string;
};

const CategoryTabs = ({ title }: CategoryTabsProps) => {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="gap-3">
          {TAG_ITEMS.map((item, index) => (
            <CarouselItem key={item.id} className="basis-[200px]">
              <CateGoryItem
                id={item.id}
                name={item.name}
                imageUrl={item.imageUrl}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 hidden cursor-pointer md:flex" />
        <CarouselNext className="-right-4 hidden cursor-pointer md:flex" />
      </Carousel>
    </div>
  );
};

export default CategoryTabs;
