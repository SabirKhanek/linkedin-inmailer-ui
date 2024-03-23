import { axios } from "../shared/axios-client";
import { toast } from "react-toastify";
import { updateAuthDetails } from "../shared/contexts/auth";
export interface LoginParams {
  username: string;
  password: string;
}

export async function login(loginCredentials: LoginParams) {
  try {
    const response = await axios.post("/auth", loginCredentials);
    if (response && response.status === 401) {
      console.error("Unauthorized: Invalid credentials");
      toast.error(response.data.details || "Invalid credentials");
      return false;
    } else {
      localStorage.setItem("jwt", response.data.jwt);
      const user = isLoggedIn();
      if (user?.username) toast(`Welcome back ${user.username}`);
      updateAuthDetails();
      return true;
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized: Invalid credentials");
      toast.error(error.response.data || "Invalid credentials");
    } else {
      console.error("Login failed:", error.message);
    }
    return false;
  }
}

export async function logout() {
  localStorage.removeItem("jwt");
  window.location.reload();
  return true;
}

export function isLoggedIn() {
  const jwtToken = localStorage.getItem("jwt");

  if (jwtToken) {
    const [, payloadBase64] = jwtToken.split("."); // Extract the payload part of the JWT
    if (payloadBase64) {
      try {
        const decodedPayload = JSON.parse(atob(payloadBase64));
        return decodedPayload as { username: string };
      } catch (error: any) {
        // Handle JSON parsing errors
        console.error("Error decoding JWT payload:", error.message);
        return undefined;
      }
    }
  }

  return undefined;
}
