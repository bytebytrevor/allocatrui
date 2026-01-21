import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import AllocatrLogo from "@/components/AllocatrLogo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = localStorage.getItem("theme") || "dark";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/projects");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
        <div className="flex flex-col items-center justify-center">
          <AllocatrLogo theme={theme} className="w-24 py-6 mt-[5%]"/>
          <form
            className="container max-w-lg space-y-6 bg-muted-foreground/5 pt-4 pb-8 px-8 rounded-sm border"
            onSubmit={handleSubmit}
          >
            <span className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Welcome back</h1>
            </span>

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 border-none rounded-full shadow-none "
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 border-none rounded-full shadow-none "
              required
            />

            {error && <p className="text-red-500">{error}</p>}

            <div className="pb-2">
              <Link
                  to=""
                  className="font-semibold text-sm text-accent-3 "            
              >
                  Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Signing in…" : "Login"}
            </Button>

            <div className="flex gap-2 text-sm text-muted-foreground">
              Don't have an account?
              <Link to="/register" className="text-accent-3 font-medium">
                Create account
              </Link>
            </div>
          </form>
      </div>
    </>
  );
}


