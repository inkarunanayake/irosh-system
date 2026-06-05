"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface ServiceItem {
  id: string | number;
  name: string;
  price: number;
  parent_id: string | number | null;
}

export default function HomePage() {
  const router = useRouter();
  
  // Form States
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Database Services States
  const [allServices, setAllServices] = useState<ServiceItem[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [selectedSubServices, setSelectedSubServices] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // 1. Supabase හෝ Backup දත්ත ලෝඩ් කිරීම
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase.from("services").select("*");
        
        if (error || !data || data.length === 0) {
          throw new Error("Supabase load failed, using backup data");
        }
        setAllServices(data);
      } catch (err) {
        console.log("Database connection note: Running with local backup structure");
        setAllServices([
          { id: 1, name: "Full Band (Wedding Electric Acoustic)", price: 75000, parent_id: null },
          { id: 2, name: "Full Band (Outdoor Show)", price: 120000, parent_id: null },
          { id: 3, name: "DJ Services", price: 35000, parent_id: null },
          { id: 4, name: "Professional Lighting Setup", price: 25000, parent_id: 1 },
          { id: 5, name: "LED Video Wall Systems", price: 45000, parent_id: 1 },
          { id: 6, name: "Wedding Video Production", price: 50000, parent_id: 1 },
          { id: 7, name: "Multi Camera Production", price: 60000, parent_id: 2 },
          { id: 8, name: "Large LED Wall Setup", price: 80000, parent_id: 2 },
          { id: 9, name: "Heavy Lighting Setup", price: 40000, parent_id: 2 }
        ]);
      }
    };
    fetchServices();
  }, []);

  const mainCategories = allServices.filter(s => s.parent_id === null);
  const activeSubCategories = allServices.filter(s => String(s.parent_id) === String(selectedMainCategory));

  const handleSubServiceChange = (serviceId: string) => {
    let updatedSubs = [...selectedSubServices];
    if (updatedSubs.includes(serviceId)) {
      updatedSubs = updatedSubs.filter(id => id !== serviceId);
    } else {
      updatedSubs.push(serviceId);
    }
    setSelectedSubServices(updatedSubs);
    calculateTotal(selectedMainCategory, updatedSubs);
  };

  const handleMainCategoryChange = (mainId: string) => {
    setSelectedMainCategory(mainId);
    setSelectedSubServices([]);
    calculateTotal(mainId, []);
  };

  const calculateTotal = (mainId: string, subIds: string[]) => {
    let total = 0;
    const mainService = allServices.find(s => String(s.id) === String(mainId));
    if (mainService) total += Number(mainService.price || 0);

    subIds.forEach(id => {
      const subService = allServices.find(s => String(s.id) === String(id));
      if (subService) total += Number(subService.price || 0);
    });
    setTotalPrice(total);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedMainCategory) {
      alert("Please select a Main Booking Category");
      setLoading(false);
      return;
    }

    const mainName = allServices.find(s => String(s.id) === String(selectedMainCategory))?.name || "";
    const subNames = selectedSubServices
      .map(id => allServices.find(s => String(s.id) === String(id))?.name)
      .filter(Boolean)
      .join(", ");

    const finalCategoryText = subNames ? `${mainName} (With: ${subNames})` : mainName;

    try {
      const bookingData: any = {
        full_name: fullName,
        phone: phone,
        category: finalCategoryText, 
        event_date: eventDate,
        location: location,
        status: "Pending"
      };

      if (description) bookingData.description = description;
      if (totalPrice) bookingData.total_price = totalPrice;

      const { error } = await supabase.from("bookings").insert([bookingData]);

      if (error) throw error;
      alert("Booking Submitted Successfully!");
      
      // Reset Form
      setFullName("");
      setPhone("");
      setSelectedMainCategory("");
      setSelectedSubServices([]);
      setEventDate("");
      setLocation("");
      setDescription("");
      setTotalPrice(0);
    } catch (err: any) {
      console.error("Booking error:", err);
      alert("Submit Demo: " + (err.message || "Saved to console"));
    } finally {
      setLoading(false);
    }
  };

  // 🔴 Error එක ආපු තැන කෙටි කර නිවැරදි කර ඇත
  const galleryImages = [
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81",
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
    "https://images.unsplash.com/photo-1511578314322-379afb476865",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
  ];

  const packages = [
    { name: "Basic Package", price: "Contact Us", details: "2 Cameras • Basic Audio • Streaming" },
    { name: "Standard Package", price: "Contact Us", details: "4 Cameras • LED • Lighting • Audio" },
    { name: "Premium Package", price: "Contact Us", details: "Full Production Setup" },
  ];  

  const servicesStatic = [
    "Live Streaming", "LED Wall Systems", "Multi Camera Production", 
    "Professional Lighting", "Sound Systems", "Wedding Video", 
    "Concert video", "Studio Production"
  ];

  return (
    <main className="bg-zinc-950 text-white min-h-screen font-sans selection:bg-red-500 selection:text-white px-4 md:px-8 xl:px-16 pt-28 pb-12">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <span className="text-xl md:text-2xl font-black tracking-widest bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent uppercase">Irosh</span>
          <span className="text-xl md:text-2xl font-black tracking-widest bg-red-600 px-2 py-0.5 rounded text-white uppercase text-xs md:text-base">Ent</span>
        </div>
        <button onClick={() => router.push("/login")} className="bg-zinc-900 hover:bg-red-600 border border-zinc-800 hover:border-red-600 px-5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 shadow-lg">Login</button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden rounded-3xl border border-zinc-800/80 bg-black shadow-2xl" style={{ marginBottom: "100px" }}>
        <img src="https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2" className="absolute inset-0 w-full h-full object-cover opacity-20 scale-105" alt="Hero Background" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950" />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto py-20">
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
            <span className="text-white block md:inline">IROSH</span>{" "}
            <span className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent block md:inline">ENTERTAINMENT</span>
          </h1>
          <p className="text-lg md:text-2xl text-zinc-400 mb-12 font-light tracking-wide">Bringing Your Events To Life With Professional Touch</p>
          <div className="flex gap-5 justify-center flex-wrap">
            <a href="#booking" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-red-600/20">Book Event</a>
            <a href="https://wa.me/94777432573" target="_blank" rel="noopener noreferrer" className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:-translate-y-1">WhatsApp Us</a>
          </div>
        </div>
      </section>

      {/* 1. Our Services */}
      <section className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 md:p-16 shadow-xl" style={{ marginBottom: "100px" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-8 mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">OUR SERVICES</h2>
              <p className="text-zinc-500 text-sm mt-1">What we can do for your premium events</p>
            </div>
            <div className="w-16 h-1 bg-red-600 rounded-full mt-4 md:mt-0" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesStatic.map((service) => (
              <div key={service} className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 hover:border-red-500/50 hover:bg-zinc-900 transition-all duration-300 group cursor-pointer">
                <h3 className="text-lg font-bold text-zinc-300 group-hover:text-red-500 transition-colors duration-300">{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Event Gallery */}
      <section className="bg-zinc-900/20 border border-zinc-800/60 rounded-3xl p-8 md:p-16 shadow-xl" style={{ marginBottom: "100px" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-8 mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">EVENT GALLERY</h2>
              <p className="text-zinc-500 text-sm mt-1">Recent visual highlights from our productions</p>
            </div>
            <div className="w-16 h-1 bg-red-600 rounded-full mt-4 md:mt-0" />
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 aspect-[4/3] group">
                <img src={`${image}?auto=format&fit=crop&w=1000&q=80`} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out opacity-80 group-hover:opacity-100" alt={`Gallery Image ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Packages */}
      <section className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 md:p-16 shadow-xl" style={{ marginBottom: "100px" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-8 mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">OUR PACKAGES</h2>
              <p className="text-zinc-500 text-sm mt-1">Select the perfect system for your budget</p>
            </div>
            <div className="w-16 h-1 bg-red-600 rounded-full mt-4 md:mt-0" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.name} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-red-500 mb-2">{pkg.name}</h3>
                  <p className="text-3xl font-black mb-6 tracking-tight text-white">{pkg.price}</p>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed border-t border-zinc-800 pt-4 mt-4">{pkg.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Booking Form */}
      <section id="booking" className="bg-zinc-900/20 border border-zinc-800/60 rounded-3xl p-8 md:p-16 shadow-xl" style={{ marginBottom: "100px" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-3">ONLINE BOOKING</h2>
            <p className="text-zinc-400 text-sm">Select your main package and add extra services in real-time.</p>
          </div>

          <form onSubmit={handleBooking} className="grid gap-5 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-lg">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Customer Name</label>
                <input type="text" placeholder="Ex: Sunera Perera" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-sm text-white w-full focus:outline-none focus:border-red-500" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Contact Number</label>
                <input type="text" placeholder="Ex: 0777432573" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-sm text-white w-full focus:outline-none focus:border-red-500" required />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Step 1: Select Main Event Category</label>
              <select value={selectedMainCategory} onChange={(e) => handleMainCategoryChange(e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-sm text-zinc-300 w-full cursor-pointer focus:outline-none focus:border-red-500" required>
                <option value="" disabled hidden>Choose main system category...</option>
                {mainCategories.map((main) => (
                  <option key={main.id} value={main.id}>{main.name} {Number(main.price || 0) > 0 ? `(Rs. ${Number(main.price).toLocaleString()})` : ""}</option>
                ))}
              </select>
            </div>

            {selectedMainCategory && activeSubCategories.length > 0 && (
              <div className="flex flex-col gap-3 mt-2 border-t border-zinc-900 pt-4">
                <label className="text-xs font-bold uppercase tracking-wider text-red-500">Step 2: Add Optional Sub Services / Add-ons</label>
                <div className="grid sm:grid-cols-2 gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                  {activeSubCategories.map((sub) => (
                    <label key={sub.id} className={`flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer transition-all duration-200 select-none ${selectedSubServices.includes(String(sub.id)) ? "bg-red-950/40 border-red-500/60 text-white" : "bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:border-zinc-700"}`}>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={selectedSubServices.includes(String(sub.id))} onChange={() => handleSubServiceChange(String(sub.id))} className="accent-red-600 h-4 w-4 cursor-pointer" />
                        <span className="text-xs md:text-sm font-medium">{sub.name}</span>
                      </div>
                      <span className="text-xs font-bold text-zinc-400">+ LKR {sub.price ? Number(sub.price).toLocaleString() : "0"}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Booking Date</label>
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-red-500" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Event Location</label>
                <input type="text" placeholder="Ex: Kandy" value={location} onChange={(e) => setLocation(e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-red-500" required />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Event Description / Additional Notes</label>
              <textarea placeholder="Event timeline, specific requirements etc..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-sm text-white w-full resize-none focus:outline-none focus:border-red-500" />
            </div>

            <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-5 flex justify-between items-center mt-2 shadow-inner">
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Estimated Total Balance</p>
                <p className="text-2xl md:text-3xl font-black text-amber-500 mt-1">LKR {totalPrice.toLocaleString()}.00</p>
              </div>
              <span className="text-[10px] bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-md text-zinc-400 uppercase tracking-wider font-semibold">Live Calculated</span>
            </div>

            <button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white py-4 rounded-xl text-base font-bold transition-all duration-300 shadow-md mt-2 cursor-pointer">
              {loading ? "Processing..." : "Book Event Now"}
            </button>
          </form>
        </div>
      </section>

      {/* 5. Contact Section */}
      <section className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 md:p-16 shadow-xl" style={{ marginBottom: "40px" }}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2">CONTACT US</h2>
            <div className="w-16 h-1 bg-red-600 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all duration-300">
              <h3 className="text-lg font-bold text-red-500 mb-2">Phone</h3>
              <p className="text-base text-zinc-300 font-medium">+94 77 743 2573</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all duration-300">
              <h3 className="text-lg font-bold text-red-500 mb-2">WhatsApp</h3>
              <p className="text-base text-zinc-300 font-medium">+94 77 743 2573</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all duration-300">
              <h3 className="text-lg font-bold text-red-500 mb-2">Location</h3>
              <p className="text-lg text-zinc-300 font-medium">Galewela, Sri Lanka</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border border-zinc-900 py-8 text-center text-zinc-500 text-xs bg-zinc-950 rounded-2xl tracking-wider">
        © 2026 IROSH ENTERTAINMENT | ALL RIGHTS RESERVED
      </footer>
    </main>
  );
}