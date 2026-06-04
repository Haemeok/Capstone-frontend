import { CandidatePanel } from "./components/CandidatePanel";
import { Workspace } from "./components/Workspace";

export const metadata = { title: "Curation Test (admin)" };

const Page = () => (
  <div className="grid h-screen grid-cols-[320px_1fr]">
    <CandidatePanel />
    <Workspace />
  </div>
);

export default Page;
