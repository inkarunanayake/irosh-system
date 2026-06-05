"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Supabase 'users' table එකෙන් username සහ password පරීක්ෂා කිරීම
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username.trim())
        .eq("password", password)
        .single();

      if (error || !data) {
        alert("Invalid Username or Password! Please try again.");
        setLoading(false);
        return;
      }

      // User දත්ත Session එකක් විදිහට LocalStorage එකේ තැන්පත් කිරීම
      localStorage.setItem("user", JSON.stringify(data));

      // Role එක අනුව අදාළ Dashboard එකට Redirect කිරීම
      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/worker-dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* Background Subtle Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Brand Logo / Header */}
      <div className="flex items-center gap-2 mb-8 cursor-pointer z-10" onClick={() => router.push("/")}>
        <span className="text-2xl font-black tracking-widest bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent uppercase">Irosh</span>
        <span className="text-2xl font-black tracking-widest bg-red-600 px-2 py-0.5 rounded text-white uppercase text-sm">Ent</span>
      </div>

      {/* Login Box Container */}
      <div className="w-full max-w-md z-10">
        <form
          onSubmit={login}
          className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl relative"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">MANAGEMENT LOGIN</h1>
            <p className="text-zinc-500 text-xs tracking-wide">Authorized Personnel Access Only</p>
          </div>

          <div className="space-y-5">
            {/* Username Field */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-red-500/60 placeholder:text-zinc-600 transition-all duration-200"
                required
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-red-500/60 placeholder:text-zinc-600 transition-all duration-200"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-lg shadow-red-600/10 mt-2 cursor-pointer"
            >
              {loading ? "Verifying..." : "Login to Dashboard"}
            </button>
          </div>
        </form>

        {/* Back to Home Link */}
        <p className="text-center mt-6">
          <button 
            onClick={() => router.push("/")} 
            className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors duration-200 uppercase tracking-widest bg-transparent border-none outline-none cursor-pointer"
          >
            ← Back to Public Website
          </button>
        </p>
      </div>
    </main>
  );
}