"use client";
import React from "react";
import Image from "next/image";

export default function Collections() {
  const collections = [
    { id: 1, title: "FLORAL", desc: "Inspired by nature's beauty" },
    { id: 2, title: "FIGURATIVE", desc: "Expressions in pieces" },
    { id: 3, title: "GEOMETRIC", desc: "Timeless patterns" },
    { id: 4, title: "ABSTRACT", desc: "Art beyond boundaries" },
    { id: 5, title: "NATURE", desc: "Elements of life" },
    { id: 6, title: "SPACES", desc: "For homes, workspaces & more" },
  ];

  return (
    <section className="w-full py-20 px-6 md:px-12 xl:px-20 bg-[#F8F4EA]">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="animate-fade-up delay-100">
            <h2 className="text-3xl md:text-4xl font-serif text-[#0B1F3A] mb-2 flex items-center gap-4">
              Our Collections
              <span className="hidden md:inline-block w-24 h-[1px] bg-[#B88932]/40"></span>
            </h2>
            <p className="text-[#10243D] text-sm md:text-base font-sans opacity-80">
              A range of styles, inspired by nature, culture and timeless patterns.
            </p>
          </div>
          
          <a href="#" className="hidden md:flex items-center gap-2 text-xs font-sans tracking-[0.2em] text-[#B88932] uppercase hover:text-[#0B1F3A] transition-colors animate-fade-up delay-200">
            View All <span>→</span>
          </a>
        </div>

        {/* CSS Grid for Collections */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 animate-fade-up delay-300">
          {collections.map((item, index) => (
            <div key={item.id} className="group cursor-pointer flex flex-col gap-4">
              <div className="w-full aspect-square relative overflow-hidden rounded-t-[50px] rounded-b-xl border border-[#B88932]/20 group-hover:border-[#B88932]/60 transition-colors duration-500">
                <Image
                  src={`https://picsum.photos/seed/collection${item.id}/400/400`}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-[#0B1F3A]/0 group-hover:bg-[#0B1F3A]/20 transition-colors duration-500" />
              </div>
              <div>
                <h3 className="text-sm font-sans tracking-widest text-[#0B1F3A] font-semibold mb-1 group-hover:text-[#B88932] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-sans text-[#10243D] opacity-70">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-10 flex justify-center md:hidden">
           <a href="#" className="flex items-center gap-2 text-xs font-sans tracking-[0.2em] text-[#B88932] uppercase hover:text-[#0B1F3A] transition-colors">
            View All <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
