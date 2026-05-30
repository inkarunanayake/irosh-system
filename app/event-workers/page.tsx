"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Booking {
  id: number;
  full_name: string;
}

interface Worker {
  id: number;
  full_name: string;
}

interface AssignedWorker {
  id: number;
  role: string;
  payment: number;
  status: string;
  bookings: {
    full_name: string;
  };
  workers: {
    full_name: string;
  };
}

export default function EventWorkersPage() {

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [workers, setWorkers] =
    useState<Worker[]>([]);

  const [assigned, setAssigned] =
    useState<AssignedWorker[]>([]);

  const [bookingId, setBookingId] =
    useState("");

  const [workerId, setWorkerId] =
    useState("");

  const [role, setRole] =
    useState("");

  const [payment, setPayment] =
    useState(0);

  useEffect(() => {

    fetchBookings();
    fetchWorkers();
    fetchAssigned();

  }, []);

  const fetchBookings = async () => {

    const { data } = await supabase
      .from("bookings")
      .select("id, full_name");

    if (data) {
      setBookings(data);
    }
  };

  const fetchWorkers = async () => {

    const { data } = await supabase
      .from("workers")
      .select("id, full_name");

    if (data) {
      setWorkers(data);
    }
  };

  const fetchAssigned = async () => {

    const { data } = await supabase
      .from("event_workers")
      .select(`
        id,
        role,
        payment,
        status,
        bookings (
          full_name
        ),
        workers (
          full_name
        )
      `)
      .order("id", { ascending: false });

    if (data) {
      setAssigned(data as any);
    }
  };

  const assignWorker = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const { error } = await supabase
      .from("event_workers")
      .insert([
        {
          booking_id: bookingId,
          worker_id: workerId,
          role,
          payment,
        },
      ]);

    if (error) {

      alert("Worker assignment failed");

    } else {

      alert("Worker assigned");

      setBookingId("");
      setWorkerId("");
      setRole("");
      setPayment(0);

      fetchAssigned();
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-4xl font-bold mb-10">
        Event Worker Assign
      </h1>

      <form
        onSubmit={assignWorker}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-10 grid gap-6"
      >

        <select
          value={bookingId}
          onChange={(e) =>
            setBookingId(e.target.value)
          }
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        >

          <option value="">
            Select Booking
          </option>

          {bookings.map((booking) => (

            <option
              key={booking.id}
              value={booking.id}
            >
              {booking.full_name}
            </option>

          ))}

        </select>

        <select
          value={workerId}
          onChange={(e) =>
            setWorkerId(e.target.value)
          }
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        >

          <option value="">
            Select Worker
          </option>

          {workers.map((worker) => (

            <option
              key={worker.id}
              value={worker.id}
            >
              {worker.full_name}
            </option>

          ))}

        </select>

        <input
          type="text"
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          placeholder="Event Role"
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        />

        <input
          type="number"
          value={payment}
          onChange={(e) =>
            setPayment(Number(e.target.value))
          }
          placeholder="Payment"
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        />

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold"
        >
          Assign Worker
        </button>

      </form>

      <div className="grid gap-6">

        {assigned.map((item) => (

          <div
            key={item.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
          >

            <h2 className="text-2xl font-bold text-red-500 mb-4">

              {item.bookings?.full_name}

            </h2>

            <div className="space-y-2 text-gray-300">

              <p>

                <span className="text-white font-semibold">
                  Worker:
                </span>{" "}

                {item.workers?.full_name}

              </p>

              <p>

                <span className="text-white font-semibold">
                  Role:
                </span>{" "}

                {item.role}

              </p>

              <p>

                <span className="text-white font-semibold">
                  Payment:
                </span>{" "}

                Rs. {item.payment}

              </p>

              <p>

                <span className="text-white font-semibold">
                  Status:
                </span>{" "}

                {item.status}

              </p>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}