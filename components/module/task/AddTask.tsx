import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useMemo, useState } from "react";
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
  FormLabel,
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

type Props = {};

const createGroupForm = z.object({
  title: z.string().min(1, { message: "This field can't be empty" }),
  description: z.string().min(1, { message: "This field can't be empty" }),
  dueDate: z.date().min(new Date(), { message: "You must select due date" }),
  status: z.string(),
});

const AddTask = (props: Props) => {
  const { mutate: createTask, pending } = useMutationState(
    api.tasks.createTask
  );

  const form = useForm<z.infer<typeof createGroupForm>>({
    resolver: zodResolver(createGroupForm),
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date(),
      status: "pending",
    },
  });

  const handleSubmit = async (values: z.infer<typeof createGroupForm>) => {
    await createTask({
      dueDate: formatISO(values.dueDate),
      title: values.title,
      description: values.description,
      status: values.status,
    })
      .then(() => {
        form.reset();
        toast.success("Task created");
        setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"}>Add Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-center mb-2">
          <DialogTitle className="mb-0 font-bold text-slate-950 flex justify-between">
            <p>Create Task</p>
          </DialogTitle>
          <DialogDescription>Add your task to get started!</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
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
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
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
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Make your description for your task....."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                className="w-full my-3 mt-5"
                type="submit"
                disabled={pending}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTask;
