import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../auth/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AllocatrLogo from "@/components/AllocatrLogo";

export default function Register() {
  const theme = localStorage.getItem("theme") || "dark";
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      await register(fullName, email, password);
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <header className="border-b py-4">
      <div className="container mx-auto">
        <AllocatrLogo theme={theme} className="w-24"/>
      </div> 
    </header>
    
    <div className="flex justify-center mt-16">
      <form className="container max-w-lg space-y-6 pt-4 pb-8 px-8 rounded-sm" onSubmit={handleSubmit}>
        <span className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create account</h1>
        </span>

        <span className="flex flex-col gap-3">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            placeholder="Your full name"
            onChange={e => setFullName(e.target.value)}
            required
            className="h-12 border-none px-4 shadow-none"
          />
        </span>

        <span className="flex flex-col gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            placeholder="name@email.com"
            onChange={e => setEmail(e.target.value)}
            required
            className="h-12 border-none px-4 shadow-none"
          />
        </span>

        <span className="flex flex-col gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
            required
            className="h-12 border-none px-4 shadow-none"
          />
        </span>

        <Button type="submit" disabled={loading} className="flex gap-2 h-12 w-full">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Creating account…" : "Create Account"}
        </Button>
        <span
          className="flex gap-2 text-sm text-muted-foreground"
        >
            Already have an account?
            <Link
              to=""
              className="text-accent-3"
            >
              Login
            </Link>
        </span>
      </form>      
    </div>
    </>
  );
}
