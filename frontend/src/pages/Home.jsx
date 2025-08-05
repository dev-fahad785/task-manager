// import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Footer from '../components/Footer';
import Analytics from '../components/Analytics';
import Navbar from './Home/Navbar';
import Hero from './Home/Hero';
// import { Feather } from 'lucide-
import Feature from './Home/Feature';
const Home = () => {
  // States for controlling animations


  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Navigation */}

    <Navbar/>

    <Hero/>
      <Analytics />

    <Feature />









      <Footer />
    </div>
  );
}

export default Home;