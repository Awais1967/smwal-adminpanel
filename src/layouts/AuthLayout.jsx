import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* content */}
      <div className="relative">
        <Outlet />
      </div>
    </div>
  );
}
