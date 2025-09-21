"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { FaWhatsapp, FaFacebook, FaVolumeMute, FaVolumeUp, FaPause, FaPlay } from "react-icons/fa";

export default function Home() {
  const videos = ["/v1.mp4", "/v2.mp4", "/v3.mp4"];
  const comprobantes = ["/comprobante1.png", "/comprobante2.png", "/comprobante3.png", "/comprobante4.png"];

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [mutedStates, setMutedStates] = useState<boolean[]>(Array(videos.length).fill(true));
  const [playingStates, setPlayingStates] = useState<boolean[]>(Array(videos.length).fill(false));

  // Intentamos iniciar reproducción (autoplay) en todos los videos (si el navegador lo permite)
  useEffect(() => {
    const newPlaying = [...playingStates];
    videoRefs.current.forEach((v, idx) => {
      if (v) {
        v.muted = true; // aseguramos que inicie silenciado
        const p = v.play();
        if (p && typeof p.then === "function") {
          p
            .then(() => {
              newPlaying[idx] = !v.paused;
              setPlayingStates([...newPlaying]);
            })
            .catch(() => {
              // autoplay bloqueado, dejamos como pausado
              newPlaying[idx] = v.paused ? false : true;
              setPlayingStates([...newPlaying]);
            });
        } else {
          newPlaying[idx] = !v.paused;
          setPlayingStates([...newPlaying]);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMute = (index: number) => {
    const v = videoRefs.current[index];
    if (!v) return;
    v.muted = !v.muted;
    setMutedStates((prev) => {
      const copy = [...prev];
      copy[index] = v.muted;
      return copy;
    });
  };

  const togglePlay = (index: number) => {
    const v = videoRefs.current[index];
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {
        /* autoplay prevented or other */ 
      });
    } else {
      v.pause();
    }
    setPlayingStates((prev) => {
      const copy = [...prev];
      copy[index] = !v.paused; // after toggle, reflect actual state (note: sometimes immediate)
      return copy;
    });
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#0f1724] text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#0b1220]/95 backdrop-blur-md border-b border-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="logo" 
                width={40}
                height={40}
                className="rounded-full object-contain" 
              />
              <span className="font-semibold text-lg">DINÁMICAS PITER</span>
            </div>

            <div className="flex items-center gap-3">
              {/* CTA buttons in navbar */}
              <a
                href="https://chat.whatsapp.com/C5pf6FPG4Lk74PObJYQqiR?mode=ems_copy_t"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 px-3 py-1.5 rounded-full text-sm font-medium shadow"
              >
                <FaWhatsapp /> WhatsApp
              </a>
              <a
                href="https://www.facebook.com/share/1CvVQPKKZ6/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 px-3 py-1.5 rounded-full text-sm font-medium shadow"
              >
                <FaFacebook /> Facebook
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">DINÁMICAS PITER</h1>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">Participa fácil y sencillo, gana con nosotros</p>
          
          {/* WhatsApp CTA debajo del título */}
          <div className="mt-6">
            <a
              href="https://chat.whatsapp.com/C5pf6FPG4Lk74PObJYQqiR?mode=ems_copy_t"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 shadow-lg text-lg font-semibold transform hover:scale-105 transition"
            >
              <FaWhatsapp className="text-xl" /> ¡Únete a nuestro WhatsApp!
            </a>
          </div>
        </div>
      </header>

      {/* VIDEOS: grid responsive - videos NO recortados (object-contain) */}
      <section className="w-full pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((src, idx) => (
              <figure
                key={src}
                className="relative bg-black rounded-2xl overflow-hidden shadow-lg flex items-center justify-center"
              >
                {/* Video: width full, height auto, max-height responsive, object-contain */}
                <video
                  ref={(el) => {
                    videoRefs.current[idx] = el;
                  }}
                  src={src}
                  className="w-full h-auto object-contain bg-black"
                  autoPlay
                  loop
                  muted={mutedStates[idx]}
                  playsInline
                />
                {/* Controls overlay */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <button
                    aria-label="play-pause"
                    onClick={() => togglePlay(idx)}
                    className="bg-white/90 text-black px-3 py-1 rounded-lg shadow hover:scale-105 transition"
                  >
                    {playingStates[idx] ? <FaPause /> : <FaPlay />}
                  </button>

                  <button
                    aria-label="mute-toggle"
                    onClick={() => toggleMute(idx)}
                    className="bg-white/90 text-black px-3 py-1 rounded-lg shadow hover:scale-105 transition"
                  >
                    {mutedStates[idx] ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                </div>
              </figure>
            ))}
          </div>
          
          {/* WhatsApp CTA debajo de los videos */}
          <div className="mt-8 text-center">
            <a
              href="https://chat.whatsapp.com/C5pf6FPG4Lk74PObJYQqiR?mode=ems_copy_t"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 shadow-xl text-xl font-bold transform hover:scale-105 transition"
            >
              <FaWhatsapp className="text-2xl" /> ¡Participa Ahora en WhatsApp!
            </a>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-[#0b1220]">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold mb-4">¿Qué hacemos?</h2>
          <p className="text-gray-300">
            Realizamos rifas diarias de forma justa y transparente. Puedes participar fácilmente y tener la oportunidad de ganar premios en efectivo cada día.
          </p>
        </div>
      </section>

      {/* Nuestras dinámicas */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8">Nuestras dinámicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="bg-[#081226] p-6 rounded-xl shadow">
              <h4 className="font-semibold mb-2">01 Rifas diarias</h4>
              <p className="text-gray-300">Participa todos los días con rifas seguras y garantizadas.</p>
            </article>
            <article className="bg-[#081226] p-6 rounded-xl shadow">
              <h4 className="font-semibold mb-2">02 Pagos rápidos</h4>
              <p className="text-gray-300">Entregamos tus premios por Nequi o Daviplata de forma rápida y confiable.</p>
            </article>
            <article className="bg-[#081226] p-6 rounded-xl shadow">
              <h4 className="font-semibold mb-2">03 Transparencia</h4>
              <p className="text-gray-300">Mostramos comprobantes reales de entrega para garantizar confianza.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Comprobantes gallery (images) */}
      <section className="py-12 bg-[#0b1220]">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-6">Comprobantes de Premios</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {comprobantes.map((img, i) => (
              <div key={i} className="bg-black rounded-xl overflow-hidden shadow hover:scale-105 transition transform">
                <Image 
                  src={img} 
                  alt={`comprobante-${i + 1}`} 
                  width={300}
                  height={400}
                  className="w-full h-auto object-contain" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">¡Participa y gana con Dinámicas Piter!</h3>
          <p className="text-gray-300 mb-6">Únete al grupo y mantente pendiente de nuestros sorteos diarios.</p>
          <div className="flex justify-center gap-4">
            <a
              href="https://chat.whatsapp.com/C5pf6FPG4Lk74PObJYQqiR?mode=ems_copy_t"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 shadow-lg"
            >
              <FaWhatsapp /> Unirme al WhatsApp
            </a>
            <a
              href="https://www.facebook.com/share/1CvVQPKKZ6/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-lg"
            >
              <FaFacebook /> Compartir en Facebook
            </a>
          </div>
        </div>
      </section>

      {/* Floating quick buttons (always visible) */}
      <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-3">
        <a
          href="https://wa.me/573112646407"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition"
          title="WhatsApp"
        >
          <FaWhatsapp className="text-white w-6 h-6" />
        </a>

        <a
          href="https://www.facebook.com/share/1CvVQPKKZ6/?mibextid=wwXIfr"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center shadow-lg transform hover:scale-105 transition"
          title="Facebook"
        >
          <FaFacebook className="text-white w-6 h-6" />
        </a>
      </div>

      {/* Footer / Contact */}
      <footer className="mt-auto bg-[#071129] py-8 text-center text-gray-300">
        <div className="max-w-4xl mx-auto px-4">
          <p className="mb-2">📧 <a href="mailto:dinamicaspiter1109@gmail.com" className="underline">dinamicaspiter1109@gmail.com</a> | 📱 <a href="tel:+573112646407" className="underline">311 264 6407</a></p>
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Dinámicas Piter. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
