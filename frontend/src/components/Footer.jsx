import React from "react";
import {
    Twitter,
    Linkedin,
    Instagram,
    Brain,
    Zap,
    Mail
} from "lucide-react";

const Footer = () => {
    // Floating particles animation
    const FloatingParticles = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-10"
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

    // Neural network background
    const NeuralNetwork = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
            <svg className="absolute inset-0 w-full h-full">
                {[...Array(8)].map((_, i) => (
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

    return (
        <footer className="relative bg-gray-900 overflow-hidden">
            <FloatingParticles />
            <NeuralNetwork />
            
            {/* Top border with gradient */}
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
            
            <div className="relative z-10 container mx-auto px-6 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    
                    {/* Brand Section */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative">
                                <Brain className="w-8 h-8 text-cyan-400 animate-pulse" />
                                <div className="absolute inset-0 w-8 h-8 border border-cyan-400/30 rounded-full animate-ping opacity-50"></div>
                            </div>
                            <h2 
                                className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent"
                                style={{ 
                                    fontFamily: "'Orbitron', sans-serif",
                                    textShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
                                }}
                            >
                                Task AI <span className="text-gray-300 font-light">Studio</span>
                            </h2>
                        </div>
                        
                        <p 
                            className="text-gray-400 mb-6 leading-relaxed"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                            An <span className="text-cyan-400 font-semibold">AI friend</span> that keeps your day on track. 
                            Smart reminders, seamless sync, never miss a deadline again.
                        </p>

                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {/* Custom TikTok Icon */}
                            <a
                                href="https://www.tiktok.com/@taskai.studio"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-2 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-cyan-500/50 hover:bg-gray-700/50 transition-all duration-300"
                            >
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.56a8.16 8.16 0 0 0 4.77 1.52V5.71a4.85 4.85 0 0 1-1.04-.98v-.04z" fill="currentColor" />
                                </svg>
                            </a>
                            
                            <a
                                href="https://x.com/taskaistudio"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-2 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-cyan-500/50 hover:bg-gray-700/50 transition-all duration-300"
                            >
                                <Twitter className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                            </a>
                            
                            <a
                                href="https://www.linkedin.com/company/task-ai-studio/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-2 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-cyan-500/50 hover:bg-gray-700/50 transition-all duration-300"
                            >
                                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                            </a>
                            
                            <a
                                href="https://www.instagram.com/taskaistudio/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-2 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-cyan-500/50 hover:bg-gray-700/50 transition-all duration-300"
                            >
                                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 
                            className="text-lg font-semibold mb-6 text-gray-100"
                            style={{ fontFamily: "'Orbitron', sans-serif" }}
                        >
                            Quick Navigation
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: "Features", href: "#features" },
                                { name: "How it Works", href: "#how-it-works" },
                                { name: "Pricing", href: "#pricing" },
                                { name: "Sign In", href: "/login" },
                                { name: "Get Started", href: "/signup" }
                            ].map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="group flex items-center gap-2 text-gray-400 hover:text-cyan-300 transition-all duration-300"
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                    >
                                        <div className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                                            {link.name}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* AI Features */}
                    <div>
                        <h3 
                            className="text-lg font-semibold mb-6 text-gray-100 flex items-center gap-2"
                            style={{ fontFamily: "'Orbitron', sans-serif" }}
                        >
                            <Zap className="w-5 h-5 text-yellow-400" />
                            AI Capabilities
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "Neural Task Prioritization",
                                "WhatsApp Bot Integration", 
                                "Smart Deadline Tracking",
                                "Energy-Aware Scheduling",
                                "Productivity Pattern Learning"
                            ].map((feature, ) => (
                                <li 
                                    key={feature}
                                    className="flex items-center gap-3 text-gray-400"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                >
                                    <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full opacity-60"></div>
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Support */}
                    <div>
                        <h3 
                            className="text-lg font-semibold mb-6 text-gray-100 flex items-center gap-2"
                            style={{ fontFamily: "'Orbitron', sans-serif" }}
                        >
                            <Mail className="w-5 h-5 text-cyan-400" />
                            Connect With Us
                        </h3>
                        <div className="space-y-4">
                            <p 
                                className="text-gray-400 text-sm leading-relaxed"
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                            >
                                Need help? Have questions about AI features?
                            </p>
                            
                            <div className="space-y-2">
                                <a
                                    href="mailto:taskai.studio@gmail.com"
                                    className="group flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                >
                                    <Mail className="w-4 h-4" />
                                    <span className="text-sm group-hover:underline">
                                        taskai.studio@gmail.com
                                    </span>
                                </a>
                                
                                <p 
                                    className="text-gray-500 text-xs"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                >
                                    Or reach out via our WhatsApp bot
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="relative">
                    {/* Gradient divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8"></div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p 
                            className="text-gray-500 text-sm"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                            © {new Date().getFullYear()} Task AI Studio. All rights reserved.
                        </p>
                        
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                Powered by AI
                            </span>
                            <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Montserrat:wght@300;400;500;600;700&display=swap');
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
        </footer>
    );
};

export default Footer;