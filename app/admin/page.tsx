"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState("Admin");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // බ්‍රවුසර් එක සම්පූර්ණයෙන්ම ලෝඩ් වෙනකම් සෙකන්ඩ් එකක් ඉඳලා චෙක් කිරීම (Router Error එක මඟහැරවීමට)
    const checkAuth = () => {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        router.push("/login");
        return;
      }

      const parsedUser = JSON.parse(savedUser);

      if (parsedUser.role !== "admin") {
        router.push("/login");
      } else {
        if (parsedUser.username) {
          setAdminName(parsedUser.username);
        }
        setIsLoading(false); // ඇඩ්මින් නිවැරදි නම් විතරක් පේජ් එක පෙන්වන්න
      }
    };

    // පොඩි Delay එකක් සහිතව රන් කිරීම
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  const menuItems = [
    {
      title: "Booking Management",
      description: "Manage and approve live customer show bookings",
      path: "/booking", // 404 එන නිසා ඔයාගේ ෆෝල්ඩර් එක තියෙන තැන අනුව මෙතන වෙනස් කරන්න (උදා: "/booking" හෝ "/admin/booking")
      badge: "Live Requests",
      icon: "📅",
      color: "hover:border-red-500/50 hover:shadow-red-950/10 hover:bg-red-950/10",
      textColor: "group-hover:text-red-500",
      footerBtn: "BOOKINGS",
      footerColor: "from-red-500 to-rose-600"
    },
    {
      title: "Homepage Editor",
      description: "Edit landing page text, packages, and gallery live",
      path: "/website-settings",
      badge: "CMS",
      icon: "🎨",
      color: "hover:border-amber-500/50 hover:shadow-amber-950/10 hover:bg-amber-950/10",
      textColor: "group-hover:text-amber-500",
      footerBtn: "EDITOR",
      footerColor: "from-amber-400 to-orange-500"
    },
    {
      title: "Worker Management",
      description: "Manage crew members and system access permissions",
      path: "/workers",
      badge: "Staff",
      icon: "👥",
      color: "hover:border-blue-500/50 hover:shadow-blue-950/10 hover:bg-blue-950/10",
      textColor: "group-hover:text-blue-500",
      footerBtn: "CREW STAFF",
      footerColor: "from-blue-400 to-indigo-600"
    },
    {
      title: "Inventory Management",
      description: "Track sound systems, lights and video production equipment",
      path: "/inventory",
      badge: "Assets",
      icon: "🔊",
      color: "hover:border-purple-500/50 hover:shadow-purple-950/10 hover:bg-purple-950/10",
      textColor: "group-hover:text-purple-500",
      footerBtn: "INVENTORY",
      footerColor: "from-purple-400 to-fuchsia-600"
    },
    {
      title: "Expenses Management",
      description: "Track event vehicle rent, meals and worker daily payments",
      path: "/expenses",
      badge: "Cash Out",
      icon: "💸",
      color: "hover:border-orange-500/50 hover:shadow-orange-950/10 hover:bg-orange-950/10",
      textColor: "group-hover:text-orange-500",
      footerBtn: "EXPENSES",
      footerColor: "from-orange-400 to-amber-600"
    },
    {
      title: "Quotation Management",
      description: "Create and print PDF digital invoices or job quotations",
      path: "/quotations",
      badge: "Invoicing",
      icon: "📄",
      color: "hover:border-emerald-500/50 hover:shadow-emerald-950/10 hover:bg-emerald-950/10",
      textColor: "group-hover:text-emerald-500",
      footerBtn: "INVOICES",
      footerColor: "from-emerald-400 to-teal-600"
    },
    {
      title: "Profit Dashboard",
      description: "Analyze your overall net income and financial business reports",
      path: "/profit-dashboard",
      badge: "Reports",
      icon: "📈",
      color: "hover:border-pink-500/50 hover:shadow-pink-950/10 hover:bg-pink-950/10",
      textColor: "group-hover:text-pink-500",
      footerBtn: "PROFITS",
      footerColor: "from-pink-400 to-rose-600"
    },
    {
      title: "Worker Dashboard",
      description: "Preview view allocated to field technicians and helpers",
      path: "/worker-dashboard",
      badge: "Preview",
      icon: "👷",
      color: "hover:border-cyan-500/50 hover:shadow-cyan-950/10 hover:bg-cyan-950/10",
      textColor: "group-hover:text-cyan-500",
      footerBtn: "WORKER VIEW",
      footerColor: "from-cyan-400 to-blue-500"
    }
  ];

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Auth එක චෙක් වෙනකම් Loading Screen එකක් පෙන්වීම (Page එක උඩට පැනීම වැළැක්වීමට)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center font-bold tracking-widest text-xs uppercase">
        Loading Irosh Panel...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6 md:p-12 font-sans relative overflow-hidden flex flex-col items-center">
      
      {/* Background Lighting Effects */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-zinc-800/20 blur-[150px] rounded-full pointer-events-none" />

      {/* FIXED NAV BAR එක සාමාන්‍ය static එකක් කරා වැහෙන ප්‍රශ්නය ස්ථිරවම ඉවර කරන්න */}
      <nav className="w-full max-w-7xl bg-zinc-900 border border-zinc-800 px-6 py-4 rounded-2xl flex justify-between items-center box-border mb-10 z-20 shadow-2xl">
        <div className="flex items-center gap-2">
          <span className="text-base md:text-lg font-black tracking-widest uppercase text-white">IROSH PANEL</span>
          <span className="bg-red-600 px-1.5 py-0.5 rounded text-white font-bold text-[10px] uppercase tracking-wider">v1.2</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/")} className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none outline-none">View Live Site</button>
          <button onClick={logout} className="bg-zinc-800 hover:bg-red-600 border border-zinc-700 hover:border-red-600 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer">Logout</button>
        </div>
      </nav>

      {/* Main Layout Wrapper */}
      <div className="w-full max-w-7xl flex flex-col gap-10 z-10">
        
        {/* Welcome Title Block (දැන් කිසිසේත්ම වැහෙන්නේ නැත!) */}
        <div className="flex justify-between items-center border-b border-zinc-900 pb-8 flex-wrap gap-5 w-full">
          <div className="flex flex-col gap-1 text-left">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none">
              Welcome, <span className="text-red-500 capitalize">{adminName}</span>
            </h1>
            <p className="text-zinc-500 text-xs md:text-sm font-medium tracking-wide mt-3">
              Irosh Sounds & Live Video Production Management Control Center
            </p>
          </div>
          <div className="text-xs bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl font-semibold text-zinc-400 tracking-wider flex items-center justify-center self-center">
            🟢 SYSTEM STATUS: ONLINE
          </div>
        </div>

        {/* Dynamic Colorful Aligned Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch">
          {menuItems.map((item) => (
            <button
              key={item.title}
              onClick={() => router.push(item.path)}
              className={`group bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 text-left transition-all duration-300 shadow-xl flex flex-col justify-between h-full box-border cursor-pointer min-h-[240px] ${item.color}`}
            >
              {/* Top Section */}
              <div className="flex flex-col gap-4 w-full">
                
                {/* Icon & Badge Row */}
                <div className="flex justify-between items-center w-full">
                  <span className="text-3xl filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800/80 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <span className="text-[9px] bg-zinc-950 border border-zinc-800 group-hover:border-zinc-700 text-zinc-500 group-hover:text-zinc-300 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider transition-colors shrink-0 whitespace-nowrap">
                    {item.badge}
                  </span>
                </div>

                {/* Header Row */}
                <div className="w-full">
                  <h2 className={`text-xl font-black tracking-tight text-zinc-100 transition-colors duration-300 ${item.textColor} leading-tight`}>
                    {item.title}
                  </h2>
                </div>
                
                {/* Description Text */}
                <p className="text-zinc-400 text-xs md:text-sm font-normal leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Action Row (Colorful Main Category Names) */}
              <div className="flex justify-between items-center w-full pt-4 mt-6 border-t border-zinc-900/40">
                <span className={`text-lg md:text-xl font-black tracking-widest bg-gradient-to-r ${item.footerColor} bg-clip-text text-transparent opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300`}>
                  {item.footerBtn}
                </span>
                <span className="text-zinc-600 group-hover:text-white transition-colors duration-300 text-sm font-bold">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer System Credits */}
        <div className="text-center text-zinc-600 text-[10px] tracking-widest uppercase mt-8 w-full">
          SECURE ADMIN GATEWAY • INTEGRATED WITH SUPABASE PRODUCTION DB
        </div>
      </div>
    </main>
  );
}