"use client";
import React, { useState } from "react";
import HeaderDetail from "./detail/HeaderDetail";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { LoaderCircle } from "lucide-react";
import BodyDetail from "./detail/BodyDetail";
import ChatInput from "./detail/ChatInput";
import DialogRemoveFriend from "./detail/DialogRemoveFriend";
import DialogRemoveGroup from "./detail/DialogRemoveGroup";
import { removeGroup } from "@/convex/conversation";
import DialogLeaveGroup from "./detail/DialogLeaveGroup";

type Props = {
  id: Id<"conversations">;
  onBack: (v: Id<"conversations">) => void;
};

const DetailInbox = ({ id, onBack }: Props) => {
  const conversation = useQuery(api.conversation.get, { id: id });
  const [removeFriendOpen, setRemoveFriendOpen] = useState(false);
  const [deleteGroupOpen, setDeleteGroupOpen] = useState(false);
  const [leaveGroupOpen, setLeaveGroupOpen] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);
  return (
    <>
      {conversation === undefined ? (
        <div className="flex h-full justify-center items-center">
          <LoaderCircle className="animate-spin" />
        </div>
      ) : conversation === null ? (
        <div className="flex h-full justify-center items-center">
          <p>Conversation not found</p>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <DialogRemoveFriend
            id={id}
            open={removeFriendOpen}
            setOpen={setRemoveFriendOpen}
            onBack={onBack}
          />
          <DialogRemoveGroup
            id={id}
            open={deleteGroupOpen}
            setOpen={setDeleteGroupOpen}
            onBack={onBack}
          />
          <DialogLeaveGroup
            id={id}
            open={leaveGroupOpen}
            setOpen={setLeaveGroupOpen}
            onBack={onBack}
          />
          <HeaderDetail
            imageUrl={
              conversation.isGroup
                ? undefined
                : conversation.otherMember!.imageurl
            }
            name={
              (conversation.isGroup
                ? conversation.name
                : conversation?.otherMember!.username) || ""
            }
            onBack={onBack}
            options={
              conversation.isGroup
                ? [
                    {
                      label: "Leave Group",
                      destructive: false,
                      onClick() {
                        setLeaveGroupOpen(true);
                      },
                    },
                    {
                      label: "Delete Group",
                      destructive: true,
                      onClick() {
                        setDeleteGroupOpen(true);
                      },
                    },
                  ]
                : [
                    {
                      label: "Remove Friend",
                      destructive: true,
                      onClick() {
                        setRemoveFriendOpen(true);
                      },
                    },
                  ]
            }
          />
          <BodyDetail
            id={id}
            members={
              conversation.isGroup
                ? conversation.otherMembers
                  ? conversation.otherMembers
                  : []
                : conversation.otherMember
                  ? [conversation.otherMember]
                  : []
            }
          />
          <ChatInput id={id} />
        </div>
      )}
    </>
  );
};

export default DetailInbox;
