"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function WebsiteSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [settingsId, setSettingsId] = useState<number | null>(null);

  // General States
  const [companyName, setCompanyName] = useState("");
  const [tagline, setTagline] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroImage, setHeroImage] = useState("");

  // Lists States
  const [services, setServices] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  // Form Inputs States
  const [newService, setNewService] = useState("");
  const [newPackageName, setNewPackageName] = useState("");
  const [newPackagePrice, setNewPackagePrice] = useState("");
  const [newPackageDetails, setNewPackageDetails] = useState("");

  useEffect(() => {
    fetchSettings();
    fetchServices();
    fetchPackages();
    fetchGallery();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from("website_settings").select("*").single();
    if (data) {
      setSettingsId(data.id);
      setCompanyName(data.company_name || "");
      setTagline(data.tagline || "");
      setWhatsapp(data.whatsapp || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
      setHeroTitle(data.hero_title || "");
      setHeroSubtitle(data.hero_subtitle || "");
      setHeroImage(data.hero_image || "");
    }
  };

  const fetchServices = async () => {
    const { data } = await supabase.from("services").select("*");
    if (data) setServices(data);
  };

  const fetchPackages = async () => {
    const { data } = await supabase.from("packages").select("*");
    if (data) setPackages(data);
  };

  const fetchGallery = async () => {
    const { data } = await supabase.from("gallery_images").select("*").order("id", { ascending: false });
    if (data) setGalleryImages(data);
  };

  // 1. Save General Info Buttons
  const saveSettings = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("website_settings")
      .update({
        company_name: companyName,
        tagline: tagline,
        whatsapp: whatsapp,
        phone: phone,
        address: address,
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        hero_image: heroImage,
      })
      .eq("id", settingsId);

    if (error) {
      alert("Save failed");
    } else {
      alert("Website settings updated successfully!");
    }
    setLoading(false);
  };

  // 2. Add New Service (Online Booking Category/Addon)
  const handleAddService = async () => {
    if (!newService) return;
    const { error } = await supabase.from("services").insert([{ service_name: newService, active: true }]);
    if (!error) {
      setNewService("");
      fetchServices();
    }
  };

  // 3. Add Fixed Package
  const handleAddPackage = async () => {
    if (!newPackageName || !newPackagePrice) return;
    const { error } = await supabase.from("packages").insert([
      {
        name: newPackageName,
        price: parseFloat(newPackagePrice),
        details: newPackageDetails,
      },
    ]);
    if (!error) {
      setNewPackageName("");
      setNewPackagePrice("");
      setNewPackageDetails("");
      fetchPackages();
    }
  };

  // 4. Local Photo Upload To Supabase Storage & Save Link to DB
  const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    try {
      // Gallery Bucket එකට Upload කිරීම
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Public URL එක ලබා ගැනීම
      const { data } = supabase.storage.from("gallery").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // Database එකට සේව් කිරීම
      const { error: dbError } = await supabase.from("gallery_images").insert([
        { image_url: publicUrl }
      ]);

      if (dbError) throw dbError;

      alert("Photo Uploaded successfully!");
      fetchGallery();
    } catch (err: any) {
      alert(err.message || "Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  const deleteService = async (id: number) => {
    await supabase.from("services").delete().eq("id", id);
    fetchServices();
  };

  const deletePackage = async (id: number) => {
    await supabase.from("packages").delete().eq("id", id);
    fetchPackages();
  };

  const deleteGalleryImage = async (id: number) => {
    await supabase.from("gallery_images").delete().eq("id", id);
    fetchGallery();
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 font-sans flex flex-col items-center">
      
      {/* Header View */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-10 flex-wrap gap-5 border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-red-500">Website Live Editor</h1>
          <p className="text-zinc-500 text-xs mt-1">Manage packages, booking categories, local gallery photos and phone numbers</p>
        </div>
        <button
          onClick={() => router.push("/admin")}
          className="bg-zinc-900 hover:bg-red-600 border border-zinc-800 px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
        >
          ← Back to Admin
        </button>
      </div>

      <div className="w-full max-w-4xl grid gap-8">
        
        {/* SECTION 1: GENERAL SETTINGS */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 md:p-8 grid gap-4 shadow-xl">
          <h2 className="text-xl font-bold text-zinc-200">📞 General Contact Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
            />
            <input
              type="text"
              placeholder="Tagline / Description"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
            />
            <input
              type="text"
              placeholder="WhatsApp Number"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
            />
            <input
              type="text"
              placeholder="Business Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 sm:col-span-2 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* SECTION 2: HERO SECTION TEXT */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 md:p-8 grid gap-4 shadow-xl">
          <h2 className="text-xl font-bold text-zinc-200">🎨 Website Main Banner (Hero)</h2>
          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Hero Header Title"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
            />
            <input
              type="text"
              placeholder="Hero Subtitle Text"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
            />
            <input
              type="text"
              placeholder="Main Background Image URL"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              className="bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* SAVE MAIN SETTINGS BUTTON */}
        <button
          onClick={saveSettings}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 py-3.5 rounded-xl font-bold tracking-wider text-xs uppercase transition-colors"
        >
          {loading ? "Saving Information..." : "Save Main Contact & Banner Data"}
        </button>

        {/* SECTION 3: ONLINE BOOKING SERVICES */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-xl font-bold text-zinc-200 mb-4">📅 Online Booking Categories / Services</h2>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto mb-4 pr-1">
            {services.map((service) => (
              <div key={service.id} className="flex justify-between items-center bg-black border border-zinc-800/60 p-3 rounded-xl">
                <span className="text-xs font-semibold text-zinc-300">{service.service_name}</span>
                <button onClick={() => deleteService(service.id)} className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all">
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <input
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              placeholder="Add item (e.g., Full Band Sound Setup, DJ System)"
              className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-green-500"
            />
            <button onClick={handleAddService} className="bg-green-600 hover:bg-green-700 font-bold px-5 rounded-xl text-xs uppercase tracking-wider transition-colors">
              Add Item
            </button>
          </div>
        </div>

        {/* SECTION 4: PACKAGES */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-xl font-bold text-zinc-200 mb-4">📦 Fixed Show Packages</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-black border border-zinc-800 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-white uppercase">{pkg.name}</p>
                    <p className="text-xs font-black text-red-500">Rs.{pkg.price}</p>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-2 line-clamp-2">{pkg.details}</p>
                </div>
                <button onClick={() => deletePackage(pkg.id)} className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-3 py-1 rounded-lg text-[10px] font-bold transition-all self-end mt-4">
                  Delete Package
                </button>
              </div>
            ))}
          </div>

          {/* Add Package Fields */}
          <div className="bg-black border border-zinc-800 p-4 rounded-xl grid gap-3">
            <p className="text-xs font-bold text-zinc-400">Create New Fixed Package</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                value={newPackageName}
                onChange={(e) => setNewPackageName(e.target.value)}
                placeholder="Package Name (e.g., Mini Acoustic Setup)"
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
              />
              <input
                type="number"
                value={newPackagePrice}
                onChange={(e) => setNewPackagePrice(e.target.value)}
                placeholder="Price (LKR) e.g., 45000"
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
              />
            </div>
            <textarea
              value={newPackageDetails}
              onChange={(e) => setNewPackageDetails(e.target.value)}
              placeholder="Package Items Details (e.g., 2 Speakers, Digital Mixer, Mic 4...)"
              rows={2}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none resize-none"
            />
            <button onClick={handleAddPackage} className="bg-red-600 hover:bg-red-700 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider self-end px-6 transition-colors">
              Publish Package
            </button>
          </div>
        </div>

        {/* SECTION 5: GALLERY IMAGES WITH LOCAL UPLOAD */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-xl font-bold text-zinc-200 mb-2">📸 Live Event Gallery</h2>
          <p className="text-zinc-500 text-xs mb-4">Upload recent show images directly from this device</p>
          
          {/* File Picker Box */}
          <div className="mb-6">
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-zinc-800 border-dashed rounded-xl cursor-pointer bg-black/40 hover:bg-black/80 hover:border-red-500/50 transition-all">
              <div className="flex flex-col items-center justify-center pt-4 pb-4">
                <span className="text-xl mb-1">🖼️</span>
                <p className="text-xs font-bold text-zinc-400">
                  {uploading ? "Uploading photo to Supabase..." : "Select Local Photo to Upload"}
                </p>
                <p className="text-[10px] text-zinc-600 mt-0.5">JPEG, JPG or PNG setups images</p>
              </div>
              <input type="file" accept="image/*" onChange={handleLocalImageUpload} disabled={uploading} className="hidden" />
            </label>
          </div>

          {/* Photos Grid Display */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-64 overflow-y-auto pr-1">
            {galleryImages.map((img) => (
              <div key={img.id} className="group relative aspect-video bg-black border border-zinc-800 rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.image_url} alt="Gallery Event" className="w-full h-full object-cover" />
                <button
                  onClick={() => deleteGalleryImage(img.id)}
                  className="absolute top-2 right-2 bg-black/80 hover:bg-red-600 text-[10px] p-1.5 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}