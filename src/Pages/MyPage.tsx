import React from "react";

const MyPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Page</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-700">Welcome to your personal page!</p>
      </div>
    </div>
  );
};

export default MyPage;
