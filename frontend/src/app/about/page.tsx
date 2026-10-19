"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { aboutSettingsApi, AboutSettingsData } from "@/lib/api";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export default function AboutPage() {
  const [settings, setSettings] = useState<AboutSettingsData>({
    videoUrl: "/artist.MP4",
    posterUrl: "/artist.png",
    heading: "A Glimpse Into My Creative World",
    subheading: "",
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await aboutSettingsApi.get();
        if (data) {
          setSettings({
            videoUrl: data.videoUrl || "/artist.MP4",
            posterUrl: data.posterUrl || "/artist.png",
            heading: data.heading || "A Glimpse Into My Creative World",
            subheading: data.subheading || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch about settings:", err);
      }
    }
    loadSettings();
  }, []);

  const isYouTube = (url: string) => {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1]?.split("?")[0];
        return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
      }
      if (url.includes("watch?v=")) {
        const id = url.split("watch?v=")[1]?.split("&")[0];
        return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const toggleDirectPlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <main className="w-full min-h-screen bg-[#FAF7F0] flex flex-col text-[#263248]">
      {/* Navigation */}
      <Header />

      {/* Slim Navy Title Banner: Exactly 100–115px height below navbar offset */}
      <section className="w-full bg-[#263248] pt-[60px] md:pt-[64px] text-[#FAF7F0] flex flex-col items-center justify-center">
        <div className="w-full max-w-xl mx-auto h-[105px] md:h-[110px] py-[10px] px-4 flex flex-col items-center justify-center text-center gap-[3.5px]">
          <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#D8C594] font-medium leading-none block">
            THE HEART BEHIND THE ART
          </span>
          <h1 className="text-[24px] font-serif font-normal text-[#FAF7F0] tracking-tight leading-tight m-0">
            The Story Behind Inderpushp
          </h1>
          <p className="text-[13px] font-serif italic text-[#D8C594] font-light leading-none m-0">
            A name. A legacy. And a love for creating.
          </p>
        </div>
      </section>

      {/* 3. Combined Brand Story & Artist Introduction (Starts ~45-55px below title banner) */}
      <section className="pt-11 md:pt-[50px] pb-12 sm:pb-16 px-6 sm:px-10 max-w-[1100px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 lg:gap-14 items-center">
          
          {/* Left: Beautiful existing photograph of meaningful mosaic artwork (~380-420px max width) */}
          <div className="md:col-span-5 flex justify-center">
            <div className="w-full max-w-[380px] sm:max-w-[400px]">
              <div className="relative aspect-4/5 rounded-xl overflow-hidden shadow-lg border border-[#B79A5A]/30 bg-white">
                <Image
                  src="/artist.png"
                  alt="Geetu Jaidka - Founder & Artist at Inderpushp"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right: Compact heading and essential story in natural paragraphs */}
          <div className="md:col-span-7 space-y-6">
            {/* The Story Behind Inderpushp */}
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-medium text-[#263248] mb-3">
                The Story Behind Inderpushp
              </h2>
              <div className="space-y-3 text-sm sm:text-base font-sans text-[#263248]/85 leading-relaxed font-light">
                <p>
                  People often say, &lsquo;Naam mein kya rakha hai?&rsquo; — what&rsquo;s in a name?
                </p>
                <p>
                  For me, a name can hold a whole story.
                </p>
                <p>
                  Inderpushp brings together the names of my parents, Inderpal and Pushpa. What began as a daughter&rsquo;s way of carrying her parents&rsquo; names forward became a name that carries my roots, my values and a little piece of my heart.
                </p>
                <p>
                  Today, it lives on as Inderpushp House of Art — my creative space and my way of bringing art into the lives of others.
                </p>
              </div>
            </div>

            {/* Meet Geetu Jaidka */}
            <div className="pt-5 border-t border-[#B79A5A]/20">
              <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#263248] mb-3">
                Meet Geetu Jaidka
              </h3>
              <div className="space-y-3 text-sm sm:text-base font-sans text-[#263248]/85 leading-relaxed font-light">
                <p>
                  I&rsquo;m a dentist by profession and an artist by passion. Creativity has always been part of my life, from painting walls and transforming furniture to discovering the beauty of mosaic art.
                </p>
                <p>
                  I fell in love with the process of bringing tiny pieces together to create something entirely new. What started as a passion slowly grew into Inderpushp House of Art.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Compact Artist Introduction Video Feature directly below */}
      <section className="py-8 sm:py-10 md:py-12 px-5 sm:px-8 bg-white/50 border-y border-[#B79A5A]/20">
        <div className="max-w-[1100px] mx-auto w-full text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-medium text-[#263248] mb-4">
            A Glimpse Into My Creative World
          </h2>

          <div className="relative mx-auto w-full max-w-[440px] aspect-3/4 rounded-2xl overflow-hidden shadow-lg border border-[#B79A5A]/30 bg-[#1b2332] group">
            {settings.videoUrl ? (
              isYouTube(settings.videoUrl) ? (
                <iframe
                  src={getYouTubeEmbedUrl(settings.videoUrl)}
                  title="Geetu Jaidka - Inderpushp House of Art"
                  className="w-full h-full border-0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={settings.videoUrl}
                    poster={settings.posterUrl || "/artist.png"}
                    className="w-full h-full object-contain"
                    playsInline
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  />
                  <div
                    onClick={toggleDirectPlay}
                    className={`absolute inset-0 bg-[#263248]/30 transition-opacity flex items-center justify-center cursor-pointer ${
                      isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
                    }`}
                  >
                    <div className="w-13 h-13 rounded-full bg-[#B79A5A] text-white flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105">
                      {isPlaying ? (
                        <Pause size={18} fill="white" />
                      ) : (
                        <Play size={18} fill="white" className="translate-x-0.5" />
                      )}
                    </div>
                  </div>
                  {isPlaying && (
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2 z-20">
                      <button
                        onClick={toggleMute}
                        aria-label="Toggle Audio"
                        className="p-1.5 rounded-full bg-[#263248]/80 text-[#FAF7F0] border border-[#B79A5A]/30 hover:bg-[#B79A5A] transition-colors"
                      >
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>
                    </div>
                  )}
                </div>
              )
            ) : (
              /* Graceful coming soon placeholder */
              <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
                <Image
                  src={settings.posterUrl || "/6.png"}
                  alt="Studio Film Thumbnail"
                  fill
                  className="object-cover object-center filter blur-xs brightness-75"
                />
                <div className="absolute inset-0 bg-[#263248]/60" />
                <div className="relative z-10 flex flex-col items-center px-4 text-center max-w-xs">
                  <div className="w-11 h-11 rounded-full bg-[#FAF7F0]/15 border border-[#B79A5A] flex items-center justify-center text-[#D8C594] mb-2 shadow-sm">
                    <Play size={16} className="translate-x-0.5 text-[#D8C594]" />
                  </div>
                  <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#D8C594] font-medium mb-0.5">
                    Studio Film
                  </span>
                  <p className="text-[11px] font-sans text-[#FAF7F0]/80">
                    Video coming soon
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Short Brand Philosophy & Closing Line */}
      <section className="py-9 sm:py-11 md:py-12 px-5 sm:px-8 max-w-[700px] mx-auto w-full text-center space-y-3.5">
        <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-medium text-[#263248]">
          Art Made to Belong
        </h2>

        <div className="space-y-2.5 text-xs sm:text-sm font-sans text-[#263248]/85 leading-relaxed font-light">
          <p>
            To me, art is more than something to look at. It becomes part of a home, a memory, a story.
          </p>
          <p>
            From statement mosaic artworks to smaller decorative pieces and personalised commissions, every creation is made with the hope that it finds the right person and the right place.
          </p>
        </div>

        <div className="pt-2">
          <p className="text-sm sm:text-base font-serif italic text-[#B79A5A] font-light">
            Handmade art. Personal stories. Pieces made to belong.
          </p>
        </div>
      </section>

      {/* Reusable Footer */}
      <Footer />
    </main>
  );
}
