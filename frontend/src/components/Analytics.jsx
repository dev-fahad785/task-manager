import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, ClipboardList, Divide, TrendingUp, Zap, Target, Brain } from 'lucide-react';

const Analytics = () => {
    const [users, setUsers] = useState(0);
    const [tasks, setTasks] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    // Example growth rates (replace with real values if available)
    const userGrowthRate = 7.4;
    const taskGrowthRate = 11.2;

    useEffect(() => {
        setIsVisible(true);
        
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/getAllUsers`);
                console.log("Fetched users:", res.data);
                setUsers(res.data + 23);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            }
        };

        const fetchTasks = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/task/getTasksCount`);
                setTasks(res.data.tasksCount + 345);
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
            }
        };

        fetchUsers();
        fetchTasks();
    }, []);

    const tasksPerUser = users > 0 ? (tasks / users).toFixed(2) : 0;

    // Floating particles animation
    const FloatingParticles = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
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

    const statsData = [
        {
            title: "Active Users",
            value: users,
            growth: userGrowthRate,
            icon: User,
            color: "from-cyan-500 to-blue-500",
            iconColor: "text-cyan-400",
            description: "Growing community"
        },
        {
            title: "Tasks Managed",
            value: tasks,
            growth: taskGrowthRate,
            icon: ClipboardList,
            color: "from-teal-500 to-green-500",
            iconColor: "text-teal-400",
            description: "Total productivity"
        },
        {
            title: "Avg Tasks/User",
            value: tasksPerUser,
            growth: null,
            icon: Target,
            color: "from-purple-500 to-pink-500",
            iconColor: "text-purple-400",
            description: "Efficiency metric"
        }
    ];

    return (
        <section className="relative bg-gray-900 py-20 overflow-hidden">
            <FloatingParticles />
            
            {/* Neural network background */}
            <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full">
                    {[...Array(10)].map((_, i) => (
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

            <div className="relative z-10 container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Brain className="w-8 h-8 text-cyan-400 animate-pulse" />
                        <h2 
                            className={`text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent transition-all duration-1000 ${
                                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                            style={{ 
                                fontFamily: "'Orbitron', sans-serif",
                                textShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
                            }}
                        >
                            AI-Powered Results
                        </h2>
                    </div>
                    <p 
                        className={`text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 ${
                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                        style={{ 
                            transitionDelay: "200ms",
                            fontFamily: "'Montserrat', sans-serif"
                        }}
                    >
                        From smarter workflows to sharper focus — the numbers reflect our users' success in the{" "}
                        <span className="text-cyan-400 font-semibold">AI-driven productivity era</span>.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {statsData.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div
                                key={stat.title}
                                className={`relative group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 transition-all duration-700 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 hover:border-cyan-500/50 ${
                                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                                }`}
                                style={{ transitionDelay: `${400 + index * 150}ms` }}
                            >
                                {/* Gradient background overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                                
                                {/* Tech corner elements */}
                                <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
                                <div className="absolute bottom-2 left-2 w-1 h-1 bg-teal-400 rounded-full animate-ping opacity-40"></div>

                                <div className="relative z-10">
                                    {/* Icon and Title */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 
                                                className="text-gray-400 text-sm font-medium mb-1"
                                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                            >
                                                {stat.title}
                                            </h3>
                                            <p 
                                                className="text-gray-500 text-xs"
                                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                            >
                                                {stat.description}
                                            </p>
                                        </div>
                                        <IconComponent className={`w-10 h-10 ${stat.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                                    </div>

                                    {/* Value */}
                                    <div className="mb-4">
                                        <p 
                                            className="text-4xl md:text-5xl font-bold text-gray-100 group-hover:text-white transition-colors duration-300"
                                            style={{ fontFamily: "'Orbitron', sans-serif" }}
                                        >
                                            {typeof stat.value === 'number' && stat.value > 1000 
                                                ? `${(stat.value / 1000).toFixed(1)}K` 
                                                : stat.value
                                            }
                                        </p>
                                    </div>

                                    {/* Growth indicator */}
                                    {stat.growth && (
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-green-400" />
                                            <span className="text-green-400 text-sm font-medium">
                                                +{stat.growth}% this month
                                            </span>
                                        </div>
                                    )}

                                    {/* Neural network pattern overlay */}
                                    <div className="absolute -inset-2 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                                        <svg className="w-full h-full">
                                            <path
                                                d="M10,10 Q50,5 90,10 T170,10"
                                                stroke="currentColor"
                                                strokeWidth="1"
                                                fill="none"
                                                className="text-cyan-400 animate-pulse"
                                            />
                                            <circle cx="10" cy="10" r="2" fill="currentColor" className="text-cyan-400" />
                                            <circle cx="90" cy="10" r="2" fill="currentColor" className="text-teal-400" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA Section */}
                <div 
                    className={`text-center mt-16 transition-all duration-1000 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: "1000ms" }}
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-full">
                        <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                        <span className="text-gray-300 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            Join the AI productivity revolution
                        </span>
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
        </section>
    );
};

export default Analytics;