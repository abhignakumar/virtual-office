import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../NavBar";
import { SpaceItem } from "./SpaceItem";
import { useQuery } from "@tanstack/react-query";
import { getSpaces } from "@/lib/requests";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { CreateSpace } from "./CreateSpace";

export const DashboardPage = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["spaces"],
    queryFn: getSpaces,
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, []);

  if (error) {
    console.log(error);
    toast.error("Error loading spaces");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-blue-100">
      <NavBar />
      <div className="p-7">
        <div className="flex justify-between items-center border-b border-neutral-300 pb-4">
          <div className="font-semibold text-lg text-neutral-800">
            My Spaces
          </div>
          <CreateSpace />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center p-3">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
            {data.spaces.map(
              (
                s: { id: string; name: string; createdAt: Date },
                index: number
              ) => (
                <SpaceItem
                  key={index}
                  id={s.id}
                  name={s.name}
                  createdAt={s.createdAt}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
