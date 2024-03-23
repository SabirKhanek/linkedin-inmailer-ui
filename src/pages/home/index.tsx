import { Link } from "react-router-dom";
import { RiMailSendLine } from "react-icons/ri";

export function HomePage() {
  return (
    <div className="p-5">
      <h2 className="heading">Available Tools</h2>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <Link
          to={"/tools/inmailer"}
          className="rounded-2xl w-full h-full text-black aspect-[1/0.75] border-label border flex flex-col gap-3 justify-center items-center cursor-pointer hover:scale-105 transition-all duration-300  hover:bg-bdr group"
        >
          <RiMailSendLine className="text-3xl" />
          <h3 className="font-medium text-lg text-black">LinkedIn Inmailer</h3>
        </Link>
      </div>
    </div>
  );
}
