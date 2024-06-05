import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useMemo, useState } from "react";
import { z } from "zod";
import { useQuery } from "convex/react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const createGroupForm = z.object({
  name: z.string().min(1, { message: "This field can't be empty" }),
  members: z
    .string()
    .array()
    .min(1, { message: "You must select at least 1 friend" }),
});

const AddInbox = ({ open, setOpen }: Props) => {
  const friends = useQuery(api.friends.get);

  const { mutate: createChat, pending } = useMutationState(
    api.conversation.createChat
  );

  const form = useForm<z.infer<typeof createGroupForm>>({
    resolver: zodResolver(createGroupForm),
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const members = form.watch("members", []);

  const unselectedFriends = useMemo(() => {
    return friends
      ? friends.filter((friend) => !members.includes(friend._id))
      : [];
  }, [friends, members]);

  const handleSubmit = async (values: z.infer<typeof createGroupForm>) => {
    await createChat({
      name: values.name,
      members: values.members,
    })
      .then(() => {
        form.reset();
        toast.success("Group created");
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError
            ? error.data
            : "Unexpected error occurred"
        );
      });
  };

  //Personal
  const [openPersonal, setOpenPersonal] = useState(false);
  const [valuePersonal, setValuePersonal] = useState("");

  //Group
  const [openGroup, setOpenGroup] = useState(false);
  const [valueGroup, setValueGroup] = useState("");

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <div className="p-1">
          <AlertDialogHeader className="text-center mb-6">
            <AlertDialogTitle className="mb-0 font-bold text-slate-950 flex justify-between">
              <p>Create group</p>
              <X
                className="w-5 h-5 cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
              />
            </AlertDialogTitle>
            <AlertDialogDescription>
              Add your friends to get started!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Group name...." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="members"
                render={() => (
                  <FormItem>
                    <FormLabel>Members</FormLabel>
                    <FormControl>
                      <Popover open={openGroup} onOpenChange={setOpenGroup}>
                        <PopoverTrigger className="w-full" asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            Select Friends
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[360px] p-0">
                          <Command className="w-full">
                            <CommandInput placeholder={`Search Friends...`} />
                            <CommandEmpty>No Friends.</CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                {unselectedFriends?.map((item, id) => (
                                  <CommandItem
                                    key={id}
                                    value={item._id}
                                    onSelect={(currentValue) => {
                                      setValueGroup(
                                        currentValue === valueGroup
                                          ? ""
                                          : currentValue
                                      );
                                      form.setValue("members", [
                                        ...members,
                                        item._id,
                                      ]);
                                      setOpenGroup(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        valueGroup === item.username
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {item.username}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {members && members.length ? (
                <Card className="flex items-center gap-3 overflow-x-auto w-full h-24 p-2 no-scrollbar">
                  {friends
                    ?.filter((item) => members.includes(item._id))
                    .map((friend, index) => {
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-1 border border-slate-200 rounded-sm p-2"
                        >
                          <p>{friend.username}</p>
                          <X
                            className="h-4 w-4 cursor-pointer"
                            onClick={() =>
                              form.setValue(
                                "members",
                                members.filter((id) => id !== friend._id)
                              )
                            }
                          />
                        </div>
                      );
                    })}
                </Card>
              ) : null}
              <AlertDialogFooter>
                <Button
                  className="w-full my-3 mt-5"
                  type="submit"
                  disabled={pending}
                >
                  Create
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddInbox;
