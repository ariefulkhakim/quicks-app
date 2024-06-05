"use client";
import { useState } from "react";
import ListInbox from "./ListInbox";
import DetailInbox from "./DetailInbox";
import { Id } from "@/convex/_generated/dataModel";

type Props = {};

const AllComponentInbox = (props: Props) => {
  const [id, setId] = useState<Id<"conversations">>();

  const onDetailInbox = (param: Id<"conversations">) => {
    setId(param);
  };
  return (
    <>
      {id === "" || id === undefined ? (
        <ListInbox onDetail={onDetailInbox} />
      ) : (
        <DetailInbox id={id!} onBack={onDetailInbox} />
      )}
    </>
  );
};

export default AllComponentInbox;
