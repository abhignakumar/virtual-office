import { Link } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-blue-100">
      <NavBar />
      <div className="flex flex-col items-center">
        <h1 className="mt-40 font-bold text-slate-800 text-6xl max-w-screen-lg text-center">
          Create a office and join where ever you are from all around the world
        </h1>
        <h2 className="mt-6 font-semibold text-slate-600 text-2xl max-w-screen-lg text-center">
          Trail and check it out.
        </h2>
        <Button asChild className="mt-6 group">
          <Link to={"/login"}>
            <ArrowRight className="group-hover:translate-x-1 transition-all" />
            <span>Get Started</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};
