import { useNavigate } from "react-router-dom";

interface SpaceItemProps {
  id: string;
  name: string;
  createdAt: Date;
}

export const SpaceItem = ({ id, name, createdAt }: SpaceItemProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/space/${id}`)}
      className="rounded-lg p-3 space-y-1 bg-neutral-100 border border-neutral-300 w-[240px] h-[200px] mx-auto cursor-pointer hover:border-neutral-500 hover:shadow-md transition-all"
    >
      <div className="bg-zinc-200 h-3/4 rounded-lg"></div>
      <div className="space-y-1 h-1/4">
        <div className="h-1/2 overflow-hidden">{name}</div>
        <div className="text-xs text-neutral-500">
          {new Date(createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};
