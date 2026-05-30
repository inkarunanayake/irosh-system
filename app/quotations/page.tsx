"use client";

import { useRef, useState } from "react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function QuotationsPage() {

  const quotationRef =
    useRef<HTMLDivElement>(null);

  const [clientName, setClientName] =
    useState("");

  const [eventType, setEventType] =
    useState("");

  const [eventDate, setEventDate] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [packageName, setPackageName] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const generatePDF = async () => {

    if (!quotationRef.current) return;

    const canvas = await html2canvas(
      quotationRef.current,
      {
        backgroundColor: "#ffffff",
        useCORS: true,
        scale: 2,
      }
    );

    const imgData =
      canvas.toDataURL("image/png");

    const pdf = new jsPDF(
      "p",
      "mm",
      "a4"
    );

    const pdfWidth =
      pdf.internal.pageSize.getWidth();

    const pdfHeight =
      (canvas.height * pdfWidth) /
      canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      pdfHeight
    );

    pdf.save(
      `${clientName || "quotation"}.pdf`
    );
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000000",
        color: "#ffffff",
        padding: "24px",
      }}
    >

      <h1
        style={{
          fontSize: "40px",
          fontWeight: "bold",
          marginBottom: "40px",
        }}
      >
        Quotation Generator
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "40px",
        }}
      >

        <div
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "24px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >

          <input
            type="text"
            placeholder="Client Name"
            value={clientName}
            onChange={(e) =>
              setClientName(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Event Type"
            value={eventType}
            onChange={(e) =>
              setEventType(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            type="date"
            value={eventDate}
            onChange={(e) =>
              setEventDate(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Package Name"
            value={packageName}
            onChange={(e) =>
              setPackageName(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <button
            onClick={generatePDF}
            style={{
              background: "#dc2626",
              color: "#ffffff",
              padding: "16px",
              border: "none",
              borderRadius: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Download PDF
          </button>

        </div>

        <div
          ref={quotationRef}
          style={{
            background: "#ffffff",
            color: "#000000",
            borderRadius: "24px",
            padding: "40px",
          }}
        >

          <div
            style={{
              borderBottom:
                "1px solid #d4d4d8",
              paddingBottom: "24px",
              marginBottom: "24px",
            }}
          >

            <h1
              style={{
                fontSize: "38px",
                fontWeight: "bold",
              }}
            >
              IROSH EVENT SYSTEM
            </h1>

            <p
              style={{
                color: "#71717a",
                marginTop: "10px",
              }}
            >
              Professional Event Solutions
            </p>

          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "32px",
            }}
          >

            <p>
              <strong>
                Client:
              </strong>{" "}
              {clientName ||
                "Client Name"}
            </p>

            <p>
              <strong>
                Event Type:
              </strong>{" "}
              {eventType ||
                "Event Type"}
            </p>

            <p>
              <strong>
                Event Date:
              </strong>{" "}
              {eventDate ||
                "Event Date"}
            </p>

            <p>
              <strong>
                Location:
              </strong>{" "}
              {location ||
                "Location"}
            </p>

          </div>

          <div
            style={{
              border:
                "1px solid #d4d4d8",
              borderRadius: "18px",
              overflow: "hidden",
              marginBottom: "40px",
            }}
          >

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                background: "#000000",
                color: "#ffffff",
                padding: "16px",
                fontWeight: "bold",
              }}
            >

              <div>
                Package
              </div>

              <div>
                Amount
              </div>

            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                padding: "16px",
              }}
            >

              <div>
                {packageName ||
                  "Package"}
              </div>

              <div>
                Rs.{" "}
                {amount || "0"}
              </div>

            </div>

          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "flex-end",
            }}
          >

            <div
              style={{
                textAlign: "right",
              }}
            >

              <p
                style={{
                  color: "#71717a",
                }}
              >
                Total Amount
              </p>

              <h2
                style={{
                  fontSize: "42px",
                  fontWeight: "bold",
                  color: "#dc2626",
                }}
              >

                Rs.{" "}
                {amount || "0"}

              </h2>

            </div>

          </div>

          <div
            style={{
              marginTop: "70px",
              textAlign: "center",
              color: "#71717a",
              fontSize: "14px",
            }}
          >

            Thank you for choosing
            IROSH EVENT SYSTEM

          </div>

        </div>

      </div>

    </main>
  );
}

const inputStyle = {
  width: "100%",
  background: "#000000",
  color: "#ffffff",
  border: "1px solid #3f3f46",
  borderRadius: "14px",
  padding: "14px",
  fontSize: "15px",
};