export const buildSearchTitle = (
  q: string,
  totalElements: number,
  page: number
): string => {
  const pageLabel = page > 0 ? ` (${page + 1}페이지)` : "";
  const qText = q.includes("레시피") ? q : `${q} 레시피`;

  return q
    ? `📌'${qText}' - ${totalElements}개 검색결과${pageLabel} `
    : `레시피 검색 결과${pageLabel} - 레시피오`;
};

export const buildSearchDescription = (
  q: string,
  totalElements: number
): string => {
  return q
    ? `"${q}"에 대한 ${totalElements}개의 레시피 검색 결과입니다.`
    : "필터를 적용한 레시피 검색 결과입니다.";
};
