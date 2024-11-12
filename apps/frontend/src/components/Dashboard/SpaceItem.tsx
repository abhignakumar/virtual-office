import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Ellipsis, Link, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSpace } from "@/lib/requests";
import { toast } from "sonner";
import { HTTP_SERVER_URL } from "@repo/lib/config";

interface SpaceItemProps {
  id: string;
  name: string;
  createdAt: Date;
}

export const SpaceItem = ({ id, name, createdAt }: SpaceItemProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteSpace,
    onSuccess: () => {
      toast.success("Space deleted");
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.log(error);
    },
  });

  return (
    <div
      onClick={() => navigate(`/space/${id}`)}
      className="rounded-lg p-3 space-y-1 bg-neutral-100 border border-neutral-300 w-[240px] h-[200px] mx-auto cursor-pointer hover:border-neutral-500 hover:shadow-md transition-all"
    >
      <div className="bg-zinc-200 h-3/4 rounded-lg"></div>
      <div className="h-1/4 flex justify-between">
        <div className="space-y-1">
          <div className="h-1/2 overflow-hidden">{name}</div>
          <div className="text-xs text-neutral-500">
            {new Date(createdAt).toLocaleString()}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(
                  `${HTTP_SERVER_URL}/api/v1/space/invite/${id}`
                );
                toast.success("Copied to Clipboard");
              }}
            >
              <Link />
              Copy invite URL
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-700 hover:!text-red-700 hover:!bg-red-100"
              onClick={(e) => {
                e.stopPropagation();
                mutation.mutate({ spaceId: id });
              }}
            >
              <Trash />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
