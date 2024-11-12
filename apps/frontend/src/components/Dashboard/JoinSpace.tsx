import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { JoinSpaceSchema } from "@repo/lib/zodTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postJoinSpace } from "@/lib/requests";
import { useState } from "react";
import { toast } from "sonner";

export const JoinSpace = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postJoinSpace,
    onSuccess: () => {
      toast.success("Space joined");
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.log(error);
    },
  });

  const form = useForm<z.infer<typeof JoinSpaceSchema>>({
    resolver: zodResolver(JoinSpaceSchema),
    defaultValues: {
      inviteURL: "",
    },
  });

  function onSubmit(values: z.infer<typeof JoinSpaceSchema>) {
    setIsOpen(false);
    mutation.mutate(values);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <ArrowUpRight />
          <span>Join Space</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join an existing Space</DialogTitle>
          <DialogDescription>
            You can join a space by pasting the invite URL below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="inviteURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invite URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter invite URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" className="">
                Join
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
