import * as Yup from "yup";
import { StandardHttpSuccess, axios } from "../shared/axios-client";

export interface UserConfig {
  key: string;
  pollLink: string;
}
export const defaultConfig: UserConfig = {
  key: "",
  pollLink: "",
};

export const configSchema = new Yup.ObjectSchema<UserConfig>({
  key: Yup.string().trim().min(10).required(),
  pollLink: Yup.string().trim().min(10).required(),
});

export async function getUserConfig() {
  const res = await axios.get<StandardHttpSuccess<UserConfig>>("/config");
  return res.data;
}

export async function updateUserConfig(config: UserConfig) {
  const res = await axios.post<StandardHttpSuccess<UserConfig>>(
    "/config",
    config
  );
  return res.data;
}
