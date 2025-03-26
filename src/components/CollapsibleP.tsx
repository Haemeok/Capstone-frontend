import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";

const CollapsibleP = () => {
  const [isOpen, setIsOpen] = useState(false);
  const content =
    "For any French toast fan, this recipe will be the next fixation, especially from the air fryer! Each part of this recipe is full of flavor; cinnamon, apple, and sugar. Use large bread slices to be able wrap around the apple filling comfortably. Pair them with a simple vanilla yogurt or quark for a dip to take the snacking moment to the next level. They turn out even crispier in this air fryer version, and you can cut off the edges to make croutons later, so keep them around (air fryer croutons are unmatched).";
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CardContent className="p-4">
        <div
          className="relative w-full prose prose-sm max-w-none"
          style={{
            height: isOpen ? "auto" : "100px",
            transition: "height 0.3s ease-in-out",
          }}
        >
          <div className={`${isOpen ? "" : "max-h-24 overflow-hidden"}`}>
            <p className="mb-2 break-words">{content}</p>
          </div>

          {!isOpen && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
          )}
        </div>

        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="mt-2 text-orange-500">
            {isOpen ? (
              <>
                Read less <ChevronUp size={16} className="ml-1" />
              </>
            ) : (
              <>
                Read more <ChevronDown size={16} className="ml-1" />
              </>
            )}
          </Button>
        </CollapsibleTrigger>
      </CardContent>
    </Collapsible>
  );
};

export default CollapsibleP;
