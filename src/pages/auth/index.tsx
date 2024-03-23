import { Outlet } from "react-router-dom";

export interface AuthPageProps {
  className?: string;
}
export function AuthPage({ className }: AuthPageProps) {
  return (
    <div className={`relative bg-bluer-white grow ${className}`}>
      <div className="mx-auto my-0 flex flex-col gap-10 w-full min-h-screen justify-center items-center max-w-2xl">
        <Outlet />
      </div>
    </div>
  );
}
