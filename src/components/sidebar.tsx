import { MdOutlineCancel } from "react-icons/md";
import { FaArrowRightLong, FaGear } from "react-icons/fa6";
import { TbSettingsAutomation } from "react-icons/tb";

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
export interface ToolsSidebarProps {
  className?: string;
  handleClose?: () => void;
}
export function Sidebar({ className, handleClose }: ToolsSidebarProps) {
  const pathname = useLocation().pathname;
  const [expanded, setExpanded] = useState<number | null>(null);
  useEffect(() => {
    const expandedId = toolsList.findIndex((tool) => {
      return tool.sublinks
        .map((sublink) => sublink.src)
        .join(" ; ")
        .includes(pathname);
    });
    if (expanded !== expandedId) setExpanded(expandedId);
  }, []);
  return (
    <div
      className={`${className} p-5 py-5 ${
        !handleClose && "shadow"
      } rounded-2xl min-h-[80vh]`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-primary font-semibold text-xl">Menu</h2>
        {handleClose && (
          <span onClick={() => handleClose()}>
            <MdOutlineCancel className="text-primary text-lg" />
          </span>
        )}
      </div>
      {toolsList.map((val, index) => {
        const isExpanded = expanded === index;
        return (
          <div key={index}>
            <div
              className={`border-b border-[#DADADA] py-2 flex items-center gap-3 text-black/70 cursor-pointer transition-all duration-150 ${
                isExpanded && "text-primary"
              }`}
              onClick={() => {
                if (isExpanded) setExpanded(null);
                else setExpanded(index);
              }}
            >
              <val.icon />
              <span className="font-semibold">{val.name}</span>
            </div>

            <div
              className={`h-fit max-h-[1000px] transition-all ease-in-out duration-500 overflow-hidden ${
                !isExpanded ? "!max-h-0" : ""
              }`}
            >
              {val.sublinks.map((sublink, index) => {
                const isActivePath = pathname.includes(sublink.src);
                return (
                  <Link key={index} to={sublink.src}>
                    <div
                      className={`ml-4 flex items-center gap-3 text-[#969696] text-sm font-semibold hover:text-primary my-2 ${
                        isActivePath && "!text-primary"
                      }`}
                    >
                      <FaArrowRightLong />
                      {sublink.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const toolsList = [
  {
    name: "Tools",
    icon: TbSettingsAutomation,
    sublinks: [
      {
        name: "All Tools",
        src: "/",
      },
      {
        name: "Auto Inmails",
        src: "/tools/inmailer",
      },
    ],
  },
  {
    name: "Settings",
    icon: FaGear,
    sublinks: [
      { name: "Session Cookies", src: "/session" },
      { name: "Add User", src: "/add_user" },
    ],
  },
];
