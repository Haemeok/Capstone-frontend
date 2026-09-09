import { createReportSession } from "../reportSession";

const token = "a".repeat(43);

describe("리포트 링크 진입", () => {
  beforeEach(() => window.history.replaceState({}, "", "/ad-report"));

  it("토큰을 메모리에 읽고 주소에서 지우며 재초기화해도 유지한다", () => {
    window.history.replaceState({}, "", `/ad-report#token=${token}`);
    const session = createReportSession();
    session.initialize();
    expect(session.getSnapshot()?.token).toBe(token);
    expect(window.location.hash).toBe("");
    session.initialize();
    expect(session.getSnapshot()?.token).toBe(token);
    expect(JSON.stringify(session.getSnapshot()?.id)).not.toContain(token);
  });

  it("토큰 없는 새 페이지와 잘못된 링크를 구분된 조회 불가 상태로 만든다", () => {
    const session = createReportSession();
    session.initialize();
    expect(session.getSnapshot()?.token).toBeNull();
    window.history.replaceState({}, "", "/ad-report#token=bad");
    session.initialize();
    expect(session.getSnapshot()?.token).toBeNull();
    expect(window.location.hash).toBe("");
  });

  it("새 링크의 토큰이 들어오면 이전 캠페인의 세션을 재사용하지 않는다", () => {
    window.history.replaceState({}, "", `/ad-report#token=${token}`);
    const session = createReportSession();
    session.initialize();
    const previous = session.getSnapshot()?.id;
    window.history.replaceState({}, "", `/ad-report#token=${"b".repeat(43)}`);
    session.initialize();
    expect(session.getSnapshot()?.id).not.toBe(previous);
    expect(session.getSnapshot()?.token).toBe("b".repeat(43));
  });
});
