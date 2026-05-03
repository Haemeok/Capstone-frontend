import { CandidatePanel } from "./components/CandidatePanel";
import { Workspace } from "./components/Workspace";

export const metadata = { title: "Curation Test (admin)" };

const Page = () => (
  <div className="grid grid-cols-[320px_1fr] h-screen">
    <CandidatePanel />
    <Workspace />
  </div>
);

export default Page;
