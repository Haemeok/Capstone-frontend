export const buildSearchTitle = (
  q: string,
  totalElements: number,
  page: number
): string => {
  const pageLabel = page > 0 ? ` (${page + 1}페이지)` : "";
  if (!q) return `📌 레시피 검색 결과${pageLabel} - 레시피오`;
  const qText = q.includes("레시피") ? q : `${q} 레시피`;
  return `📌 ${qText} ${totalElements}선${pageLabel} - 레시피오`;
};

export const buildSearchDescription = (
  q: string,
  totalElements: number
): string => {
  if (!q)
    return "다양한 필터로 원하는 레시피를 찾아보세요. 재료비, 칼로리, 조리시간까지 한눈에 비교!";
  const qText = q.includes("레시피") ? q : `${q} 레시피`;
  return `${qText} ${totalElements}개를 한눈에 비교하세요. 재료비부터 영양성분까지 다 나옵니다.`;
};
