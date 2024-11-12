import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) setIsAuthenticated(true);
  }, []);

  return (
    <nav className="flex justify-between items-center px-7 py-3 border-b border-neutral-300 bg-neutral-100 shadow-sm">
      <div className="font-bold text-blue-900 text-xl hover:text-blue-700">
        <Link to={"/"}>Virtual Office</Link>
      </div>
      <div className="flex items-center gap-x-3">
        {isAuthenticated && (
          <Button asChild variant={"outline"}>
            <Link to={"/dashboard"}>
              <span>Dashboard</span>
            </Link>
          </Button>
        )}
        <Button asChild>
          {isAuthenticated ? (
            <Link
              to={"/"}
              onClick={() => {
                localStorage.removeItem("token");
                setIsAuthenticated(false);
              }}
            >
              <LogOut />
              <span>Log Out</span>
            </Link>
          ) : (
            <Link to={"/login"}>
              <span>LogIn</span>
            </Link>
          )}
        </Button>
      </div>
    </nav>
  );
};
