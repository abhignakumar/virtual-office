import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateSpaceSchema } from "@repo/lib/zodTypes";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMaps, postCreateSpace } from "@/lib/requests";
import { useState } from "react";
import { toast } from "sonner";

export const CreateSpace = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: ["maps"],
    queryFn: getMaps,
  });

  const mutation = useMutation({
    mutationFn: postCreateSpace,
    onSuccess: () => {
      toast.success("Space created");
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.log(error);
    },
  });

  const form = useForm<z.infer<typeof CreateSpaceSchema>>({
    resolver: zodResolver(CreateSpaceSchema),
    defaultValues: {
      name: "",
      mapId: "",
    },
  });

  function onSubmit(values: z.infer<typeof CreateSpaceSchema>) {
    setIsOpen(false);
    mutation.mutate(values);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          <span>Create Space</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Space</DialogTitle>
          <DialogDescription>
            You can create a space by selecting a map below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Space Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a space name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mapId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Map</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      disabled={field.disabled}
                      name={field.name}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Map" />
                      </SelectTrigger>
                      <SelectContent>
                        {isPending ? (
                          <div className="flex justify-center items-center p-1">
                            <Loader className="animate-spin" />
                          </div>
                        ) : isError ? (
                          <div className="p-1 font-semibold text-slate-800">
                            Error
                          </div>
                        ) : (
                          <>
                            {data.maps.map(
                              (m: {
                                id: string;
                                name: string;
                                width: number;
                                height: number;
                              }) => (
                                <SelectItem key={m.id} value={m.id}>
                                  {m.name}
                                </SelectItem>
                              )
                            )}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" className="">
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
