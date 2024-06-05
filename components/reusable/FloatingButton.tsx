import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { BookOpenCheck, MessagesSquare } from "lucide-react";
import IconAdd from "@/public/assets/icons/iconAdd.svg";
import Image from "next/image";
import React from "react";
import AllComponentInbox from "../module/inbox/Index";
import AllComponentTask from "../module/task";

type Props = {};

const FloatingButton = (props: Props) => {
  return (
    <div className="absolute bottom-8 right-8 z-50 w-1/6 h-auto flex justify-end">
      <Popover>
        <PopoverTrigger asChild>
          <Image src={IconAdd} alt="img-add" className="cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent
          side="left"
          className="w-40 flex justify-end  border-none shadow-none PopoverContent"
        >
          <div className="flex space-x-3 bg-transparent">
            <Popover>
              <Tooltip delayDuration={100}>
                <PopoverTrigger asChild>
                  <TooltipTrigger asChild>
                    <div className="w-12 h-12 flex justify-center items-center rounded-full border border-solid border-slate-200 cursor-pointer">
                      <BookOpenCheck />
                    </div>
                  </TooltipTrigger>
                </PopoverTrigger>
                <TooltipContent
                  sideOffset={-3}
                  className="flex items-center border-none shadow-none -ml-6 bg-transparent"
                >
                  <p>Task</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent
                sideOffset={25}
                side="top"
                className="w-[800px] h-[680px] mr-10 PopoverContent p-0"
              >
                <AllComponentTask />
              </PopoverContent>
            </Popover>
            <Popover>
              <Tooltip delayDuration={100}>
                <PopoverTrigger asChild>
                  <TooltipTrigger asChild>
                    <div className="w-12 h-12 flex justify-center items-center rounded-full border border-solid border-slate-200 cursor-pointer">
                      <MessagesSquare />
                    </div>
                  </TooltipTrigger>
                </PopoverTrigger>

                <TooltipContent
                  sideOffset={-3}
                  className="flex items-center border-none shadow-none -ml-6 bg-transparent"
                >
                  <p>Inbox</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent
                sideOffset={25}
                side="top"
                className="w-[800px] h-[680px] mr-10 PopoverContent p-0"
              >
                <AllComponentInbox />
              </PopoverContent>
            </Popover>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FloatingButton;
