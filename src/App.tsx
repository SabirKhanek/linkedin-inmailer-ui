import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import "./App.css";
import { useAuth } from "./shared/contexts/auth";
import { routesConfig } from "./app.routes";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Navbar } from "./components/navbar";
import "react-toastify/dist/ReactToastify.css";
import { Sidebar } from "./components/sidebar";
function App() {
  const auth = useAuth();
  const pathname = useLocation().pathname;
  const routes = useRoutes(routesConfig);
  const navigate = useNavigate();
  useEffect(() => {
    if (!auth.authDetails.isLoggedIn) {
      toast.info("Login to access the admin panel");
      if (pathname !== "/login") navigate("/login");
    }
  }, [auth]);
  return (
    <>
      <div className="min-h-screen res bg-bluer-white flex flex-col gap-5">
        {auth.authDetails.isLoggedIn && (
          <Navbar className="flex-shrink-0 flex-grow-0"></Navbar>
        )}
        {auth.authDetails.isLoggedIn ? (
          <main
            id="routeContainer"
            className="grow grid grid-cols-1 grid-rows-1 h-full"
          >
            <div className="flex gap-5 items-start responsive h-full">
              <Sidebar className="bg-white w-56 shrink-0" />

              <div className="rounded-3xl w-full min-h-[83vh] shadow mb-5 bg-white">
                {routes}
              </div>
            </div>
          </main>
        ) : (
          <>{routes}</>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default App;

declare global {
  interface Array<T> {
    at(index: number): T;
  }
}
