import { render, screen } from "@testing-library/react";

import { DictionaryProvider, useT } from "../DictionaryProvider";
import { getDictionary } from "../getDictionary";

const Probe = () => {
  const t = useT();
  return <span>{t.errors.searchResults}</span>;
};

it("provider가 준 locale dict를 useT로 노출한다", () => {
  render(
    <DictionaryProvider dict={getDictionary("ko")}>
      <Probe />
    </DictionaryProvider>
  );
  expect(screen.getByText("검색 결과를 표시할 수 없어요")).toBeInTheDocument();
});
