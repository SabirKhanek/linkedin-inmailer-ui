import { RouteObject } from "react-router-dom";
import { HomePage } from "./pages/home";
import { AuthPage } from "./pages/auth";
import { LoginPage } from "./pages/auth/login";
import { AddUser } from "./pages/config/add_user";
import { ConfigureSession } from "./pages/config/session";
import { InMailer } from "./pages/tools/inmailer";

export const routesConfig: RouteObject[] = [
  { path: "/", element: <HomePage /> },
  {
    element: <AuthPage />,
    children: [{ path: "login", element: <LoginPage /> }],
  },
  { element: <ConfigureSession />, path: "/session" },
  { element: <AddUser />, path: "/add_user" },
  {
    path: "/tools",
    children: [
      {
        path: "inmailer",
        element: <InMailer />,
      },
    ],
  },
];
