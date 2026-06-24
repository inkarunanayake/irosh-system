"use client";

import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function QuotationsPage() {
  const quotationRef = useRef<HTMLDivElement>(null);

  // Form States
  const [clientName, setClientName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [packageName, setPackageName] = useState("");
  const [amount, setAmount] = useState("");

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
    <main style={{ minHeight: "100vh", background: "#000000", color: "#ffffff", padding: "24px" }}>
      <h1 style={{ marginBottom: "30px" }}>Quotation Generator</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        {/* Form එකට දැන් Package Details සහ අනිත් විස්තර එකතු කළ හැක */}
        <div style={{ background: "#18181b", padding: "24px", borderRadius: "24px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <input placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "none" }} />
          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "none" }} />
          <textarea placeholder="Package Details / Sound Setup" value={packageName} onChange={(e) => setPackageName(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "none", height: "150px" }} />
          <input placeholder="Total Price (Rs.)" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "none" }} />
          <button onClick={generatePDF} style={{ background: "#dc2626", padding: "16px", borderRadius: "14px", color: "white", fontWeight: "bold" }}>Download PDF</button>
        </div>

        {/* නිල ලිපි ශීර්ෂ ආකෘතිය (මෙතන කිසිවක් වෙනස් කිරීමට අවශ්‍ය නැත) */}
        <div ref={quotationRef} style={{ background: "#ffffff", color: "#000000", padding: "40px", minHeight: "900px" }}>
          <div style={{ textAlign: "center", borderBottom: "2px solid #000", paddingBottom: "20px" }}>
            <h1 style={{ fontSize: "30px", margin: "0" }}>IROSH Entertainment</h1>
            <p style={{ margin: "5px 0" }}>0777-432573, 077-9441340 | inkarunanayake@gmail.com</p>
            <p style={{ fontSize: "11px", fontWeight: "bold" }}>
              VIDEO PRODUCTION | SOUND SYSTEMS | MUSICAL BAND | DJ SERVICES | LED VIDEO WALL | Galewela
            </p>
            <p style={{ fontSize: "10px" }}>Reg no: cp.ga.1424</p>
          </div>

          <div style={{ marginTop: "30px" }}>
            <p><strong>Client:</strong> {clientName}</p>
            <p><strong>Date:</strong> {eventDate}</p>
          </div>

          <div style={{ marginTop: "30px" }}>
            <strong>Sound System Package:</strong>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{packageName}</pre>
          </div>

          <div style={{ marginTop: "40px", fontWeight: "bold", fontSize: "18px" }}>
            Total Price: Rs. {Number(amount).toLocaleString()}.00/=
          </div>
          
          <div style={{ marginTop: "100px", textAlign: "center", fontSize: "12px", color: "#555" }}>
            Quality Sound... Perfect Moments...
          </div>
        </div>
      </div>
    </main>
  );
}