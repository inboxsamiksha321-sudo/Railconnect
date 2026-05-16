import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Train, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const result = await login(form.email, form.password);
      if (result.success) {
        toast.success(`Welcome back!`);
        navigate("/passenger/dashboard");
      } else {
        toast.error(result.message || "Invalid email or password");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen bg-rail-bg flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-rail-blue p-12">
        <div className="bg-rail-accent p-4 rounded-2xl mb-6">
          <Train className="w-12 h-12 text-white" />
        </div>
        <h1 className="font-syne font-bold text-white text-4xl mb-4 text-center">
          Rail<span className="text-rail-accent">Connect</span>
        </h1>
        <p className="text-blue-200 font-dm text-center max-w-sm leading-relaxed">
          Unified Smart Complaint Platform for Indian Railways. Your grievance,
          our priority.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-sm">
          {[
            { label: "Complaints Resolved", value: "2.4L+" },
            { label: "Active Users", value: "18L+" },
            { label: "Resolution Rate", value: "98%" },
            { label: "Avg Resolution", value: "3 Days" },
          ].map((s, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-4 text-center">
              <p className="font-syne font-bold text-rail-accent text-2xl">
                {s.value}
              </p>
              <p className="text-blue-200 text-xs font-dm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="bg-rail-accent p-2 rounded-xl">
              <Train className="w-6 h-6 text-white" />
            </div>
            <span className="font-syne font-bold text-rail-blue text-2xl">
              Rail<span className="text-rail-accent">Connect</span>
            </span>
          </div>

          <h2 className="font-syne font-bold text-rail-blue text-3xl mb-1">
            Welcome back
          </h2>
          <p className="text-rail-gray font-dm text-sm mb-8">
            Sign in to your account
          </p>

          {/* Form */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rail-gray" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-rail-mid transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rail-gray" />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-rail-mid transition-all"
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-rail-gray hover:text-rail-blue"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-rail-blue hover:bg-rail-mid text-white font-dm font-semibold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <p className="text-center text-sm font-dm text-rail-gray mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-rail-mid font-medium hover:text-rail-blue"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
