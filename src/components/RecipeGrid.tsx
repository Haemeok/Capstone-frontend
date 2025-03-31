import { RecipeGridItem } from "@/type/recipe";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

type RecipeGridProps = {
  recipes: RecipeGridItem[];
  activeTab: string;
};

const RecipeGrid = ({ recipes, activeTab }: RecipeGridProps) => {
  return (
    <div className="p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {recipes.map((recipe) => (
            <motion.div
              key={recipe.id}
              className="rounded-2xl overflow-hidden bg-white shadow-md"
              whileHover={{
                y: -5,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="relative h-48">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-white font-bold text-sm">
                    {recipe.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RecipeGrid;
