import { logout } from "../../services/auth";
import { useAuth } from "../../shared/contexts/auth";
import { Button } from "../button";

export interface NavbarProps {
  className?: string;
}
export function Navbar({ className }: NavbarProps) {
  const auth = useAuth();
  return (
    <nav
      className={`relative border-b bg-white bg-transparent border-b-white/20 ${className} `}
    >
      <div
        className={`responsive flex justify-between py-3 items-center gap-10`}
      >
        <div className="text-lg font-bold">LinkedIn Automation</div>
        <div className="flex items-center gap-2">
          {auth.authDetails.isLoggedIn && (
            <>
              <span className="text-lg font-semibold text-black">
                {auth.authDetails.user?.username}
              </span>
              <Button className="bg-primary" onClick={() => logout()}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
