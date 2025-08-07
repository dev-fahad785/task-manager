import React, { useState, useRef, useEffect } from "react";
import Footer from "../components/Footer";
import Analytics from "../components/Analytics";
import Navbar from "./Home/Navbar";
import Hero from "./Home/Hero";
import Feature from "./Home/Feature";
import Pricing from "./Home/Pricing";
import HowItWorks from "./Home/HowItWorks";
import Testimonials from "./Home/Testimonials";

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Floating particles animation
  const FloatingParticles = () => (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );

  // Neural network background lines
  const NeuralNetwork = () => (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-10">
      <svg className="absolute inset-0 w-full h-full">
        {[...Array(15)].map((_, i) => (
          <line
            key={i}
            x1={`${Math.random() * 100}%`}
            y1={`${Math.random() * 100}%`}
            x2={`${Math.random() * 100}%`}
            y2={`${Math.random() * 100}%`}
            stroke="url(#gradient)"
            strokeWidth="1"
            className="animate-pulse"
          />
        ))}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0" />
            <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  // Cursor illumination effect
  const CursorIllumination = () => (
    <div
      className="fixed pointer-events-none z-0 transition-all duration-500 ease-out"
      style={{
        left: `${50 + mousePosition.x * 100}%`,
        top: `${50 + mousePosition.y * 100}%`,
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(6, 182, 212, 0.05) 40%, transparent 70%)`,
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        position: "fixed",
      }}
    />
  );

  return (
    <div className="relative min-h-screen w-full">
      <FloatingParticles />
      <NeuralNetwork />
      <CursorIllumination />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Analytics />
        <Feature />
        <Testimonials />
        <Pricing />
        <HowItWorks />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
