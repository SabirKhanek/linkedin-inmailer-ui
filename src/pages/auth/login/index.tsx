import { useFormik } from "formik";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import { useState } from "react";
import { loginFormSchema } from "../../../schemas/forms/login";
import { login } from "../../../services/auth";
import { useNavigate } from "react-router-dom";

export interface LoginPageProps {
  className?: string;
}
export function LoginPage({ className }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (val) => {
      setIsLoading(true);
      const isLoggedIn = await login(val);
      setIsLoading(false);
      if (isLoggedIn) navigate("/");
    },
    validationSchema: loginFormSchema,
  });
  return (
    <div className={`flex justify-center items-center flex-col ${className}`}>
      <div className="w-[472px] rounded-lg bg-white shadow p-8">
        <div className="text-center flex-col justify-center items-center mb-8">
          <h2 className=" font-semibold text-xl text-[#707070]">
            Sign <span className="text-primary">In</span>
          </h2>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <Input
            label="Username"
            name="username"
            value={formik.values.username}
            error={formik.errors.username}
            isTouched={formik.touched.username}
            onChange={formik.handleChange}
            formikTouched={formik.setFieldTouched}
            containerClass="my-3"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={formik.values.password}
            error={formik.errors.password}
            isTouched={formik.touched.password}
            onChange={formik.handleChange}
            formikTouched={formik.setFieldTouched}
            containerClass="my-3"
          />
          <div className="mt-10 flex justify-center">
            <Button
              disabled={!formik.dirty}
              type="submit"
              className="bg-primary"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
