// src/pages/Home.jsx
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-white p-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">
        Welcome to Memory Bank
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        Find and connect with skilled service providers near you.
      </p>

      <div className="flex gap-4">
        <Button variant="default" onClick={() => navigate("/login")}>
          Login
        </Button>
        <Button variant="outline" onClick={() => navigate("/register")}>
          Register
        </Button>
      </div>
    </div>
  );
}
