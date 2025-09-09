import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Anchor, Waves, Ship, Compass, Users, BarChart3, FileText, Settings, Navigation, Star, Zap, Sparkles, ArrowRight, Play, CheckCircle, Award, Clock, Globe, MapPin, Phone, Mail, ExternalLink, Menu, X, ChevronDown, TrendingUp, Target, Layers, Database, ShieldCheck, Activity, Zap as Lightning, MessageCircle, Send } from 'lucide-react';
import navalHeroBg from '@/assets/naval-hero-bg.jpg';
import slide1 from '@/assets/slide1.jpg';
import slide2 from '@/assets/slide2.jpg';
import slide3 from '@/assets/slide3.jpg';
import about1 from '@/assets/about1.jpg';
import image1 from '@/assets/image1.jpg';
import image4 from '@/assets/image4.jpg';
import image3 from '@/assets/image3.jpg';
import navalhero from '@/assets/naval-hero.jpg'

const Landing = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Auto-rotate slides
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const slides = [
    {
      title: "REVOLUTIONARY NAVAL MANAGEMENT",
      description: "Transform your naval operations with our cutting-edge hull maintenance platform. Streamline processes, enhance efficiency, and ensure mission readiness with intelligent data-driven solutions.",
      image: navalhero
    },
    {
      title: "ADVANCED ANALYTICS & INSIGHTS",
      description: "Leverage powerful analytics to make informed decisions. Our comprehensive reporting system provides real-time insights into vessel performance, maintenance schedules, and operational efficiency.",
      image: image1
    },
    {
      title: "SEAMLESS INTEGRATION & COLLABORATION",
      description: "Connect all stakeholders across the naval ecosystem. From ship crews to command centers, our unified platform ensures seamless communication and coordinated operations.",
      image: image3
    }
  ];

  // Typewriter effect
  useEffect(() => {
    const fullText = slides[currentSlide].title;
    let currentIndex = 0;
    setIsTyping(true);
    setTypewriterText('');

    // Add a small delay before starting the typewriter effect
    const startDelay = setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setTypewriterText(fullText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typeInterval);
        }
      }, 80); // Slightly faster typing speed

      return () => clearInterval(typeInterval);
    }, 300); // 300ms delay before starting

    return () => {
      clearTimeout(startDelay);
    };
  }, [currentSlide]);

  const services = [
    { 
      title: "Cognitive Hull Intelligence", 
      icon: <Ship className="w-8 h-8" />,
      description: "Next-generation neural networks that continuously monitor hull integrity, predicting structural changes and maintenance needs with unprecedented accuracy.",
      color: "from-violet-500 to-purple-500"
    },
    { 
      title: "Quantum Defect Detection", 
      icon: <Target className="w-8 h-8" />,
      description: "Revolutionary quantum-enhanced imaging systems that detect microscopic defects and structural anomalies invisible to conventional inspection methods.",
      color: "from-cyan-500 to-blue-500"
    },
    { 
      title: "Autonomous Performance Optimization", 
      icon: <BarChart3 className="w-8 h-8" />,
      description: "Self-learning algorithms that continuously optimize vessel performance, fuel efficiency, and operational parameters through real-time data analysis.",
      color: "from-rose-500 to-pink-500"
    },
    { 
      title: "Fleet Neural Network", 
      icon: <Navigation className="w-8 h-8" />,
      description: "Distributed intelligence system that connects all vessels in a cognitive network, enabling collective learning and coordinated autonomous operations.",
      color: "from-emerald-500 to-teal-500"
    },
    { 
      title: "Quantum Security Protocols", 
      icon: <ShieldCheck className="w-8 h-8" />,
      description: "Advanced cryptographic systems using quantum-resistant algorithms to protect sensitive naval data and communications from emerging threats.",
      color: "from-amber-500 to-orange-500"
    },
    { 
      title: "Predictive Intelligence Engine", 
      icon: <Activity className="w-8 h-8" />,
      description: "Advanced cognitive computing platform that processes vast data streams to predict operational outcomes and recommend optimal strategies.",
      color: "from-indigo-500 to-violet-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Beautiful Modern Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-blue-100' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                  scrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  MARITIME INTELLIGENCE
                </h1>
                <p className={`text-sm transition-colors duration-300 ${
                  scrolled ? 'text-gray-600' : 'text-blue-100'
                }`}>
                  Next-Gen Naval Solutions
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a 
                href="#home" 
                className={`font-medium transition-all duration-300 hover:scale-105 ${
                  scrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Overview
              </a>
              <a 
                href="#about" 
                className={`font-medium transition-all duration-300 hover:scale-105 ${
                  scrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Technology
              </a>
              <a 
                href="#services" 
                className={`font-medium transition-all duration-300 hover:scale-105 ${
                  scrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Solutions
              </a>
              <a 
                href="#contact" 
                className={`font-medium transition-all duration-300 hover:scale-105 ${
                  scrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Connect
              </a>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
            <Button 
              onClick={handleLoginClick}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
                  scrolled
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                    : 'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-blue-600'
                }`}
              >
                <Shield className="w-4 h-4 mr-2" />
              Login
            </Button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg transition-colors duration-300 hover:bg-white/10"
              >
                {isMenuOpen ? (
                  <X className={`w-6 h-6 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
                ) : (
                  <Menu className={`w-6 h-6 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 py-4 border-t border-white/20 bg-white/95 backdrop-blur-md rounded-xl shadow-lg">
              <nav className="flex flex-col space-y-4">
                <a 
                  href="#home" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Overview
                </a>
                <a 
                  href="#about" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Technology
                </a>
                <a 
                  href="#services" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Solutions
                </a>
                <a 
                  href="#contact" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connect
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Beautiful Hero Carousel */}
      <section id="home" className="relative h-screen overflow-hidden">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
            </div>
          </div>
        ))}
        
        {/* Hero Content */}
        <div className="relative z-20 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-6xl mx-auto px-6">
            {/* Animated Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8 animate-bounce">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold">Naval Excellence Platform</span>
            </div>

            {/* Main Title with Typewriter Effect and Catchy Font */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent animate-fade-in naval-title typewriter-text">
                {typewriterText}
                {isTyping && (
                  <span className="typewriter-cursor text-cyan-300 ml-1 font-bold">|</span>
                )}
              </span>
            </h1>
            
            {/* Subtitle with Typewriter Effect */}
            {/* <p className="text-xl md:text-2xl lg:text-3xl mb-12 leading-relaxed max-w-4xl mx-auto text-blue-100 font-light">
              {slides[currentSlide].description}
            </p> */}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Button 
                    onClick={handleLoginClick}
                className="group bg-red-500/50  text-white px-10 py-5 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border border-white/20"
              >
                <Shield className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                Access Platform
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
              
        
                </div>

            {/* Stats Row */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">1000+</div>
                <div className="text-blue-200 text-lg">Active Missions</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">Real-time</div>
                <div className="text-blue-200 text-lg">Intelligence</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">AI-Powered</div>
                <div className="text-blue-200 text-lg">Analytics</div>
              </div>
            </div> */}
          </div>
        </div>
        
        {/* Enhanced Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white shadow-lg scale-125' 
                  : 'bg-white/50 hover:bg-white/75 hover:scale-110'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 z-20 animate-bounce">
          <div className="flex flex-col items-center space-y-2 text-white/70">
            <span className="text-sm font-medium">Scroll Down</span>
            <ChevronDown className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Beautiful Features Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-200/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Lightning className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                CORE CAPABILITIES
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the power of intelligent maritime systems that transform complex naval operations into streamlined, data-driven processes with unprecedented precision and reliability.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Database className="w-12 h-12 text-emerald-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                  Smart Data Processing
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Advanced machine learning algorithms process vast amounts of maritime data in real-time, delivering instant insights and predictive analytics that drive intelligent decision-making.
                </p>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-emerald-200 transition-colors duration-500"></div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-purple-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Layers className="w-12 h-12 text-violet-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-violet-600 transition-colors duration-300">
                  Intelligent Automation
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Self-optimizing systems that automatically adapt to changing conditions, execute complex operational sequences, and maintain peak performance with minimal human oversight.
                </p>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-violet-200 transition-colors duration-500"></div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-pink-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <TrendingUp className="w-12 h-12 text-rose-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-rose-600 transition-colors duration-300">
                  Predictive Analytics
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Advanced forecasting models that anticipate maintenance needs, operational challenges, and performance trends, enabling proactive decision-making and strategic planning.
                </p>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-rose-200 transition-colors duration-500"></div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Transform Your Operations?
              </h3>
              <p className="text-gray-600 mb-6">
                Join the next generation of maritime professionals who leverage cutting-edge technology for superior operational excellence.
              </p>
              <Button 
                onClick={handleLoginClick}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Shield className="w-5 h-5 mr-2" />
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Beautiful About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-cyan-200/20 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Section - Beautiful Visual Design */}
            <div className="relative">
              {/* Main Image Container with Elegant Border */}
              <div className="relative group">
                {/* Decorative Border with Gradient */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="absolute -inset-2 bg-black-40 rounded-xl opacity-40 group-hover:opacity-50 transition-opacity duration-500"></div>
                
                {/* Main Image */}
                  <div className="rounded-lg overflow-hidden group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <img 
                      src={about1} 
                      alt="Naval Excellence" 
                      className="w-full h-full object-cover"
                    />
                  </div>              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">500+</p>
                      <p className="text-xs text-gray-600">Vessels</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">24/7</p>
                      <p className="text-xs text-gray-600">Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Beautiful Text Content */}
            <div className="space-y-8">
              {/* Header with Icon */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  MARITIME INNOVATION
                </h2>
              </div>

              {/* Content with Beautiful Typography */}
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our platform represents a <span className="font-semibold text-cyan-600">revolutionary approach to maritime intelligence</span>, leveraging cutting-edge artificial intelligence, quantum computing principles, and advanced neural networks to create the most sophisticated naval management ecosystem ever conceived.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  Through our <span className="font-semibold text-blue-600">integrated intelligence framework</span>, we seamlessly connect disparate data streams, enabling real-time cognitive processing, autonomous decision-making, and predictive optimization that fundamentally transforms how modern naval forces operate, maintain, and evolve their maritime capabilities.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg">
                  <CheckCircle className="w-5 h-5 text-cyan-500" />
                  <span className="text-gray-700 font-medium">Quantum-Enhanced Processing</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg">
                  <CheckCircle className="w-5 h-5 text-cyan-500" />
                  <span className="text-gray-700 font-medium">Autonomous Decision Systems</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg">
                  <CheckCircle className="w-5 h-5 text-cyan-500" />
                  <span className="text-gray-700 font-medium">Cognitive Intelligence</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg">
                  <CheckCircle className="w-5 h-5 text-cyan-500" />
                  <span className="text-gray-700 font-medium">Adaptive Learning Networks</span>
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <span>Explore Technology</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button variant="outline" className="border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-300">
                  <Play className="w-5 h-5 mr-2" />
                  View Innovation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beautiful Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-indigo-200/20 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                ADVANCED SOLUTIONS
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Revolutionary maritime technologies that redefine naval operations through cognitive computing, autonomous systems, and next-generation integration across all maritime platforms.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20"
              >
                {/* Decorative Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 rounded-3xl group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Icon Container */}
                <div className="relative z-10 text-center mb-6">
                  <div className={`w-24 h-24 bg-gradient-to-br ${service.color} rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    <div className="text-white group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                  </div>
                  
                  {/* Floating Decorative Element */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                    {service.description}
                  </p>
                  
                  {/* Action Button */}
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-2xl transition-all duration-300 group-hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-500"></div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Embrace the Future?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Experience how our revolutionary maritime intelligence solutions can transform your naval operations and unlock unprecedented capabilities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleLoginClick}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Access Solutions
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-violet-600 text-violet-600 hover:bg-violet-600 hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Explore Innovation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beautiful Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-200/30 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                CONNECT WITH US
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join forces with our elite team of maritime innovation specialists for advanced technical support, strategic implementation guidance, and to discover how our cutting-edge solutions can revolutionize your naval capabilities.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Simple Creative Design */}
            <div className="space-y-12">
              {/* Main CTA Card */}
              <div className="relative group">
                {/* Multiple Glow Layers */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                
                <div className="relative bg-white rounded-3xl p-12 text-center overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 left-0 w-full h-full opacity-5">
                    <div className="absolute top-4 left-4 w-8 h-8 border-2 border-blue-600 rounded-full"></div>
                    <div className="absolute top-8 right-8 w-6 h-6 border-2 border-indigo-600 rounded-full"></div>
                    <div className="absolute bottom-8 left-8 w-4 h-4 border-2 border-cyan-600 rounded-full"></div>
                    <div className="absolute bottom-4 right-4 w-10 h-10 border-2 border-blue-600 rounded-full"></div>
                  </div>
                  
                  {/* Animated Icon */}
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 relative">
                      <Send className="w-10 h-10 text-white group-hover:rotate-12 transition-transform duration-300" />
                      {/* Pulsing Ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-20"></div>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    Ready to Connect?
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                    Let's build the future of maritime intelligence together.
                  </p>
                  
                  {/* Creative Button Container */}
                  <div className="relative">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        onClick={handleLoginClick}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden group/btn"
                      >
                        <span className="relative z-10">Get Started</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden group/btn2"
                      >
                        <span className="relative z-10">Learn More</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 translate-x-[-100%] group-hover/btn2:translate-x-[100%] transition-transform duration-700"></div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Creative Contact Methods */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="text-center group cursor-pointer relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-200 rounded-3xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Phone className="w-10 h-10 text-blue-600 group-hover:text-white transition-all duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 rounded-3xl border-2 border-blue-300 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition-colors duration-300">Call</h4>
                  <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">PAX: 6063, 6099</p>
                </div>

                <div className="text-center group cursor-pointer relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-3xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
                    <Mail className="w-10 h-10 text-indigo-600 group-hover:text-white transition-all duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 rounded-3xl border-2 border-indigo-300 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-indigo-600 transition-colors duration-300">Email</h4>
                  <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">innovation@maritimeintel.navy</p>
                </div>

                <div className="text-center group cursor-pointer relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 to-cyan-200 rounded-3xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-20 h-20 bg-cyan-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gradient-to-br group-hover:from-cyan-600 group-hover:to-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <MessageCircle className="w-10 h-10 text-cyan-600 group-hover:text-white transition-all duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 rounded-3xl border-2 border-cyan-300 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-cyan-600 transition-colors duration-300">Chat</h4>
                  <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Live Support</p>
                </div>
              </div>

              {/* Creative Floating Elements */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 rounded-full blur-xl animate-pulse"></div>
                </div>
                <div className="relative text-center">
                  <div className="inline-flex items-center space-x-2 text-gray-500 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <span>Always innovating</span>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                    <span>Always evolving</span>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beautiful Footer */}
      <footer className="bg-gradient-to-r from-gray-50 via-blue-50 to-indigo-50 text-gray-900 py-16 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500"></div>
          <div className="absolute top-10 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-indigo-200/30 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Compass className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">MARITIME INTELLIGENCE</h3>
                  <p className="text-blue-600">Next-Gen Naval Solutions</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 max-w-md">
                The evolution of maritime operations begins now. Our platform represents the zenith of naval technology, integrating quantum computing, cognitive intelligence, and autonomous systems to create the most sophisticated maritime management ecosystem ever conceived.
              </p>
              <div className="flex space-x-4">
                <Button 
                  onClick={handleLoginClick}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Compass className="w-4 h-4 mr-2" />
                  Access Platform
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Play className="w-4 h-4 mr-2" />
                  View Innovation
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-blue-600">Navigation</h4>
              <ul className="space-y-3">
                <li><a href="#home" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Overview</a></li>
                <li><a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Technology</a></li>
                <li><a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Solutions</a></li>
                <li><a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Connect</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-blue-600">Innovation Hub</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600 text-sm">New Delhi, India</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600 text-sm">PAX: 6063, 6099</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-600 text-sm">innovation@maritimeintel.navy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-600 text-sm">
                <span>© 2025 Maritime Intelligence Platform. All rights reserved.</span>
              </div>
              <div className="flex items-center space-x-6 text-gray-600 text-sm">
                <span>Last Updated: 06/09/2025</span>
                <span>•</span>
                <span>Visitors: 71,298</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;