"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

export default function AdminPage() {

  const router = useRouter();

  useEffect(() => {

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

  }, [router]);

  const menuItems = [

    {
      title:
        "Booking Management",

      description:
        "Manage customer bookings",

      path: "/booking",

      color:
        "hover:bg-red-600",
    },

    {
      title:
        "Worker Management",

      description:
        "Manage workers and permissions",

      path: "/workers",

      color:
        "hover:bg-blue-600",
    },

    {
      title:
        "Inventory Management",

      description:
        "Manage equipment inventory",

      path: "/inventory",

      color:
        "hover:bg-purple-600",
    },

    {
      title:
        "Expenses Management",

      description:
        "Track expenses and payments",

      path: "/expenses",

      color:
        "hover:bg-orange-600",
    },

    {
      title:
        "Quotation Management",

      description:
        "Create and manage quotations",

      path: "/quotations",

      color:
        "hover:bg-green-600",
    },

    {
      title:
        "Profit Dashboard",

      description:
        "View income and reports",

      path:
        "/profit-dashboard",

      color:
        "hover:bg-pink-600",
    },

    {
      title:
        "Worker Dashboard",

      description:
        "Preview worker dashboard",

      path:
        "/worker-dashboard",

      color:
        "hover:bg-cyan-600",
    },

    {
      title:
        "Website Settings",

      description:
        "Edit homepage and website content",

      path:
        "/website-settings",

      color:
        "hover:bg-yellow-600",
    },
  ];

  const logout = () => {

    localStorage.removeItem(
      "user"
    );

    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <div className="flex justify-between items-center mb-10 flex-wrap gap-5">

        <div>

          <h1 className="text-5xl font-bold text-red-500">

            Admin Panel

          </h1>

          <p className="text-gray-400 mt-3 text-lg">

            Production Management System

          </p>

        </div>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-2xl font-bold"
        >

          Logout

        </button>

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {menuItems.map((item) => (

          <button
            key={item.title}
            onClick={() =>
              router.push(
                item.path
              )
            }
            className={`bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-left transition-all duration-300 ${item.color}`}
          >

            <h2 className="text-3xl font-bold mb-4">

              {item.title}

            </h2>

            <p className="text-gray-300 text-lg">

              {item.description}

            </p>

          </button>

        ))}

      </div>

    </main>
  );
}