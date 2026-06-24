"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function QuotationsPage() {
  const quotationRef = useRef<HTMLDivElement>(null);

  const [clientName, setClientName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [packageName, setPackageName] = useState("");
  const [amount, setAmount] = useState("");
  const [terms, setTerms] = useState("");

  const generatePDF = async () => {
    if (!quotationRef.current) return;

    // Canvas එක හරියටම පිටුව වගේම හදන්න
    const canvas = await html2canvas(quotationRef.current, { 
        backgroundColor: "#ffffff", 
        useCORS: true, 
        scale: 2,
        logging: false,
        width: quotationRef.current.offsetWidth,
        height: quotationRef.current.offsetHeight
    });

    const imgData = canvas.toDataURL("image/png");
    
    // A4 ප්‍රමාණය (210mm x 297mm)
    const pdf = new jsPDF("p", "mm", "a4");
    
    // මායිම් නොමැතිව හරියටම පිටුවට ගැළපීමට 0,0,210,297 යොදන්න
    pdf.addImage(imgData, "PNG", 0, 0, 210, 297); 
    pdf.save(`Quotation_${clientName || "Event"}.pdf`);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        
        {/* පෝරමය */}
        <div style={{ background: "#18181b", padding: "20px", borderRadius: "15px" }}>
          <h2 style={{ marginBottom: "20px" }}>Generate Quotation</h2>
          <input placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", color: "#000" }} />
          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", color: "#000" }} />
          <textarea placeholder="Package Details" value={packageName} onChange={(e) => setPackageName(e.target.value)} style={{ width: "100%", height: "120px", padding: "10px", marginBottom: "10px", borderRadius: "5px", color: "#000" }} />
          <input placeholder="Amount (Rs.)" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", color: "#000" }} />
          <textarea placeholder="Terms & Conditions" value={terms} onChange={(e) => setTerms(e.target.value)} style={{ width: "100%", height: "80px", padding: "10px", marginBottom: "10px", borderRadius: "5px", color: "#000" }} />
          <button onClick={generatePDF} style={{ width: "100%", padding: "15px", background: "#dc2626", color: "white", border: "none", cursor: "pointer", borderRadius: "5px", fontWeight: "bold" }}>Download PDF</button>
        </div>

        {/* Letterhead Preview - Alignment සැකසීම */}
        <div ref={quotationRef} style={{ 
          background: "#fff", 
          color: "#000", 
          width: "210mm", 
          height: "297mm", 
          position: "relative",
          margin: "0", 
          padding: "0",
          backgroundImage: "url('/irosh-letterhead.png')", 
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          backgroundRepeat: "no-repeat" 
        }}>
          {/* අන්තර්ගතය රූපයේ උඩින් තැබීමට - පින්තූරයේ ඉහළ ඉඩ අනුව මෙය සකසන්න */}
          <div style={{ paddingTop: "250px", width: "100%" }}> 
            <div style={{ maxWidth: "80%", margin: "0 auto" }}>
              <p><strong>To:</strong> {clientName}</p>
              <p><strong>Date:</strong> {eventDate}</p>
              
              <div style={{ marginTop: "20px" }}>
                <strong>Sound System Package:</strong>
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "14px" }}>{packageName}</pre>
              </div>

              <div style={{ marginTop: "30px", fontWeight: "bold", fontSize: "18px" }}>
                Total Price: Rs. {Number(amount).toLocaleString()}.00/=
              </div>

              <div style={{ marginTop: "30px" }}>
                <strong>Terms & Conditions:</strong>
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "12px" }}>{terms}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}