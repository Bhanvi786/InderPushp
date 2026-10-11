"use client";
import React from "react";
import Image from "next/image";

interface MosaicGalleryProps {
  images: string[];
}

const MosaicTile = ({ 
  src, 
  alt, 
  left, 
  top, 
  width, 
  height, 
  rounded = "", 
  zIndex = 10,
  className = "",
  borderClass = "border-[2.5px] border-gold",
  maskBackground = false,
  objectPosition = "center"
}: { 
  src: string, 
  alt: string, 
  left: number, 
  top: number, 
  width: number, 
  height: number, 
  rounded?: string,
  zIndex?: number,
  className?: string,
  borderClass?: string,
  maskBackground?: boolean,
  objectPosition?: string
}) => (
  <div 
    className={`absolute @container p-[6px] ${className}`}
    style={{ 
      left: `${left}%`, 
      top: `${top}%`, 
      width: `${width}%`, 
      height: `${height}%`,
      zIndex 
    }}
  >
    <div className={`w-full h-full relative overflow-hidden group shadow-sm bg-ivory ${borderClass} ${rounded} ${maskBackground ? 'shadow-[0_0_0_12px_var(--ivory)]' : ''}`}>
      <Image 
        src={src} 
        alt={alt} 
        fill 
        style={{ objectPosition }}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-colors duration-500 pointer-events-none" />
    </div>
  </div>
);

export default function MosaicGallery({ images }: MosaicGalleryProps) {
  // 13 images required for the precise layout
  const getImgSrc = (index: number) => images[index] || `https://picsum.photos/seed/inder${index}/800/1000`;

  return (
    <div className="w-full h-full relative flex justify-center md:justify-start">
      
      {/* ========================================== */}
      {/* RESPONSIVE LAYOUT (Scales proportionally) */}
      {/* ========================================== */}
      <div className="w-full max-w-[500px] md:max-w-none md:w-auto md:h-full max-h-[800px] aspect-[9/10] mx-auto md:mx-0 md:ml-4 lg:ml-8 xl:ml-12 relative mt-0">
        
        {/* 1. Left Arch (Red Leaves) - Elongated to 75% to go behind Tile 2 */}
        <MosaicTile src={getImgSrc(0)} alt="Left Arch" left={5} top={5} width={25} height={75} rounded="rounded-tl-[100cqi]" zIndex={10} />

        {/* 2. Left Blue Curve - Sits on top of Tile 1 */}
        <MosaicTile src={getImgSrc(1)} alt="Left Blue Curve" left={5} top={60} width={25} height={20} rounded="rounded-tl-[100cqi]" zIndex={20} maskBackground />

        {/* 3. Bottom Left Beige */}
        <MosaicTile src={getImgSrc(2)} alt="Bottom Left" left={5} top={80} width={25} height={20} zIndex={20} />

        {/* 4. Small Top Red */}
        <MosaicTile src={getImgSrc(3)} alt="Small Top Red" left={30} top={0} width={10} height={10} zIndex={30} />

        {/* 5. Top Left Filler (Behind Lotus) */}
        <MosaicTile src={getImgSrc(4)} alt="Top Left Filler" left={30} top={10} width={20} height={20} zIndex={5} />

        {/* 6. Top Beige Leaves (Behind Lotus) */}
        <MosaicTile src={getImgSrc(5)} alt="Top Beige Leaves" left={40} top={0} width={30} height={30} zIndex={5} />

        {/* 7. Center Lotus (Main) - Elongated to 90% to go behind Tile 8 & 9 */}
        <MosaicTile src={getImgSrc(6)} alt="Center Lotus" left={30} top={10} width={40} height={90} rounded="rounded-t-[50cqi]" zIndex={10} maskBackground />

        {/* 8. Bottom Middle Brown Vertical - Sits on top of Tile 7 */}
        <MosaicTile src={getImgSrc(7)} alt="Bottom Middle Brown" left={30} top={80} width={10} height={20} zIndex={20} maskBackground />

        {/* 9. Bottom Middle Green Curve - Sits on top of Tile 7 */}
        <MosaicTile src={getImgSrc(8)} alt="Bottom Middle Green" left={40} top={80} width={30} height={20} rounded="rounded-tl-[100cqi]" zIndex={20} maskBackground />

        {/* 10. Top Right Flower - Elongated to 50% to go behind Tile 11 */}
        <MosaicTile src={getImgSrc(9)} alt="Top Right Flower" left={70} top={0} width={25} height={50} zIndex={10} objectPosition="center top" />

        {/* 11. Right Small Gold Curve - Sits on top of Tile 10 */}
        <MosaicTile src={getImgSrc(10)} alt="Right Small Gold" left={70} top={35} width={25} height={15} rounded="rounded-tl-[100cqi]" zIndex={20} maskBackground />

        {/* 12. Right Peacock - Elongated to 50% to go behind Tile 13 */}
        <MosaicTile src={getImgSrc(11)} alt="Right Peacock" left={70} top={50} width={25} height={50} zIndex={10} />

        {/* 13. Bottom Right Green Leaves - Sits on top of Tile 12 */}
        <MosaicTile src={getImgSrc(12)} alt="Bottom Right Green" left={70} top={80} width={25} height={20} rounded="rounded-tl-[100cqi]" zIndex={20} maskBackground />

      </div>
    </div>
  );
}
