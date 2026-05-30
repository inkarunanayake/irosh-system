"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

interface Booking {

  id: number;

  full_name: string;

  phone: string;

  event_date: string;

  location: string;

  status: string;
}

export default function WorkerDashboard() {

  const router = useRouter();

  const [user, setUser] =
    useState<any>(null);

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  useEffect(() => {

    checkWorker();

  }, []);

  const checkWorker = async () => {

    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {

      router.push("/login");

      return;
    }

    const parsedUser =
      JSON.parse(savedUser);

    if (
      parsedUser.role !== "worker"
    ) {

      router.push("/login");

      return;
    }

    setUser(parsedUser);

    fetchAssignedBookings(
      parsedUser.id
    );
  };

  const fetchAssignedBookings =
    async (
      workerId: number
    ) => {

      const { data, error } =
        await supabase
          .from(
            "booking_workers"
          )
          .select(`
            booking_id,
            bookings (
              id,
              full_name,
              phone,
              event_date,
              location,
              status
            )
          `)
          .eq(
            "worker_id",
            workerId
          );

      if (error) {

        console.log(error);

        return;
      }

      const formatted =
        data.map(
          (item: any) =>
            item.bookings
        );

      setBookings(formatted);
    };

  const logout = () => {

    localStorage.removeItem(
      "user"
    );

    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-4xl font-bold">

            Worker Dashboard

          </h1>

          <p className="text-gray-400 mt-2">

            Welcome {user?.name}

          </p>

        </div>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-bold"
        >

          Logout

        </button>

      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-3">

            Assigned Events

          </h2>

          <p className="text-5xl font-bold text-red-500">

            {bookings.length}

          </p>

        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-3">

            Worked Days

          </h2>

          <p className="text-5xl font-bold text-green-500">

            {bookings.length}

          </p>

        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-3">

            Pending Salary

          </h2>

          <p className="text-5xl font-bold text-blue-500">

            Rs. 0

          </p>

        </div>

      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

        <h2 className="text-3xl font-bold mb-8">

          My Assigned Bookings

        </h2>

        {bookings.length === 0 ? (

          <p className="text-gray-400">

            No assigned bookings.

          </p>

        ) : (

          <div className="grid gap-6">

            {bookings.map(
              (booking) => (

                <div
                  key={booking.id}
                  className="bg-black border border-zinc-700 rounded-2xl p-6"
                >

                  <h3 className="text-2xl font-bold text-red-500 mb-4">

                    {booking.full_name}

                  </h3>

                  <div className="space-y-2 text-gray-300">

                    <p>

                      Phone:
                      {" "}
                      {booking.phone}

                    </p>

                    <p>

                      Event Date:
                      {" "}
                      {booking.event_date}

                    </p>

                    <p>

                      Location:
                      {" "}
                      {booking.location}

                    </p>

                    <p>

                      Status:
                      {" "}
                      {booking.status}

                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </main>
  );
}