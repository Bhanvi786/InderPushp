import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RotateCcw, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Return Policy | InderPushp House of Art",
  description:
    "Return & cancellation policy for handcrafted mosaic artworks by InderPushp.",
};

export default function ReturnPolicyPage() {
  const policyPoints = [
    "Returns won't be accepted for change of mind or personal preference, as the artworks are handmade.",
    "If an artwork arrives damaged, defective or incorrect, the customer can contact us within 48 hours of delivery with photos and opening video.",
    "For customised artworks, cancellations won't be accepted once the work has started.",
    "If there's any issue from our side, we can offer a replacement, repair or refund depending on the situation.",
    "Approved refunds will be processed through the original payment method.",
  ];

  return (
    <main className="w-full min-h-screen bg-[#FAF7F0] flex flex-col text-[#263248]">
      {/* Navigation */}
      <Header />

      {/* Title Header */}
      <section className="w-full bg-[#263248] pt-[84px] md:pt-[96px] pb-10 sm:pb-12 text-[#FAF7F0] border-b border-[#B79A5A]/30">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-2">
          <span className="text-[10px] sm:text-xs font-sans tracking-[0.25em] uppercase text-[#D8C594] font-medium block">
            InderPushp House of Art
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-[#FAF7F0] tracking-tight">
            Return Policy
          </h1>
        </div>
      </section>

      {/* Policy Card */}
      <section className="flex-1 py-12 sm:py-16 px-5 sm:px-8 max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#B79A5A]/30 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#FAF7F0]">
            <div className="w-9 h-9 rounded-full bg-[#B79A5A]/15 text-[#B79A5A] flex items-center justify-center shrink-0">
              <RotateCcw size={18} />
            </div>
            <div>
              <h2 className="font-serif text-[#263248] text-lg sm:text-xl font-medium">
                Studio Terms
              </h2>
            </div>
          </div>

          <ul className="space-y-4 font-sans text-sm sm:text-base text-[#4B5568] leading-relaxed">
            {policyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#B79A5A] mt-2 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="pt-6 border-t border-[#FAF7F0] flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-xs font-sans text-[#263248] hover:text-[#B79A5A] font-medium transition-colors"
            >
              <span>&larr; Back to Shopping Bag</span>
            </Link>

            <a
              href="https://wa.me/919911145052?text=Hello%20Geetu,%20I%20have%20a%20question%20regarding%20the%20return%20policy."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#263248] hover:bg-[#384055] text-[#FAF7F0] text-xs font-sans uppercase tracking-wider font-semibold transition-all shadow-sm"
            >
              <span>Contact on WhatsApp</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
