import { useFormik } from "formik";
import { Input } from "../../../components/input";
import * as Yup from "yup";
import { Button } from "../../../components/button";
import { useState } from "react";
import { toast } from "react-toastify";
import { axios } from "../../../shared/axios-client";
export function AddUser({}) {
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      new_username: "",
      new_password: "",
      secret: "",
    },
    onSubmit: async (v) => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const newUserRes = await axios.post("/admin/adduser", {
          username: v.new_username,
          password: v.new_password,
          secret: v.secret,
        });
        if (newUserRes.status === 200) {
          toast(`User {${v.new_username}} was added!`);
        } else {
          toast.error(
            (newUserRes.data.detail && newUserRes.data.detail?.at(0)?.msg) ||
              newUserRes.data.detail ||
              `Server returned ${newUserRes.status}`
          );
        }
      } catch (err: any) {
        console.error(err);
        toast.error("Something went wrong! Check the logs");
      } finally {
        setIsLoading(false);
      }
    },
    validationSchema: Yup.object({
      new_username: Yup.string().required().min(4),
      new_password: Yup.string().required().min(4),
      secret: Yup.string().required(),
    }),
  });
  return (
    <div className="p-5">
      <h2 className="heading">Add User</h2>
      <form onSubmit={formik.handleSubmit} className="my-3">
        <Input
          name="new_username"
          label="Username"
          containerClass="my-2"
          error={formik.errors.new_username}
          isTouched={formik.touched.new_username}
          onChange={formik.handleChange}
          placeholder="Enter new user's username"
          formikTouched={formik.setFieldTouched}
          value={formik.values.new_username}
        ></Input>
        <Input
          name="new_password"
          label="Password"
          containerClass="my-2"
          error={formik.errors.new_password}
          isTouched={formik.touched.new_password}
          onChange={formik.handleChange}
          placeholder="Enter new user's password"
          formikTouched={formik.setFieldTouched}
          value={formik.values.new_password}
        ></Input>
        <Input
          name="secret"
          label="Secret"
          containerClass="my-2"
          type="password"
          error={formik.errors.secret}
          isTouched={formik.touched.secret}
          onChange={formik.handleChange}
          placeholder="Enter authorization secret"
          formikTouched={formik.setFieldTouched}
          value={formik.values.secret}
        ></Input>
        <Button
          isLoading={isLoading}
          type="submit"
          className="disabled:cursor-not-allowed !rounded-lg bg-primary"
          disabled={Object.keys(formik.errors).length > 0}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
