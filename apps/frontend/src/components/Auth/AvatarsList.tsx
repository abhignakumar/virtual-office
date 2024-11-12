import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { getAllAvatars } from "@/lib/requests";

export const AvatarsList = ({ form }: { form: any }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["avatars"],
    queryFn: getAllAvatars,
  });

  return (
    <FormField
      control={form.control}
      name="avatarId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select Avatar</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              disabled={field.disabled}
              name={field.name}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Avatar" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <div className="flex justify-center items-center p-1">
                    <Loader className="animate-spin" />
                  </div>
                ) : isError ? (
                  <div className="p-1 font-semibold text-slate-800">Error</div>
                ) : (
                  <>
                    {data.avatars.map((a: { id: string; hexColor: string }) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.hexColor}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
