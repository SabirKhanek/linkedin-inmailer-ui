import { MdOutlinePostAdd } from "react-icons/md";
import { GrSend } from "react-icons/gr";
import { useFormik } from "formik";

import * as Yup from "yup";
import { Input } from "../../components/input";
import { JSONBlock } from "../../components/json_block";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { axios } from "../../shared/axios-client";

export interface InmailRequestBody {
  subject: string;
  body: string;
  linkedInURL: string;
}

const linkedInProfileUrlRegex = /.*linkedin.com\/in\/([^\/?]+).*/;

const InmailRequestObjectSchema = Yup.object<InmailRequestBody>({
  subject: Yup.string()
    .required("Inmail subject is required field")
    .min(5, "Subject minimum length is 5"),
  body: Yup.string()
    .required("Inmail body is required")
    .min(20, "Body minimum length is 20"),
  linkedInURL: Yup.string()
    .url("Must be a valid URL")
    .required("Profile URL is required")
    .matches(linkedInProfileUrlRegex, "This is not a valid profile URL"),
});

const formRequestObjects = Yup.object<{ inmail_requests: InmailRequestBody[] }>(
  {
    inmail_requests: Yup.array(InmailRequestObjectSchema).min(1).required(),
  }
);

async function sendInMail(obj: InmailRequestBody) {
  const public_id = obj.linkedInURL.match(linkedInProfileUrlRegex)?.at(1);
  if (!public_id)
    throw new Error("Couldn't extract public id from profile Url");

  const res = await axios.post("/action/send_inmail", {
    public_id: public_id,
    subject: obj.subject,
    body: obj.body,
  });

  return res;
}

export function InMailer() {
  const [loading, setIsLoading] = useState(false);
  const [results, setResults] = useState<object[]>([{}]);
  const formik = useFormik({
    initialValues: {
      inmail_requests: [
        {
          body: "",
          linkedInURL: "",
          subject: "",
        },
      ] as InmailRequestBody[],
    } as unknown as {
      inmail_requests: InmailRequestBody[];
    },
    onSubmit: async (v) => {
      if (loading) return;
      setIsLoading(true);
      v.inmail_requests.forEach((_, i) => {
        setResult(i, { status: "QUEUED" });
      });
      try {
        for (let i = 0; i < v.inmail_requests.length; i++) {
          if (Object.keys(results.at(i) || {}).length === 0) {
            console.info(`Index ${i} ignored`);
          }

          const req = v.inmail_requests[i];
          setResult(i, { status: "In Progress..." });
          try {
            const res = await sendInMail(req);
            setResult(i, res.data);
          } catch (err: any) {
            setResult(i, { error: err.message || "Unknown Error" });
          }
        }
      } catch (err) {
        toast.error("Something went wrong. Check logs for details!");
      } finally {
        setIsLoading(false);
      }
    },
    validationSchema: formRequestObjects,
  });

  const addRequest = () => {
    const newObj: InmailRequestBody = {
      body: "",
      linkedInURL: "",
      subject: "",
    };
    formik.setFieldValue(
      "inmail_requests",
      JSON.parse(
        JSON.stringify([...(formik.values.inmail_requests || []), newObj])
      )
    );

    setResults((prevResults) => {
      return JSON.parse(JSON.stringify([...(prevResults || []), {}]));
    });
    // const formik.values.inmail_requests.push({subject: "", body: "", linkedInURL: ""})
  };

  const removeRequest = (index: number) => {
    const updatedRequests = [...formik.values.inmail_requests];
    updatedRequests.splice(index, 1);

    const updatedResult = [...results];
    updatedResult.splice(index, 1);

    setResults(updatedResult);
    formik.setFieldValue("inmail_requests", updatedRequests);
  };

  const setResult = (index: number, result: object) => {
    setResults((prevResults) => {
      const updatedResults = [...prevResults];
      updatedResults[index] = result;
      return updatedResults;
    });
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center">
        <h2 className="heading">LinkedIn Inmail Bot</h2>
        <div className="flex gap-2 items-center">
          <div
            onClick={() => addRequest()}
            className="tooltip cursor-pointer"
            data-tip="Add Recipient"
          >
            <MdOutlinePostAdd className="text-2xl" />
          </div>
          {!loading ? (
            <div
              onClick={() => formik.handleSubmit()}
              className="tooltip cursor-pointer"
              data-tip="Send Inmails"
            >
              <GrSend className="text-xl" />
            </div>
          ) : (
            <FaSpinner className="animate-spin" />
          )}
        </div>
      </div>
      {/* <JSONBlock json={formik.values} />
      <span className="block my-3"></span>
      <JSONBlock json={formik.errors} /> */}
      <form className="my-3 flex flex-col gap-2" onSubmit={formik.handleSubmit}>
        {(formik.values.inmail_requests || []).map((_, i) => {
          const requestObj = formik.values.inmail_requests[i];
          const fieldName = (name: string) => `inmail_requests.${i}.${name}`;
          const touched =
            formik.touched.inmail_requests && formik.touched.inmail_requests[i];
          const errors =
            formik.errors.inmail_requests &&
            (formik.errors.inmail_requests[i] as any);
          return (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h3 className="subheading">Request {i + 1}</h3>
                <div className="tooltip" data-tip="Delete this recipient">
                  <RiDeleteBin5Line
                    className="text-xl cursor-pointer"
                    onClick={() => removeRequest(i)}
                  ></RiDeleteBin5Line>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <Input
                  value={requestObj.linkedInURL}
                  name={fieldName("linkedInURL")}
                  formikTouched={formik.setFieldTouched}
                  isTouched={touched?.linkedInURL}
                  error={errors?.linkedInURL}
                  label="LinkedIn Profile URL"
                  placeholder="e.g., https://linkedin.com/in/devsabir"
                  onChange={formik.handleChange}
                  className="font-mono"
                  containerClass="basis-[40%] grow"
                ></Input>
                <div className="flex flex-col grow basis-[60%] gap-2">
                  <Input
                    value={requestObj.subject}
                    name={fieldName("subject")}
                    formikTouched={formik.setFieldTouched}
                    isTouched={touched?.subject}
                    error={errors?.subject || ""}
                    label="Subject"
                    placeholder="Enter InMail Subject"
                    onChange={formik.handleChange}
                    containerClass="w-full"
                  ></Input>
                  <Input
                    value={requestObj.body}
                    name={fieldName("body")}
                    formikTouched={formik.setFieldTouched}
                    isTouched={touched?.body}
                    error={errors?.body || ""}
                    label="Body"
                    textArea
                    placeholder="Enter InMail Body"
                    onChange={formik.handleChange}
                    containerClass="w-full"
                  ></Input>
                </div>
              </div>
              <JSONBlock json={results[i]} />
            </div>
          );
        })}
      </form>
    </div>
  );
}
