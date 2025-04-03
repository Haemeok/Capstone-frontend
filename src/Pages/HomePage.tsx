import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Search } from "lucide-react";
import CategoriesTabs from "@/components/CategoriesTabs";
import GoogleIcon from "@/components/Icon/GoogleIcon";
import { END_POINTS } from "@/constants/api";
import { useUserStore } from "@/store/useUserStore";
import UserProfile from "@/components/UserProfile";

const HomePage = () => {
  const navigate = useNavigate();
  const { isLogged, user, logIn, logOut, clearUser } = useUserStore();

  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#222222] overflow-x-hidden">
      {/* 검색창 */}
      <div className="absolute -bottom-8 left-0 right-0 px-6 z-30">
        <div className="bg-white rounded-xl shadow-xl flex items-center p-4 pl-5">
          <Search size={22} className="text-[#00473c] mr-3" />
          <input
            type="text"
            placeholder="원하는 레시피나 재료를 검색해보세요"
            className="flex-1 bg-transparent focus:outline-none text-[#333333] text-lg"
          />
        </div>
      </div>
      {/* 메인 콘텐츠 영역 */}
      <div className="relative pt-16 pb-24 z-10">
        {/* 카테고리 섹션 */}
        <CategoriesTabs />
      </div>

      {!isLogged ? (
        <div className="flex h-12 items-center justify-center gap-2 rounded-md border-[1px] border-c_button_gray p-2 px-4">
          <GoogleIcon width={24} height={24} />
          <Link to={END_POINTS.GOOGLE_LOGIN}>구글 로그인</Link>
        </div>
      ) : (
        user && (
          <div className="flex justify-between gap-5">
            <UserProfile user={user} />
            <button onClick={logOut}>로그아웃</button>
          </div>
        )
      )}
    </div>
  );
};

export default HomePage;
