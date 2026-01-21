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
  const [isAllocat, setIsAllocat] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      await register(fullName, email, password, isAllocat);
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>    
    <main className="flex flex-col items-center">
      <AllocatrLogo theme={theme} className="w-24 py-6 mt-[5%]"/>
      <form className="container max-w-lg space-y-6 border bg-muted-foreground/5 pt-4 pb-8 px-8 rounded-sm" onSubmit={handleSubmit}>
        <span className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create account</h1>
        </span>

        <span className="flex flex-col gap-3">
          {/* <Label htmlFor="fullName">Full name</Label> */}
          <Input
            id="fullName"
            type="text"
            value={fullName}
            placeholder="Full name"
            onChange={e => setFullName(e.target.value)}
            required
            className="h-12 border-none px-4 shadow-none"
          />
        </span>

        <span className="flex flex-col gap-3">
          {/* <Label htmlFor="email">Email</Label> */}
          <Input
            id="email"
            type="email"
            value={email}
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
            required
            className="h-12 border-none px-4 shadow-none"
          />
        </span>

        <span className="flex flex-col gap-3">
          {/* <Label htmlFor="password">Password</Label> */}
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

        {/* <span className="flex items-center gap-2">
          <input
            id="isAllocat"
            type="checkbox"
            className="border-2 bg-red-500"
          />
          <Label htmlFor="isAllocat">Sign up as allocat</Label>          
        </span> */}

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isAllocat}
            onChange={(e) => setIsAllocat(e.target.checked)}
            className="
              appearance-none
              w-5 h-5
              border-2 border-gray-300
              rounded-md
              bg-muted-foreground/20
              checked:bg-dark-gray
              checked:border-none
              checked:after:content-['✓']
              checked:after:text-brand-primary
              checked:after:text-sm
              checked:after:flex
              checked:after:items-center
              checked:after:justify-center
              checked:after:w-full
              checked:after:h-full
              transition
              duration-150
            "
          />
          <span className="text-sm font-medium">Sign up as allocat</span>
        </label>


        <Button type="submit" disabled={loading} className="flex gap-2 h-12 w-full">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Creating account…" : "Create Account"}
        </Button>
        <span
          className="flex gap-2 text-sm text-muted-foreground"
        >
            Already have an account?
            <Link
              to="/login"
              className="text-accent-3 font-medium"
            >
              Login
            </Link>
        </span>
      </form>      
    </main>
    </>
  );
}
