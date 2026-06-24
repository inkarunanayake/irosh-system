"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function QuotationsPage() {
  const quotationRef = useRef<HTMLDivElement>(null);

  // States
  const [clientName, setClientName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [packageName, setPackageName] = useState("");
  const [amount, setAmount] = useState("");
  const [terms, setTerms] = useState("");

  const generatePDF = async () => {
    if (!quotationRef.current) return;
    const canvas = await html2canvas(quotationRef.current, { backgroundColor: "#ffffff", useCORS: true, scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Quotation_${clientName || "Event"}.pdf`);
  };

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        
        {/* පෝරමය */}
        <div style={{ background: "#18181b", padding: "20px", borderRadius: "15px" }}>
          {/* ... පෙර පරිදිම Inputs ... */}
          <input placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
          <textarea placeholder="Package Details" value={packageName} onChange={(e) => setPackageName(e.target.value)} style={{ width: "100%", height: "150px", padding: "10px", marginBottom: "10px" }} />
          <input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
          <button onClick={generatePDF} style={{ width: "100%", padding: "15px", background: "#dc2626", color: "white", border: "none", cursor: "pointer" }}>Download PDF</button>
        </div>

        {/* Letterhead Graphic එක සහිත කොටස */}
        <div ref={quotationRef} style={{ 
          background: "#fff", 
          color: "#000", 
          padding: "40px", 
          minHeight: "842px", 
          backgroundImage: "url('/irosh-letterhead.png')", // ඔබේ පින්තූරය මෙතනට
          backgroundSize: "contain", 
          backgroundPosition: "top center", 
          backgroundRepeat: "no-repeat" 
        }}>
          {/* ඔබේ Graphic එකේ ඉහළ කොටස දැනටමත් පින්තූරයේ ඇති නිසා, පල්ලෙහා දත්ත පමණක් පෙන්වන්න */}
          <div style={{ marginTop: "200px" }}> {/* පින්තූරයේ උස අනුව මෙය වෙනස් කරන්න */}
            <p><strong>To:</strong> {clientName}</p>
            <p><strong>Date:</strong> {eventDate}</p>
            <div style={{ marginTop: "20px" }}>
              <strong>Sound System Package:</strong>
              <pre style={{ whiteSpace: "pre-wrap" }}>{packageName}</pre>
            </div>
            <div style={{ marginTop: "30px", fontWeight: "bold" }}>
              Total: Rs. {Number(amount).toLocaleString()}.00/=
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}