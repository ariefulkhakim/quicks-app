"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React, { useEffect } from "react";
import MessageChat from "./MessageChat";
import { useMutationState } from "@/hooks/useMutationState";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  id: Id<"conversations">;
  members: {
    lastSeenMessageId?: Id<"messages">;
    username?: string;
    [key: string]: any;
  }[];
};

const BodyDetail = ({ id, members }: Props) => {
  const messages = useQuery(api.messages.get, {
    id: id,
  });

  const { mutate: markRead } = useMutationState(api.conversation.markRead);

  useEffect(() => {
    if (messages && messages.length > 0) {
      markRead({
        conversationId: id,
        messageId: messages[0].message._id,
      });
    }
  }, [id, markRead, messages]);

  const formatSeenBy = (names: string[]) => {
    switch (names.length) {
      case 1:
        return (
          <p className="text-muted-foreground text-sm text-right">{`Seen by ${names[0]}`}</p>
        );
      case 2:
        return (
          <p className="text-muted-foreground text-sm text-right">{`Seen by ${names[0]} and ${names[1]}`}</p>
        );
      default:
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <p className="text-muted-foreground text-sm text-right">{`Seen by ${names[0]}, ${names[1]}, and ${names.length - 2} more`}</p>
              </TooltipTrigger>
              <TooltipContent>
                <ul>
                  {names.map((name, index) => {
                    return <li key={index}>{name}</li>;
                  })}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
    }
  };

  const getSeenMessage = (messageId: Id<"messages">) => {
    const seenUsers = members
      .filter((member) => member.lastSeenMessageId === messageId)
      .map((user) => user.username!.split(" ")[0]);
    if (seenUsers.length === 0) {
      return undefined;
    }

    return formatSeenBy(seenUsers);
  };

  return (
    <div className="flex-1 w-full flex overflow-y-scroll flex-col-reverse gap-2 p-3 no-scrollbar">
      {messages?.map(
        ({ message, senderImage, senderName, isCurrentUser }, index) => {
          const lastByUser =
            messages[index - 1]?.message.senderId ===
            messages[index]?.message.senderId;

          const seenMessage = isCurrentUser
            ? getSeenMessage(message._id)
            : undefined;
          return (
            <MessageChat
              key={message._id}
              senderImage={senderImage}
              senderName={senderName}
              fromCurrentUser={isCurrentUser}
              lastByUser={lastByUser}
              content={message.content}
              createdAt={message._creationTime}
              type={message.type}
              seen={seenMessage}
            />
          );
        }
      )}
    </div>
  );
};

export default BodyDetail;
