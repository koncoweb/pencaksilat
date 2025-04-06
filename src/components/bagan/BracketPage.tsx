import BracketBuilder from "./BracketBuilder";
import Sidebar from "../layout/Sidebar";

const BracketPage = () => {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <BracketBuilder />
      </div>
    </div>
  );
};

export default BracketPage;
