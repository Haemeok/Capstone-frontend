"use client";

import React from "react";

type Props = {
  image: React.ReactNode;
  title: React.ReactNode;
};
const RecipeHeaderSection = ({ image, title }: Props) => {
  return (
    <section className="relative">
      <div className="relative flex h-[40vh] w-full cursor-pointer items-center justify-center border-b bg-gray-200 text-gray-400 hover:bg-gray-300">
        {image}
      </div>

      <div className="absolute right-0 bottom-0 left-0 flex h-32 flex-col justify-center bg-gradient-to-t from-black/80 to-transparent p-4 pb-8">
        {title}
      </div>
    </section>
  );
};

export default RecipeHeaderSection;
