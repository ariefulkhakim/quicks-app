"use client";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Pencil } from "lucide-react";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import { useMutationState } from "@/hooks/useMutationState";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, formatISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Id } from "@/convex/_generated/dataModel";

type Props = {
  dueDate: string;
  description: string;
  title: string;
  status: string;
  taskId: Id<"tasks">;
};

const createGroupForm = z.object({
  title: z.string().min(1, { message: "This field can't be empty" }),
  description: z.string().min(1, { message: "This field can't be empty" }),
  dueDate: z.date().min(new Date(), { message: "You must select due date" }),
  status: z.string(),
});

const UpdateTask = ({ dueDate, description, title, status, taskId }: Props) => {
  const [edited, setEdited] = useState(false);
  const { mutate: updateTask, pending } = useMutationState(
    api.tasks.updateTask
  );

  const form = useForm<z.infer<typeof createGroupForm>>({
    resolver: zodResolver(createGroupForm),
    defaultValues: {
      title,
      description,
      dueDate: new Date(dueDate),
      status,
    },
  });

  const handleSubmit = async (values: z.infer<typeof createGroupForm>) => {
    await updateTask({
      dueDate: formatISO(values.dueDate),
      title: values.title,
      description: values.description,
      status: values.status,
      taskId,
    })
      .then(() => {
        toast.success("Task updated");
        setEdited(false);
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError
            ? error.data
            : "Unexpected error occurred"
        );
      });
  };
  const [open, setOpen] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        {/* <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Type title your task...." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex space-x-2 w-full">
              <CalendarIcon
                size={20}
                className="mt-3 cursor-pointer"
                onClick={() => setEdited(true)}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={!edited}
                    >
                      {field.value ? (
                        format(field.value, "dd MMM yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex space-x-2">
              <Pencil
                size={20}
                className="mt-3 cursor-pointer"
                onClick={() => setEdited(true)}
              />
              <FormControl>
                <Textarea
                  placeholder="Make your description for your task....."
                  className="resize-none"
                  disabled={!edited}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {edited && (
          <div className="flex space-x-3">
            <Button className="w-32 my-3 mt-2" type="submit" disabled={pending}>
              Update
            </Button>
            <Button
              className="w-32 my-3 mt-2"
              type="button"
              disabled={pending}
              variant={"outline"}
              onClick={() => setEdited(false)}
            >
              Batal
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default UpdateTask;
