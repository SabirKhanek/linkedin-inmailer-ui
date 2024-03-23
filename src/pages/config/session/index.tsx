import { useFormik } from "formik";
import { Input } from "../../../components/input";
import * as Yup from "yup";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/button";
import { toast } from "react-toastify";
import { axios } from "../../../shared/axios-client";
import { JSONBlock } from "../../../components/json_block";

const cookieStringRegex = /\s*([^=]+)=([^;]+)(?:\s*;\s*([^=]+)=([^;]+))*\s*/;
const jsessionIdRegex = /\s*JSESSIONID=([^;]+)(?:\s*;\s*([^=]+)=([^;]+))*\s*/;
const li_atRegex = /\s*li_at=([^;]+)(?:\s*;\s*([^=]+)=([^;]+))*\s*/;

const cookieValidationSchema = Yup.object({
  session_cookies: Yup.string()
    .trim()
    .matches(cookieStringRegex, "Not a valid cookie string")
    .matches(
      jsessionIdRegex,
      "Cookie seems invalid because JSESSIONID cookie is missing"
    )
    .matches(li_atRegex, "Cookie seems invalid because li_at cookie is missing")
    .required("LinkedIn Session cookie is required"),
});

function parseCookieString(cookieString: string): { [key: string]: string } {
  const testResult = cookieStringRegex.test(cookieString);
  if (!testResult) return {};
  const cookieDict: { [key: string]: string } = {};
  const cookies: string[] = cookieString.split(";").map((ck) => ck.trim());
  for (const cookie of cookies) {
    const equalSignIndex = cookie.indexOf("=");
    if (equalSignIndex !== -1) {
      const key = cookie.substring(0, equalSignIndex).trim();
      const value = cookie.substring(equalSignIndex + 1).trim();
      cookieDict[key] = value;
    } else {
      // Handle case where no equal sign is found
      cookieDict[cookie.trim()] = ""; // Assign an empty string as value
    }
  }
  return cookieDict || {};
}

function stringifyCookie(cookieDict: { [key: string]: string }): string {
  return Object.entries(cookieDict)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
}


export function ConfigureSession() {
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      session_cookies: "",
    },
    onSubmit: async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const resObj = await axios.post("/user/setsession", {
          cookie: cookieObject,
        });
        const data = resObj.data;
        if (resObj.status === 200 && data.cookie) {
          formik.setFieldValue("session_cookies", stringifyCookie(data.cookie));
          toast("Cookies were updated");
        } else {
          toast.error(
            (data.detail && data.detail?.at(0)?.msg) ||
              data.detail ||
              `Server returned ${resObj.status}`
          );
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong! check logs");
      } finally {
        setIsLoading(false);
      }
    },
    validationSchema: cookieValidationSchema,
  });

  const cookieObject = useMemo(() => {
    return parseCookieString(formik.values.session_cookies);
  }, [formik.values.session_cookies]);


  const fetchUserObj = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const resObj = await axios.get("/user/me");
      const data = resObj.data;
      if (resObj.status === 200 && data.cookie) {
        formik.setFieldValue("session_cookies", stringifyCookie(data.cookie));
      } else {
        toast.error(
          (data.detail && data.detail?.at(0)?.msg) ||
            data.detail ||
            `Server returned ${resObj.status}`
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong! check logs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserObj();
  }, []);

  return (
    <div className="p-5">
      <h2 className="heading">Configure LinkedIn Session</h2>
      <form
        onSubmit={formik.handleSubmit}
        style={{
          alignItems:
            Object.keys(formik.errors).length > 0 &&
            formik.touched.session_cookies
              ? "center"
              : "end",
        }}
        className="my-5 flex items-center w-full gap-6"
      >
        <Input
          value={formik.values.session_cookies}
          name="session_cookies"
          onChange={formik.handleChange}
          placeholder="Enter your premium LinkedIn account's session cookies"
          error={formik.errors.session_cookies}
          formikTouched={formik.setFieldTouched}
          label="LinkedIn Session Cookies"
          isTouched={formik.touched.session_cookies}
          className="font-mono"
          containerClass="grow"
        ></Input>
        <Button
          type="submit"
          className="bg-primary text-sm !rounded-lg disabled:cursor-not-allowed"
          disabled={isLoading || Object.keys(formik.errors).length > 0}
          isLoading={isLoading}
        >
          Submit
        </Button>
      </form>
      <JSONBlock json={cookieObject}/>
    </div>
  );
}
