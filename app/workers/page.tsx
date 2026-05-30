"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

interface Worker {

  id: number;

  name: string;

  username: string;

  password: string;

  role: string;

  phone: string;

  active: boolean;
}

export default function WorkersPage() {

  const router = useRouter();

  const [workers, setWorkers] =
    useState<Worker[]>([]);

  const [name, setName] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [phone, setPhone] =
    useState("");

  useEffect(() => {

    checkAdmin();

    fetchWorkers();

  }, []);

  const checkAdmin = () => {

    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {

      router.push("/login");

      return;
    }

    const parsedUser =
      JSON.parse(savedUser);

    if (
      parsedUser.role !== "admin"
    ) {

      router.push("/login");
    }
  };

  const fetchWorkers = async () => {

    const { data } =
      await supabase
        .from("users")
        .select("*")
        .eq("role", "worker")
        .order("id", {
          ascending: false,
        });

    if (data) {

      setWorkers(data);
    }
  };

  const addWorker = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const { error } =
      await supabase
        .from("users")
        .insert([
          {
            name,
            username,
            password,
            phone,
            role: "worker",
            active: true,
          },
        ]);

    if (error) {

      alert(
        "Worker add failed"
      );

    } else {

      alert("Worker added");

      setName("");
      setUsername("");
      setPassword("");
      setPhone("");

      fetchWorkers();
    }
  };

  const deleteWorker = async (
    id: number
  ) => {

    const confirmDelete =
      confirm(
        "Delete this worker?"
      );

    if (!confirmDelete) return;

    await supabase
      .from("users")
      .delete()
      .eq("id", id);

    fetchWorkers();
  };

  const toggleStatus = async (
    id: number,
    currentStatus: boolean
  ) => {

    await supabase
      .from("users")
      .update({
        active: !currentStatus,
      })
      .eq("id", id);

    fetchWorkers();
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-4xl font-bold">

            Worker Management

          </h1>

          <p className="text-gray-400 mt-2">

            Add and manage workers

          </p>

        </div>

        <button
          onClick={() =>
            router.push("/admin")
          }
          className="bg-zinc-900 hover:bg-red-600 border border-zinc-800 px-5 py-3 rounded-2xl font-bold"
        >

          Back

        </button>

      </div>

      <form
        onSubmit={addWorker}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-10 grid gap-5"
      >

        <input
          type="text"
          placeholder="Worker Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
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
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value
            )
          }
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        />

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold"
        >

          Add Worker

        </button>

      </form>

      <div className="grid gap-6">

        {workers.map((worker) => (

          <div
            key={worker.id}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
          >

            <div className="flex justify-between items-start flex-wrap gap-6">

              <div>

                <h2 className="text-3xl font-bold text-red-500 mb-4">

                  {worker.name}

                </h2>

                <div className="space-y-2 text-gray-300">

                  <p>

                    Username:
                    {" "}
                    {worker.username}

                  </p>

                  <p>

                    Phone:
                    {" "}
                    {worker.phone}

                  </p>

                  <p>

                    Status:
                    {" "}

                    {worker.active
                      ? "Active"
                      : "Inactive"}

                  </p>

                </div>

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    toggleStatus(
                      worker.id,
                      worker.active
                    )
                  }
                  className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-bold"
                >

                  {worker.active
                    ? "Deactivate"
                    : "Activate"}

                </button>

                <button
                  onClick={() =>
                    deleteWorker(
                      worker.id
                    )
                  }
                  className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-bold"
                >

                  Delete

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}