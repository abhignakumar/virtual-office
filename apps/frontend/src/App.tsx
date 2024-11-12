import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { LogInPage } from "./components/Auth/LogInPage";
import { SignUpPage } from "./components/Auth/SignUpPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import { DashboardPage } from "./components/Dashboard/DashboardPage";
import { SpacePage } from "./components/Space/SpacePage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LogInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/space/:spaceId" element={<SpacePage />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}
