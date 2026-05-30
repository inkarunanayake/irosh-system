"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Booking {
  id: number;
  full_name: string;
  total_amount: number;
}

interface Expense {
  booking_id: number;
  amount: number;
}

interface ProfitData {
  eventName: string;
  income: number;
  expense: number;
  profit: number;
}

export default function ProfitDashboardPage() {

  const [profitData, setProfitData] =
    useState<ProfitData[]>([]);

  const [totalIncome, setTotalIncome] =
    useState(0);

  const [totalExpense, setTotalExpense] =
    useState(0);

  const [totalProfit, setTotalProfit] =
    useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    const { data: bookings } =
      await supabase
        .from("bookings")
        .select(`
          id,
          full_name,
          total_amount
        `);

    const { data: expenses } =
      await supabase
        .from("event_expenses")
        .select(`
          booking_id,
          amount
        `);

    if (!bookings || !expenses) return;

    let incomeTotal = 0;
    let expenseTotal = 0;

    const results =
      bookings.map((booking) => {

        const eventExpenses =
          expenses.filter(
            (expense) =>
              expense.booking_id ===
              booking.id
          );

        const totalEventExpense =
          eventExpenses.reduce(
            (sum, item) =>
              sum +
              Number(item.amount),
            0
          );

        const income =
          Number(
            booking.total_amount
          ) || 0;

        const profit =
          income -
          totalEventExpense;

        incomeTotal += income;
        expenseTotal +=
          totalEventExpense;

        return {
          eventName:
            booking.full_name,
          income,
          expense:
            totalEventExpense,
          profit,
        };
      });

    setProfitData(results);

    setTotalIncome(incomeTotal);

    setTotalExpense(expenseTotal);

    setTotalProfit(
      incomeTotal - expenseTotal
    );
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <h1 className="text-4xl font-bold mb-10">
        Profit Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

          <h2 className="text-2xl text-gray-400">

            Total Income

          </h2>

          <p className="text-5xl font-bold text-green-500 mt-4">

            Rs. {totalIncome}

          </p>

        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

          <h2 className="text-2xl text-gray-400">

            Total Expenses

          </h2>

          <p className="text-5xl font-bold text-red-500 mt-4">

            Rs. {totalExpense}

          </p>

        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

          <h2 className="text-2xl text-gray-400">

            Total Profit

          </h2>

          <p className="text-5xl font-bold text-blue-500 mt-4">

            Rs. {totalProfit}

          </p>

        </div>

      </div>

      <div className="grid gap-6">

        {profitData.map((item, index) => (

          <div
            key={index}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
          >

            <h2 className="text-3xl font-bold text-red-500 mb-6">

              {item.eventName}

            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              <div>

                <p className="text-gray-400">
                  Income
                </p>

                <h3 className="text-3xl font-bold text-green-500 mt-2">

                  Rs. {item.income}

                </h3>

              </div>

              <div>

                <p className="text-gray-400">
                  Expenses
                </p>

                <h3 className="text-3xl font-bold text-red-500 mt-2">

                  Rs. {item.expense}

                </h3>

              </div>

              <div>

                <p className="text-gray-400">
                  Profit
                </p>

                <h3 className="text-3xl font-bold text-blue-500 mt-2">

                  Rs. {item.profit}

                </h3>

              </div>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}