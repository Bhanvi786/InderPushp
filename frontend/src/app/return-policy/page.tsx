import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Clock,
  Video,
  FileCheck2,
  HelpCircle,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Studio Return & Cancellation Policy | InderPushp House of Art",
  description:
    "Learn about our studio return, damage replacement, and bespoke commission terms for authentic handcrafted mosaic artworks by Geetu Jaidka.",
};

export default function ReturnPolicyPage() {
  return (
    <main className="w-full min-h-screen bg-[#FAF7F0] flex flex-col text-[#263248]">
      {/* Navigation */}
      <Header />

      {/* Hero Banner in atelier navy & champagne gold */}
      <section className="w-full bg-[#263248] pt-[84px] md:pt-[96px] pb-12 sm:pb-14 text-[#FAF7F0] border-b border-[#B79A5A]/30">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F0]/10 border border-[#B79A5A]/40 text-[#D8C594] text-[10px] sm:text-xs font-sans tracking-[0.25em] uppercase font-medium">
            <Sparkles size={12} className="text-[#B79A5A]" />
            <span>Studio Care &amp; Patron Assurance</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#FAF7F0] tracking-tight">
            Return &amp; Cancellation Policy
          </h1>
          <p className="text-xs sm:text-sm font-sans text-[#FAF7F0]/80 max-w-xl mx-auto leading-relaxed font-light">
            Each InderPushp creation is meticulously handcrafted using hand-cut stained glass, Italian smalti, and bespoke materials. We hold our craft and your experience to the highest standard.
          </p>
        </div>
      </section>

      {/* Main Policy Content Container */}
      <section className="flex-1 py-12 sm:py-16 px-5 sm:px-8 md:px-12 max-w-4xl mx-auto w-full space-y-8 sm:space-y-10">
        
        {/* Quick Highlights / Principles Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-[#B79A5A]/30 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-full bg-[#B79A5A]/15 text-[#B79A5A] flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <h2 className="font-serif text-[#263248] text-base font-semibold">
              Handcrafted Integrity
            </h2>
            <p className="text-xs font-sans text-[#4B5568] leading-relaxed">
              Every glass tile is manually cut and placed. Minor organic variations are hallmarks of true artisanal mosaic art.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#B79A5A]/30 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-full bg-[#B79A5A]/15 text-[#B79A5A] flex items-center justify-center">
              <Clock size={18} />
            </div>
            <h2 className="font-serif text-[#263248] text-base font-semibold">
              48-Hour Notice
            </h2>
            <p className="text-xs font-sans text-[#4B5568] leading-relaxed">
              In the rare event of transit damage, notify our studio within 48 hours with parcel photos and an opening video.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#B79A5A]/30 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-full bg-[#B79A5A]/15 text-[#B79A5A] flex items-center justify-center">
              <RotateCcw size={18} />
            </div>
            <h2 className="font-serif text-[#263248] text-base font-semibold">
              Dedicated Resolution
            </h2>
            <p className="text-xs font-sans text-[#4B5568] leading-relaxed">
              If an issue arises from our side, we promptly offer replacement, expert studio repair, or an approved refund.
            </p>
          </div>
        </div>

        {/* Detailed Clauses Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#B79A5A]/30 shadow-sm space-y-8">
          
          {/* Clause 1: Handmade Art Nature & Change of Mind */}
          <div className="space-y-2 pb-6 border-b border-[#FAF7F0]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#B79A5A]" />
              <h2 className="font-serif text-lg sm:text-xl text-[#263248] font-medium">
                1. Handmade Nature &amp; Change of Mind
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#4B5568] leading-relaxed pl-4.5">
              Because all artworks created at InderPushp are handmade originals crafted over dozens of hours with individual glass cuts, <strong>returns cannot be accepted for change of mind or personal preference</strong> once an order has been finalized and dispatched. We encourage patrons to review high-resolution images, video showcases, and dimensions provided on the artwork listing or consult us beforehand.
            </p>
          </div>

          {/* Clause 2: Transit Damage, Defect, or Incorrect Item */}
          <div className="space-y-2 pb-6 border-b border-[#FAF7F0]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#B79A5A]" />
              <h2 className="font-serif text-lg sm:text-xl text-[#263248] font-medium">
                2. Damaged, Defective, or Incorrect Artworks (48 Hours)
              </h2>
            </div>
            <div className="space-y-2.5 font-sans text-xs sm:text-sm text-[#4B5568] leading-relaxed pl-4.5">
              <p>
                We package each piece in multi-layered museum-grade protective cushioning and wooden framing to ensure safe arrival. However, if your artwork arrives damaged, defective, or incorrect:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-[#263248]">
                <li>
                  Contact us within <strong>48 hours of delivery</strong>.
                </li>
                <li>
                  Provide clear photos of the shipping box, shipping label, and damaged areas.
                </li>
                <li>
                  Share a continuous <strong>package opening video</strong> recorded during unboxing to substantiate carrier insurance claims.
                </li>
              </ul>
              <p className="text-[11px] text-[#4B5568]/80 italic">
                Claims raised after 48 hours of delivery cannot be entertained due to courier and transit insurance constraints.
              </p>
            </div>
          </div>

          {/* Clause 3: Custom & Commissioned Artworks */}
          <div className="space-y-2 pb-6 border-b border-[#FAF7F0]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#B79A5A]" />
              <h2 className="font-serif text-lg sm:text-xl text-[#263248] font-medium">
                3. Custom &amp; Bespoke Commissions
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#4B5568] leading-relaxed pl-4.5">
              For customised artworks, tailored dimensions, personalized motifs, or color variations, <strong>cancellations or design reversals cannot be accepted once studio creation has started</strong>. Raw materials, glass sheets, and framing are sourced and hand-cut exclusively for your bespoke commission.
            </p>
          </div>

          {/* Clause 4: Replacements, Repairs & Refunds */}
          <div className="space-y-2 pb-6 border-b border-[#FAF7F0]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#B79A5A]" />
              <h2 className="font-serif text-lg sm:text-xl text-[#263248] font-medium">
                4. Resolution: Replacement, Repair, or Refund
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#4B5568] leading-relaxed pl-4.5">
              If an issue is verified as having occurred from our studio or during transit:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-6 font-sans text-xs sm:text-sm text-[#263248]">
              <li>
                We will offer an <strong>exact replacement</strong> or fresh studio recreation where feasible.
              </li>
              <li>
                Offer <strong>expert studio restoration or repair</strong> with reverse courier pickup arranged by us.
              </li>
              <li>
                Issue a <strong>full or partial refund</strong> if replacement or repair is not possible.
              </li>
            </ul>
          </div>

          {/* Clause 5: Refund Processing */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#B79A5A]" />
              <h2 className="font-serif text-lg sm:text-xl text-[#263248] font-medium">
                5. Refund Processing Timeline
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#4B5568] leading-relaxed pl-4.5">
              Once an approved refund is authorized by our studio, it will be credited back via the <strong>original payment method</strong> (UPI, bank transfer, or card) within <strong>5–7 business days</strong>, depending on your financial institution.
            </p>
          </div>
        </div>

        {/* Contact & Support Help Box */}
        <div className="bg-gradient-to-br from-[#263248] to-[#1E2738] rounded-2xl p-6 sm:p-8 text-[#FAF7F0] border border-[#B79A5A]/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#D8C594] font-semibold block">
              Have Questions Before Acquiring?
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-medium">
              Speak directly with Master Artist Geetu Jaidka
            </h3>
            <p className="text-xs sm:text-sm text-[#FAF7F0]/75 max-w-md">
              We are delighted to share extra photos, video angles, or custom measurements before you place your order.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="https://wa.me/919911145052?text=Hello%20Geetu,%20I%20have%20a%20question%20regarding%20an%20artwork%20and%20return%20policy."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B79A5A] hover:bg-[#A58849] text-[#263248] font-sans text-xs uppercase tracking-wider font-semibold transition-all shadow-md active:scale-95"
            >
              <MessageCircle size={15} />
              <span>WhatsApp Studio</span>
            </a>

            <Link
              href="/cart"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F0] font-sans text-xs uppercase tracking-wider font-medium transition-colors border border-white/20"
            >
              <span>Back to Cart</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
