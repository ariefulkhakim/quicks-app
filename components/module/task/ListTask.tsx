"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import AddTask from "./AddTask";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import DateDisplay from "@/utils/format";
import {
  Calendar,
  EllipsisVertical,
  LoaderCircle,
  Search,
  X,
} from "lucide-react";
import UpdateTask from "./UpdateTask";
import { useMutationState } from "@/hooks/useMutationState";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Props = {};

interface PropsTask {
  dueDate: string;
  description: string;
  title: string;
  status: string;
  taskId: Id<"tasks">;
}

const ListTask = (props: Props) => {
  const [statusTask, setStatusTask] = useState("");
  const [valueSearch, setValueSearch] = useState("");
  const [value, setValue] = useState("");
  const listTask = useQuery(api.tasks.get, {
    status: statusTask === "semua" ? "" : statusTask,
    title: valueSearch,
  });
  const { mutate: updateTask, pending } = useMutationState(
    api.tasks.updateTask
  );

  const { mutate: deleteTask, pending: deletePending } = useMutationState(
    api.tasks.deleteTask
  );

  const handleDeleteTask = async (id: Id<"tasks">) => {
    await deleteTask({
      taskId: id,
    })
      .then(() => {
        toast.success(`Task deleted`);
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError
            ? error.data
            : "Unexpected error occurred"
        );
      });
  };

  const handleSubmit = async (values: PropsTask) => {
    await updateTask({
      dueDate: values.dueDate,
      title: values.title,
      description: values.description,
      status: values.status,
      taskId: values.taskId,
    })
      .then(() => {
        toast.success(`Task updated to ${values.status}`);
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError
            ? error.data
            : "Unexpected error occurred"
        );
      });
  };
  console.log(valueSearch);
  return (
    <>
      <div className="flex justify-between p-4 items-center border-b border-solid border-b-slate-200 space-x-4">
        <div className="flex space-x-6 items-center flex-1">
          <p className="text-2xl font-bold">Task</p>
          <div className="flex space-x-1">
            <div className="w-full relative">
              <Input
                type="text"
                placeholder="Search your task....."
                className="focus:border-transparent w-[300px]"
                onChange={(e) => setValue(e.target.value)}
                value={value}
              />
              {value !== "" && (
                <X
                  onClick={() => {
                    setValue("");
                    setValueSearch("");
                  }}
                  className="absolute top-0 h-full right-3 w-4 cursor-pointer"
                />
              )}
            </div>
            <Button
              size={"icon"}
              variant={"default"}
              onClick={() => setValueSearch(value)}
            >
              <Search size={20} />
            </Button>
          </div>
          <Select defaultValue="semua" onValueChange={setStatusTask}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status Task" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="semua">All Status</SelectItem>
                <SelectItem value="pending">Uncompleted</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                {/* <SelectItem value="overdue">Overdue</SelectItem> */}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <AddTask />
        </div>
      </div>
      <div className="p-4 pt-4">
        {listTask ? (
          <>
            {listTask.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {listTask.map((item, key) => (
                  <Card
                    key={key}
                    className="flex items-start space-x-3 px-3 mb-3"
                  >
                    <Checkbox
                      className="mt-5"
                      checked={item.status !== "pending" ? true : false}
                      onCheckedChange={(e) =>
                        handleSubmit({
                          title: item.title,
                          description: item.description!,
                          dueDate: item.dueDate,
                          status: e === true ? "completed" : "pending",
                          taskId: item._id,
                        })
                      }
                      disabled={pending}
                    />
                    <AccordionItem
                      value={item._id}
                      className="border-b-0 w-full"
                    >
                      <AccordionTrigger className="hover:no-underline space-x-3">
                        <div className="flex flex-1 justify-between">
                          <p
                            className={`${item.status === "pending" ? "no-underline" : "line-through"}`}
                          >
                            {item.title}
                          </p>
                          <DateDisplay
                            isoDate={item.dueDate}
                            status={item.status}
                          />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div>
                          <UpdateTask
                            title={item.title}
                            description={item.description!}
                            dueDate={item.dueDate}
                            status={item.status}
                            taskId={item._id}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical className="mt-[15px]" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            handleDeleteTask(item._id);
                          }}
                          className="text-destructive"
                        >
                          Delete Task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Card>
                ))}
              </Accordion>
            ) : (
              <div className="h-auto flex justify-center items-center">
                <p>No Task</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full justify-center items-center">
            <LoaderCircle className="animate-spin" />
          </div>
        )}
      </div>
    </>
  );
};

export default ListTask;
