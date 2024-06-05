"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import Request from "./components/Request";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddFriendDialog from "./components/AddFriendDialog";
import { Badge } from "@/components/ui/badge";
import ListFriend from "./components/ListFriend";
import { Loader, LoaderCircle } from "lucide-react";

type Props = {};

const FriendsPage = (props: Props) => {
  const request = useQuery(api.requests.get);
  const count = useQuery(api.requests.count);
  const friends = useQuery(api.friends.get);
  return (
    <>
      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="request" className="flex space-x-2">
            <p>Request</p>
            <Badge>{count}</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="friends" className="mt-5">
          <div className="flex justify-between items-center mb-5">
            <p className="font-bold text-2xl">List Friends</p>
            <AddFriendDialog />
          </div>
          <div>
            {friends ? (
              friends.length === 0 ? (
                <div>No Friend</div>
              ) : (
                <>
                  {friends.map((items, key) => (
                    <ListFriend
                      key={key}
                      email={items.email}
                      imageUrl={items.imageurl}
                      username={items.username}
                    />
                  ))}
                </>
              )
            ) : (
              <div className="flex h-full justify-center items-center">
                <LoaderCircle className="animate-spin" />
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="request" className="mt-5">
          <div>
            {request ? (
              request.length === 0 ? (
                <div>Not Requested Friend</div>
              ) : (
                <>
                  {request.map((items, key) => (
                    <Request
                      key={key}
                      id={items.request._id}
                      email={items.sender.email}
                      imageUrl={items.sender.imageurl}
                      username={items.sender.username}
                    />
                  ))}
                </>
              )
            ) : (
              <p>Loading.....</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default FriendsPage;
