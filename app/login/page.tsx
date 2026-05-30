"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {

  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const login = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const { data, error } =
      await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .single();

    if (error || !data) {

      alert("Invalid login");

      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify(data)
    );

    if (data.role === "admin") {

      router.push("/admin");

    } else {

      router.push(
        "/worker-dashboard"
      );
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">

      <form
        onSubmit={login}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 w-full max-w-md"
      >

        <h1 className="text-4xl font-bold mb-8 text-center">

          Login

        </h1>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3"
            required
          />

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold"
          >

            Login

          </button>

        </div>

      </form>

    </main>
  );
}