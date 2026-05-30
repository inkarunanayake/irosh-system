"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function WebsiteSettingsPage() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [settingsId, setSettingsId] =
    useState<number | null>(null);

  const [companyName, setCompanyName] =
    useState("");

  const [tagline, setTagline] =
    useState("");

  const [whatsapp, setWhatsapp] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [heroTitle, setHeroTitle] =
    useState("");

  const [heroSubtitle, setHeroSubtitle] =
    useState("");

  const [heroImage, setHeroImage] =
    useState("");

  useEffect(() => {

    fetchSettings();

  }, []);

  const fetchSettings =
    async () => {

      const { data } =
        await supabase
          .from(
            "website_settings"
          )
          .select("*")
          .single();

      if (data) {

        setSettingsId(data.id);

        setCompanyName(
          data.company_name || ""
        );

        setTagline(
          data.tagline || ""
        );

        setWhatsapp(
          data.whatsapp || ""
        );

        setPhone(
          data.phone || ""
        );

        setAddress(
          data.address || ""
        );

        setHeroTitle(
          data.hero_title || ""
        );

        setHeroSubtitle(
          data.hero_subtitle || ""
        );

        setHeroImage(
          data.hero_image || ""
        );
      }
    };

  const saveSettings =
    async () => {

      setLoading(true);

      const { error } =
        await supabase
          .from(
            "website_settings"
          )
          .update({
            company_name:
              companyName,

            tagline:
              tagline,

            whatsapp:
              whatsapp,

            phone:
              phone,

            address:
              address,

            hero_title:
              heroTitle,

            hero_subtitle:
              heroSubtitle,

            hero_image:
              heroImage,
          })
          .eq("id", settingsId);

      if (error) {

        alert(
          "Save failed"
        );

        setLoading(false);

        return;
      }

      alert(
        "Website settings updated"
      );

      setLoading(false);
    };

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <div className="flex justify-between items-center mb-10 flex-wrap gap-5">

        <div>

          <h1 className="text-5xl font-bold text-red-500">

            Website Settings

          </h1>

          <p className="text-gray-400 mt-3">

            Manage homepage content

          </p>

        </div>

        <button
          onClick={() =>
            router.push("/admin")
          }
          className="bg-zinc-900 hover:bg-red-600 border border-zinc-800 px-6 py-3 rounded-2xl font-bold"
        >

          Back

        </button>

      </div>

      <div className="max-w-4xl mx-auto grid gap-6">

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 grid gap-5">

          <h2 className="text-3xl font-bold mb-3">

            General Settings

          </h2>

          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) =>
              setCompanyName(
                e.target.value
              )
            }
            className="bg-black border border-zinc-700 rounded-2xl px-5 py-4"
          />

          <input
            type="text"
            placeholder="Tagline"
            value={tagline}
            onChange={(e) =>
              setTagline(
                e.target.value
              )
            }
            className="bg-black border border-zinc-700 rounded-2xl px-5 py-4"
          />

          <input
            type="text"
            placeholder="WhatsApp Number"
            value={whatsapp}
            onChange={(e) =>
              setWhatsapp(
                e.target.value
              )
            }
            className="bg-black border border-zinc-700 rounded-2xl px-5 py-4"
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
            className="bg-black border border-zinc-700 rounded-2xl px-5 py-4"
          />

          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) =>
              setAddress(
                e.target.value
              )
            }
            className="bg-black border border-zinc-700 rounded-2xl px-5 py-4"
          />

        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 grid gap-5">

          <h2 className="text-3xl font-bold mb-3">

            Hero Section

          </h2>

          <input
            type="text"
            placeholder="Hero Title"
            value={heroTitle}
            onChange={(e) =>
              setHeroTitle(
                e.target.value
              )
            }
            className="bg-black border border-zinc-700 rounded-2xl px-5 py-4"
          />

          <input
            type="text"
            placeholder="Hero Subtitle"
            value={heroSubtitle}
            onChange={(e) =>
              setHeroSubtitle(
                e.target.value
              )
            }
            className="bg-black border border-zinc-700 rounded-2xl px-5 py-4"
          />

          <input
            type="text"
            placeholder="Hero Background Image URL"
            value={heroImage}
            onChange={(e) =>
              setHeroImage(
                e.target.value
              )
            }
            className="bg-black border border-zinc-700 rounded-2xl px-5 py-4"
          />

        </div>

        <button
          onClick={saveSettings}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 py-5 rounded-2xl text-xl font-bold"
        >

          {loading
            ? "Saving..."
            : "Save Website Settings"}

        </button>

      </div>

    </main>
  );
}