"use client";

import React, { useState } from "react";
import { contactApi, ContactEnquiryPayload } from "@/lib/api";
import {
  Mail,
  MessageCircle,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
} from "lucide-react";

interface ContactSectionProps {
  id?: string;
  className?: string;
  showPersonalQuote?: boolean;
}

export default function ContactSection({
  id = "contact",
  className = "",
  showPersonalQuote = true,
}: ContactSectionProps) {
  const [formData, setFormData] = useState<ContactEnquiryPayload>({
    fullName: "",
    email: "",
    phone: "",
    subject: "Enquiry About an Artwork",
    message: "",
    botTrap: "", // Honeypot field for bot protection
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string>("");

  // Validate a single field
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Please enter your full name";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value.trim()) return "Please enter your email address";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return "Please enter a valid email address (e.g. name@example.com)";
        }
        return "";
      case "phone":
        if (!value.trim()) return "Please enter your phone number";
        const digitsOnly = value.replace(/[\s\-\(\)\+]/g, "");
        if (digitsOnly.length < 7 || digitsOnly.length > 15 || !/^\+?[0-9\s\-\(\)]+$/.test(value)) {
          return "Please enter a valid phone number (7-15 digits)";
        }
        return "";
      case "message":
        if (!value.trim()) return "Please write a brief message or description of your enquiry";
        if (value.trim().length < 5) return "Message must be at least 5 characters";
        return "";
      default:
        return "";
    }
  };

  // Validate all form fields
  const validate = (): boolean => {
    const errors: Record<string, string> = {
      fullName: validateField("fullName", formData.fullName),
      email: validateField("email", formData.email),
      phone: validateField("phone", formData.phone || ""),
      message: validateField("message", formData.message),
    };

    // Remove empty error keys
    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });

    setFormErrors(errors);
    // Mark all as touched on submit attempt
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      message: true,
    });

    return Object.keys(errors).length === 0;
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // If field was already touched or has error, validate in real time
    if (touched[name] || formErrors[name]) {
      const errorMsg = validateField(name, value);
      setFormErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setServerMessage("");

    try {
      const res = await contactApi.sendEnquiry(formData);
      setSubmitStatus("success");
      setServerMessage(res.message || "Thank you! Your enquiry has been received.");
      // Reset form after successful submission
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "Enquiry About an Artwork",
        message: "",
        botTrap: "",
      });
      setFormErrors({});
      setTouched({});
    } catch (err: any) {
      setSubmitStatus("error");
      setServerMessage(
        err?.message || "We were unable to submit your message. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id={id} className={`py-12 sm:py-16 md:py-20 px-5 sm:px-8 lg:px-10 max-w-[1120px] mx-auto w-full ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* LEFT COLUMN: Contact Information */}
        <div className="md:col-span-5 space-y-6">
          <div>
            <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#B79A5A] font-semibold block mb-1.5">
              Direct Contact
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-medium text-[#263248] tracking-tight mb-2.5">
              I&apos;d Love to Hear From You
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#263248]/85 leading-relaxed font-light">
              Every artwork begins with an idea, and sometimes that idea begins with a conversation. Whether you&apos;re interested in an existing piece or have something special in mind, feel free to reach out.
            </p>
          </div>

          {/* Configured Contact Channels */}
          <div className="space-y-3 pt-1 border-t border-[#B79A5A]/20">
            
            {/* WhatsApp Direct Chat */}
            <a
              href="https://wa.me/919911145052?text=Hello%20Geetu,%20I%20am%20interested%20in%20Inderpushp%20mosaic%20artworks."
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3.5 p-3 sm:p-3.5 rounded-xl bg-white border border-[#B79A5A]/25 hover:border-[#B79A5A] hover:shadow-sm transition-all"
            >
              <div className="p-2 rounded-lg bg-[#263248] text-[#D8C594] group-hover:bg-[#B79A5A] group-hover:text-white transition-colors">
                <MessageCircle size={16} />
              </div>
              <div>
                <span className="text-[11px] font-sans uppercase tracking-wider text-gray-500 font-semibold block">
                  WhatsApp Chat / Call
                </span>
                <span className="text-xs sm:text-sm font-sans font-medium text-[#263248] group-hover:text-[#B79A5A] transition-colors">
                  +91 99111 45052
                </span>
                <span className="text-[10px] font-sans text-gray-400 block mt-0.5">
                  Click to open direct chat on WhatsApp
                </span>
              </div>
            </a>

            {/* Email Direct Contact */}
            <a
              href="mailto:inderpushphouseofart@yahoo.com"
              className="group flex items-start gap-3.5 p-3 sm:p-3.5 rounded-xl bg-white border border-[#B79A5A]/25 hover:border-[#B79A5A] hover:shadow-sm transition-all"
            >
              <div className="p-2 rounded-lg bg-[#263248] text-[#D8C594] group-hover:bg-[#B79A5A] group-hover:text-white transition-colors">
                <Mail size={16} />
              </div>
              <div>
                <span className="text-[11px] font-sans uppercase tracking-wider text-gray-500 font-semibold block">
                  Direct Email
                </span>
                <span className="text-xs sm:text-sm font-sans font-medium text-[#263248] group-hover:text-[#B79A5A] transition-colors break-all">
                  inderpushphouseofart@yahoo.com
                </span>
                <span className="text-[10px] font-sans text-gray-400 block mt-0.5">
                  Click to send an email directly to the studio
                </span>
              </div>
            </a>

            {/* Instagram Profile */}
            <a
              href="https://www.instagram.com/_inderpushp?exln=Z2tuNXNwOXZ5Ym40"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3.5 p-3 sm:p-3.5 rounded-xl bg-white border border-[#B79A5A]/25 hover:border-[#B79A5A] hover:shadow-sm transition-all"
            >
              <div className="p-2 rounded-lg bg-[#263248] text-[#D8C594] group-hover:bg-[#B79A5A] group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </div>
              <div>
                <span className="text-[11px] font-sans uppercase tracking-wider text-gray-500 font-semibold block">
                  Instagram Atelier
                </span>
                <span className="text-xs sm:text-sm font-sans font-medium text-[#263248] group-hover:text-[#B79A5A] transition-colors">
                  @_inderpushp
                </span>
                <span className="text-[10px] font-sans text-gray-400 block mt-0.5">
                  Explore daily studio snapshots & works in progress
                </span>
              </div>
            </a>

            {/* Studio Location / Presence */}
            <div className="flex items-start gap-3.5 p-3 sm:p-3.5 rounded-xl bg-[#FAF7F0] border border-[#B79A5A]/20">
              <div className="p-2 rounded-lg bg-[#FAF7F0] text-[#B79A5A] border border-[#B79A5A]/30">
                <MapPin size={16} />
              </div>
              <div>
                <span className="text-[11px] font-sans uppercase tracking-wider text-gray-500 font-semibold block">
                  Studio Location
                </span>
                <span className="text-xs sm:text-sm font-sans font-medium text-[#263248]">
                  India
                </span>
                <span className="text-[10px] font-sans text-gray-400 block mt-0.5">
                  Handmade artworks carefully shipped nationwide
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Contact Form */}
        <div className="md:col-span-7">
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-[#B79A5A]/30 shadow-sm">
            <div className="mb-4">
              <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#263248] tracking-tight">
                Send Me a Message
              </h3>
              <p className="text-xs font-sans text-[#263248]/70 mt-0.5 font-light">
                Tell me a little about what you have in mind.
              </p>
            </div>

            {/* Success Notification Banner */}
            {submitStatus === "success" && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2.5 animate-fade-up">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-sans font-bold block mb-0.5">
                    Enquiry Received!
                  </span>
                  <p className="text-xs font-sans text-emerald-800 leading-relaxed">
                    {serverMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Error Notification Banner */}
            {submitStatus === "error" && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2.5 animate-fade-up">
                <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-sans font-bold block mb-0.5">
                    Submission Unsuccessful
                  </span>
                  <p className="text-xs font-sans text-rose-800 leading-relaxed">
                    {serverMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Contact Form Element */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Honeypot Spam Field (Hidden from real users) */}
              <input
                type="text"
                name="botTrap"
                value={formData.botTrap || ""}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {/* 1. Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-sans uppercase tracking-wider text-[#263248] font-semibold mb-1.5"
                >
                  Full Name <span className="text-[#B79A5A]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your name"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-sans bg-[#FAF7F0]/40 text-[#263248] focus:outline-none transition-all ${
                      touched.fullName && formErrors.fullName
                        ? "border-rose-400 focus:border-rose-500 bg-rose-50/20 shadow-xs"
                        : touched.fullName && !formErrors.fullName && formData.fullName.trim()
                        ? "border-emerald-500/80 focus:border-emerald-500 bg-white"
                        : "border-[#B79A5A]/30 focus:border-[#B79A5A] focus:bg-white"
                    }`}
                  />
                </div>
                {touched.fullName && formErrors.fullName && (
                  <p className="text-[11px] font-sans text-rose-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} className="shrink-0" />
                    {formErrors.fullName}
                  </p>
                )}
              </div>

              {/* 2. Email Address & 3. Phone Number (Responsive Row) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-sans uppercase tracking-wider text-[#263248] font-semibold mb-1.5"
                  >
                    Email Address <span className="text-[#B79A5A]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="name@example.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-sans bg-[#FAF7F0]/40 text-[#263248] focus:outline-none transition-all ${
                      touched.email && formErrors.email
                        ? "border-rose-400 focus:border-rose-500 bg-rose-50/20 shadow-xs"
                        : touched.email && !formErrors.email && formData.email.trim()
                        ? "border-emerald-500/80 focus:border-emerald-500 bg-white"
                        : "border-[#B79A5A]/30 focus:border-[#B79A5A] focus:bg-white"
                    }`}
                  />
                  {touched.email && formErrors.email && (
                    <p className="text-[11px] font-sans text-rose-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} className="shrink-0" />
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone (Required) */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-sans uppercase tracking-wider text-[#263248] font-semibold mb-1.5"
                  >
                    Phone Number <span className="text-[#B79A5A]">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="+91 ..."
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-sans bg-[#FAF7F0]/40 text-[#263248] focus:outline-none transition-all ${
                      touched.phone && formErrors.phone
                        ? "border-rose-400 focus:border-rose-500 bg-rose-50/20 shadow-xs"
                        : touched.phone && !formErrors.phone && formData.phone?.trim()
                        ? "border-emerald-500/80 focus:border-emerald-500 bg-white"
                        : "border-[#B79A5A]/30 focus:border-[#B79A5A] focus:bg-white"
                    }`}
                  />
                  {touched.phone && formErrors.phone && (
                    <p className="text-[11px] font-sans text-rose-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle size={12} className="shrink-0" />
                      {formErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* 4. Enquiry Subject Dropdown */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-xs font-sans uppercase tracking-wider text-[#263248] font-semibold mb-1.5"
                >
                  What Can I Help You With? <span className="text-[#B79A5A]">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#B79A5A]/30 focus:border-[#B79A5A] bg-[#FAF7F0]/40 focus:bg-white text-sm font-sans text-[#263248] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="Enquiry About an Artwork">Enquiry About an Artwork</option>
                  <option value="Personalised Commission">Personalised Commission</option>
                  <option value="Bulk or Corporate Enquiry">Bulk or Corporate Enquiry</option>
                  <option value="General Question">General Question</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* 5. Message Content */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    htmlFor="message"
                    className="block text-xs font-sans uppercase tracking-wider text-[#263248] font-semibold"
                  >
                    Message <span className="text-[#B79A5A]">*</span>
                  </label>
                  <span className="text-[10px] font-sans text-gray-400">
                    {formData.message.trim().length} chars (min 5)
                  </span>
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Tell me about your space, dimensions, or specific questions..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-sans bg-[#FAF7F0]/40 text-[#263248] focus:outline-none transition-all resize-y ${
                    touched.message && formErrors.message
                      ? "border-rose-400 focus:border-rose-500 bg-rose-50/20 shadow-xs"
                      : touched.message && !formErrors.message && formData.message.trim().length >= 5
                      ? "border-emerald-500/80 focus:border-emerald-500 bg-white"
                      : "border-[#B79A5A]/30 focus:border-[#B79A5A] focus:bg-white"
                  }`}
                />
                {touched.message && formErrors.message && (
                  <p className="text-[11px] font-sans text-rose-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} className="shrink-0" />
                    {formErrors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full bg-[#263248] hover:bg-[#B79A5A] text-[#FAF7F0] font-sans text-xs uppercase tracking-widest font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-[#D8C594]" />
                      <span>Submitting Your Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Enquiry</span>
                      <Send size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>

      </div>

      {/* Optional Understated Personal Touch */}
      {showPersonalQuote && (
        <div className="pt-14 sm:pt-16 text-center">
          <p className="text-base sm:text-lg font-serif italic text-[#B79A5A] font-light">
            &ldquo;Every meaningful piece begins with a conversation.&rdquo;
          </p>
        </div>
      )}
    </section>
  );
}
