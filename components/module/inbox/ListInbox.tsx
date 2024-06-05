"use client";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LoaderCircle, PlusCircle, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import AddInbox from "./AddInbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddGroup from "./AddGroup";

type Props = {
  onDetail: (v: Id<"conversations">) => void;
};

const ListInbox = ({ onDetail }: Props) => {
  const conversations = useQuery(api.conversations.get);
  const [addChat, setAddChat] = useState(false);
  const [addGroup, setAddGroup] = useState(false);
  return (
    <div>
      <div className="flex justify-between p-4 items-center border-b border-solid border-b-slate-200">
        <div className="flex space-x-4 items-center w-[500px]">
          <p className="text-2xl font-bold">Inbox</p>
          <Input type="text" placeholder="Cari Obrolan Anda....." />
        </div>
        <div>
          <div>
            <PlusCircle onClick={() => setAddGroup(true)} />
          </div>

          {/* <DropdownMenu>
            <DropdownMenuTrigger>
              
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => setAddChat(true)}
                className="font-semibold"
              >
                Add Chat
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setAddGroup(true)}
                className="font-semibold"
              >
                Add Group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
      <div className="p-4 pt-4">
        {conversations ? (
          conversations.length === 0 ? (
            <div>No conversations found.</div>
          ) : (
            <>
              {conversations.map((items, key) => (
                <>
                  {items.conversation.isGroup ? (
                    <Card
                      onClick={() => onDetail(items.conversation._id)}
                      className="w-full p-2 flex flex-row items-center justify-between gap-2 mb-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-4 truncate">
                        <Avatar>
                          <AvatarFallback>
                            {items.conversation.name
                              ?.charAt(0)
                              .toLocaleUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                          <h4 className="truncate">
                            {" "}
                            {items.conversation.name}
                          </h4>
                          {items.lastMessage?.content &&
                          items.lastMessage.sender ? (
                            <span className="text-xs text-muted-foreground flex overflow-ellipsis truncate">
                              <p className="font-semibold">
                                {items.lastMessage.sender}
                                {":"}&nbsp;
                              </p>
                              <p className="truncate overflow-ellipsis">
                                {items.lastMessage.content}
                              </p>
                            </span>
                          ) : (
                            <p className="text-xs text-muted-foreground truncate">
                              Start the conversations!
                            </p>
                          )}
                        </div>
                      </div>
                      {items.unseenCount ? (
                        <Badge>{items.unseenCount}</Badge>
                      ) : null}
                    </Card>
                  ) : (
                    <Card
                      onClick={() => onDetail(items.conversation._id)}
                      className="w-full p-2 flex flex-row items-center justify-between gap-2 mb-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-4 truncate">
                        <Avatar>
                          <AvatarImage src={items.otherMember?.imageurl} />
                          <AvatarFallback>
                            <User />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                          <h4 className="truncate">
                            {" "}
                            {items.otherMember?.username}
                          </h4>
                          {items.lastMessage?.content &&
                          items.lastMessage.sender ? (
                            <span className="text-xs text-muted-foreground flex overflow-ellipsis truncate">
                              <p className="font-semibold">
                                {items.lastMessage.sender}
                                {":"}&nbsp;
                              </p>
                              <p className="truncate overflow-ellipsis">
                                {items.lastMessage.content}
                              </p>
                            </span>
                          ) : (
                            <p className="text-xs text-muted-foreground truncate">
                              Start the conversations!
                            </p>
                          )}
                        </div>
                      </div>
                      {items.unseenCount ? (
                        <Badge>{items.unseenCount}</Badge>
                      ) : null}
                    </Card>
                  )}
                </>
              ))}
            </>
          )
        ) : (
          <div className="flex h-full justify-center items-center">
            <LoaderCircle className="animate-spin" />
          </div>
        )}
      </div>
      <div className="h-full">
        <AddInbox open={addChat} setOpen={setAddChat} />
        <AddGroup open={addGroup} setOpen={setAddGroup} />
      </div>
    </div>
  );
};

export default ListInbox;
