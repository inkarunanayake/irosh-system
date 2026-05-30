"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Booking {
  id: number;
  full_name: string;
}

interface Expense {
  id: number;
  expense_name: string;
  category: string;
  amount: number;
  notes: string;
  bookings: {
    full_name: string;
  };
}

export default function ExpensesPage() {

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [bookingId, setBookingId] =
    useState("");

  const [expenseName, setExpenseName] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [notes, setNotes] =
    useState("");

  useEffect(() => {

    fetchBookings();
    fetchExpenses();

  }, []);

  const fetchBookings = async () => {

    const { data } = await supabase
      .from("bookings")
      .select("id, full_name");

    if (data) {
      setBookings(data);
    }
  };

  const fetchExpenses = async () => {

    const { data } = await supabase
      .from("event_expenses")
      .select(`
        id,
        expense_name,
        category,
        amount,
        notes,
        bookings (
          full_name
        )
      `)
      .order("id", { ascending: false });

    if (data) {
      setExpenses(data as any);
    }
  };

  const addExpense = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const { error } = await supabase
      .from("event_expenses")
      .insert([
        {
          booking_id: bookingId,
          expense_name: expenseName,
          category,
          amount,
          notes,
        },
      ]);

    if (error) {

      alert("Expense add failed");

    } else {

      alert("Expense added");

      setBookingId("");
      setExpenseName("");
      setCategory("");
      setAmount("");
      setNotes("");

      fetchExpenses();
    }
  };

  const totalExpenses =
    expenses.reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-4xl font-bold mb-10">
        Expense Tracking
      </h1>

      <form
        onSubmit={addExpense}
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
            Select Event
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

        <input
          type="text"
          value={expenseName}
          onChange={(e) =>
            setExpenseName(
              e.target.value
            )
          }
          placeholder="Expense Name"
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        />

        <input
          type="text"
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
          placeholder="Category"
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        />

        <input
          type="number"
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
          placeholder="Amount"
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
          required
        />

        <textarea
          value={notes}
          onChange={(e) =>
            setNotes(
              e.target.value
            )
          }
          placeholder="Notes"
          className="bg-black border border-zinc-700 rounded-xl px-4 py-3"
        />

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold"
        >
          Add Expense
        </button>

      </form>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-10">

        <h2 className="text-3xl font-bold text-red-500">

          Total Expenses

        </h2>

        <p className="text-5xl font-bold mt-4">

          Rs. {totalExpenses}

        </p>

      </div>

      <div className="grid gap-6">

        {expenses.map((expense) => (

          <div
            key={expense.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
          >

            <h2 className="text-2xl font-bold text-red-500 mb-4">

              {expense.expense_name}

            </h2>

            <div className="space-y-3 text-gray-300">

              <p>

                <span className="text-white font-semibold">
                  Event:
                </span>{" "}

                {expense.bookings?.full_name}

              </p>

              <p>

                <span className="text-white font-semibold">
                  Category:
                </span>{" "}

                {expense.category}

              </p>

              <p>

                <span className="text-white font-semibold">
                  Amount:
                </span>{" "}

                Rs. {expense.amount}

              </p>

              <p>

                <span className="text-white font-semibold">
                  Notes:
                </span>{" "}

                {expense.notes}

              </p>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}