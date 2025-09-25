import Sidebar from "@/components/Sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex bg-gray-50">
      <div className="w-64 bg-white shadow-lg border-r flex flex-col">
        <Sidebar />
      </div>

      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

export default layout;
