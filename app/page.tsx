"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function HomePage() {

  const router = useRouter();

  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [eventDate, setEventDate] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleBooking =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setLoading(true);

      const { error } =
        await supabase
          .from("bookings")
          .insert([
            {
              full_name:
                fullName,

              phone:
                phone,

              event_date:
                eventDate,

              location:
                location,

              status:
                "Pending",
            },
          ]);

      if (error) {

        alert(
          error.message
        );

        setLoading(false);

        return;
      }

      alert(
        "Booking Submitted Successfully"
      );

      setFullName("");

      setPhone("");

      setEventDate("");

      setLocation("");

      setLoading(false);
    };

  const galleryImages = [

    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",

    "https://images.unsplash.com/photo-1516280440614-37939bbacd81",

    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",

    "https://images.unsplash.com/photo-1511578314322-379afb476865",

    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",

    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
  ];

  const services = [

    "Live Streaming",

    "LED Wall Systems",

    "Multi Camera Production",

    "Professional Lighting",

    "Sound Systems",

    "Wedding Production",

    "Concert Production",

    "Studio Production",
  ];

  const packages = [

    {
      name: "Basic Package",
      price: "Rs. 25,000",
      details:
        "2 Cameras • Basic Audio • Streaming",
    },

    {
      name: "Standard Package",
      price: "Rs. 75,000",
      details:
        "4 Cameras • LED • Lighting • Audio",
    },

    {
      name: "Premium Package",
      price: "Rs. 150,000+",
      details:
        "Full Production Setup",
    },
  ];

  return (
    <main className="bg-black text-white min-h-screen">

      <div className="fixed top-5 right-5 z-50 flex gap-3">

        <button
          onClick={() =>
            router.push("/login")
          }
          className="bg-zinc-900 hover:bg-red-600 border border-zinc-700 px-5 py-3 rounded-2xl font-bold"
        >

          Admin Login

        </button>

        <button
          onClick={() =>
            router.push("/login")
          }
          className="bg-zinc-900 hover:bg-blue-600 border border-zinc-700 px-5 py-3 rounded-2xl font-bold"
        >

          Worker Login

        </button>

      </div>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 text-center px-6">

          <h1 className="text-6xl md:text-8xl font-black text-red-500 mb-6">

            IROSH VIDEO TEAM

          </h1>

          <p className="text-2xl md:text-3xl text-gray-300 mb-10">

            Professional Event Production

          </p>

          <div className="flex gap-5 justify-center flex-wrap">

            <a
              href="#booking"
              className="bg-red-600 hover:bg-red-700 px-8 py-5 rounded-2xl text-xl font-bold"
            >

              Book Event

            </a>

            <a
              href="https://wa.me/94770000000"
              target="_blank"
              className="bg-green-600 hover:bg-green-700 px-8 py-5 rounded-2xl text-xl font-bold"
            >

              WhatsApp

            </a>

          </div>

        </div>

      </section>

      <section className="py-24 px-6">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-5xl font-bold text-center mb-16">

            Our Services

          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

            {services.map((service) => (

              <div
                key={service}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-red-500 transition-all"
              >

                <h3 className="text-2xl font-bold text-red-500">

                  {service}

                </h3>

              </div>

            ))}

          </div>

        </div>

      </section>

      <section className="py-24 px-6 bg-zinc-950">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-5xl font-bold text-center mb-16">

            Event Gallery

          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {galleryImages.map(
              (image, index) => (

                <div
                  key={index}
                  className="overflow-hidden rounded-3xl border border-zinc-800"
                >

                  <img
                    src={`${image}?auto=format&fit=crop&w=1000&q=80`}
                    className="w-full h-80 object-cover hover:scale-110 transition-all duration-500"
                  />

                </div>

              )
            )}

          </div>

        </div>

      </section>

      <section className="py-24 px-6">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-5xl font-bold text-center mb-16">

            Packages

          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {packages.map((pkg) => (

              <div
                key={pkg.name}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10"
              >

                <h3 className="text-3xl font-bold text-red-500 mb-6">

                  {pkg.name}

                </h3>

                <p className="text-5xl font-black mb-6">

                  {pkg.price}

                </p>

                <p className="text-gray-300 text-lg">

                  {pkg.details}

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      <section
        id="booking"
        className="py-24 px-6 bg-zinc-950"
      >

        <div className="max-w-3xl mx-auto">

          <h2 className="text-5xl font-bold text-center mb-16">

            Online Booking

          </h2>

          <form
            onSubmit={handleBooking}
            className="grid gap-6 bg-zinc-900 border border-zinc-800 rounded-3xl p-10"
          >

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }
              className="bg-black border border-zinc-700 rounded-2xl px-5 py-5 text-lg"
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
              className="bg-black border border-zinc-700 rounded-2xl px-5 py-5 text-lg"
              required
            />

            <input
              type="date"
              value={eventDate}
              onChange={(e) =>
                setEventDate(
                  e.target.value
                )
              }
              className="bg-black border border-zinc-700 rounded-2xl px-5 py-5 text-lg"
              required
            />

            <input
              type="text"
              placeholder="Event Location"
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
              className="bg-black border border-zinc-700 rounded-2xl px-5 py-5 text-lg"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 py-5 rounded-2xl text-xl font-bold"
            >

              {loading
                ? "Submitting..."
                : "Book Event"}

            </button>

          </form>

        </div>

      </section>

      <section className="py-24 px-6">

        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-5xl font-bold mb-10">

            Contact Us

          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

              <h3 className="text-2xl font-bold text-red-500 mb-4">

                Phone

              </h3>

              <p className="text-xl">

                +94 77 000 0000

              </p>

            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

              <h3 className="text-2xl font-bold text-red-500 mb-4">

                WhatsApp

              </h3>

              <p className="text-xl">

                +94 77 000 0000

              </p>

            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

              <h3 className="text-2xl font-bold text-red-500 mb-4">

                Location

              </h3>

              <p className="text-xl">

                Sri Lanka

              </p>

            </div>

          </div>

        </div>

      </section>

      <footer className="border-t border-zinc-800 py-10 text-center text-gray-500">

        © 2026 IROSH VIDEO TEAM

      </footer>

    </main>
  );
}