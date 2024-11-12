import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../NavBar";
import { SpaceCanvas } from "./SpaceCanvas";

export const SpacePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, []);

  return (
    <div className="min-h-screen bg-blue-100">
      <NavBar />
      <div className="flex justify-center p-5">
        <SpaceCanvas />
      </div>
    </div>
  );
};
