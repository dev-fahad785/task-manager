import React, { useState,useRef } from "react";
import { Link } from "react-router-dom";

import Footer from "../components/Footer";
import Analytics from "../components/Analytics";
import Navbar from "./Home/Navbar";
import Hero from "./Home/Hero";
// import { Feather } from 'lucide-
import Feature from "./Home/Feature";
import Pricing from "./Home/Pricing";
import HowItWorks from "./Home/HowItWorks";
import Testimonials from "./Home/Testimonials";
const Home = () => {
  // States for controlling animations

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  // Floating particles animation
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
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
      className="absolute pointer-events-none transition-all duration-500 ease-out"
      style={{
        left: `${50 + mousePosition.x * 50}%`,
        top: `${50 + mousePosition.y * 50}%`,
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(6, 182, 212, 0.05) 40%, transparent 70%)`,
        width: "600px",
        height: "600px",
        borderRadius: "50%",
      }}
    />
  );

  return (
    <div ref={heroRef}>
      <FloatingParticles />
      <NeuralNetwork />
      <CursorIllumination />
      <Navbar />
      <Hero />
      <Analytics />
      <Feature />
      <Testimonials />
      <Pricing />
      <HowItWorks />
      
      <Footer />
      
    </div>
  );
};

export default Home;
