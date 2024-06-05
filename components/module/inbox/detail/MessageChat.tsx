import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  fromCurrentUser: boolean;
  senderImage: string;
  senderName: string;
  lastByUser: boolean;
  content: string[];
  createdAt: number;
  type: string;
  seen?: React.ReactNode;
};

const MessageChat = (props: Props) => {
  const formatTime = (timestamp: number) => {
    return format(timestamp, "HH:mm");
  };
  return (
    <div
      className={cn("flex items-end", {
        "justify-end": props.fromCurrentUser,
      })}
    >
      <div
        className={cn("flex flex-col w-full mx-2", {
          "order-1 items-end": props.fromCurrentUser,
          "order-2 items-start": !props.fromCurrentUser,
        })}
      >
        <p className="mb-[5px] capitalize">
          {props.fromCurrentUser ? "You" : props.senderName}
        </p>
        <div
          className={cn("px-4 py-2 rounded-lg max-w-[70%]", {
            "bg-primary text-primary-foreground": props.fromCurrentUser,
            "bg-secondary text-secondary-foreground": !props.fromCurrentUser,
            "rounded-br-none": !props.lastByUser && props.fromCurrentUser,
            "rounded-bl-none": !props.lastByUser && !props.fromCurrentUser,
          })}
        >
          {props.type === "text" ? (
            <p className="text-wrap break-words whitespace-pre-wrap break-all">
              {props.content}
            </p>
          ) : null}

          <p
            className={cn("text-xs flex w-full my-1", {
              "text-primary-foreground justify-end": props.fromCurrentUser,
              "text-secondry-foreground justify-start": !props.fromCurrentUser,
            })}
          >
            {formatTime(props.createdAt)}
          </p>
        </div>
        {props.seen}
      </div>

      <Avatar
        className={cn("relative w-8 h-8", {
          "order-2": props.fromCurrentUser,
          "order-1": !props.fromCurrentUser,
          invisible: props.lastByUser,
        })}
      >
        <AvatarImage src={props.senderImage} />
        <AvatarFallback>{props.senderName.substring(0, 1)}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default MessageChat;
