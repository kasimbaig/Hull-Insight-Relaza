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
      title: "WELCOME TO HULL INSIGHT",
      description: "FASTER RENDERING OF RETURNS/ REPORTS AND DEFECTS BY SHIPS AND REFITTING AGENCIES. FACILITATE STATISTICAL ANALYSIS HITUS, COMMANDS AND NHQ.",
      image: slide1
    },
    {
      title: "WELCOME TO HULL INSIGHT",
      description: "FASTER RENDERING OF RETURNS/ REPORTS AND DEFECTS BY SHIPS AND REFITTING AGENCIES. FACILITATE STATISTICAL ANALYSIS HITUS, COMMANDS AND NHQ.",
      image: slide2
    },
    {
      title: "WELCOME TO HULL INSIGHT",
      description: "FASTER RENDERING OF RETURNS/ REPORTS AND DEFECTS BY SHIPS AND REFITTING AGENCIES. FACILITATE STATISTICAL ANALYSIS HITUS, COMMANDS AND NHQ.",
      image: slide3
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
      title: "Hull Management", 
      icon: <Ship className="w-8 h-8" />,
      description: "Comprehensive hull maintenance tracking and lifecycle management for naval vessels.",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      title: "Defect Tracking", 
      icon: <Target className="w-8 h-8" />,
      description: "Advanced defect detection and reporting system with real-time monitoring capabilities.",
      color: "from-emerald-500 to-teal-500"
    },
    { 
      title: "Analytics Dashboard", 
      icon: <BarChart3 className="w-8 h-8" />,
      description: "Powerful analytics and reporting tools for data-driven decision making.",
      color: "from-purple-500 to-pink-500"
    },
    { 
      title: "Fleet Operations", 
      icon: <Navigation className="w-8 h-8" />,
      description: "Streamlined fleet management with operational tracking and resource allocation.",
      color: "from-orange-500 to-red-500"
    },
    { 
      title: "Security & Compliance", 
      icon: <ShieldCheck className="w-8 h-8" />,
      description: "Robust security measures and compliance tracking for naval operations.",
      color: "from-indigo-500 to-blue-500"
    },
    { 
      title: "Real-time Monitoring", 
      icon: <Activity className="w-8 h-8" />,
      description: "Live monitoring and alert systems for proactive maintenance management.",
      color: "from-green-500 to-emerald-500"
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
                  HULL INSIGHT
                </h1>
                <p className={`text-sm transition-colors duration-300 ${
                  scrolled ? 'text-gray-600' : 'text-blue-100'
                }`}>
                  Naval Excellence Platform
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
                Home
              </a>
              <a 
                href="#about" 
                className={`font-medium transition-all duration-300 hover:scale-105 ${
                  scrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                About
              </a>
              <a 
                href="#services" 
                className={`font-medium transition-all duration-300 hover:scale-105 ${
                  scrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Services
              </a>
              <a 
                href="#contact" 
                className={`font-medium transition-all duration-300 hover:scale-105 ${
                  scrolled 
                    ? 'text-gray-700 hover:text-blue-600' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Contact
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
                  Home
                </a>
                <a 
                  href="#about" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </a>
                <a 
                  href="#services" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </a>
                <a 
                  href="#contact" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Beautiful Hero Carousel */}
      <section id="home" className="relative h-screen overflow-hidden">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        
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
            <p className="text-xl md:text-2xl lg:text-3xl mb-12 leading-relaxed max-w-4xl mx-auto text-blue-100 font-light">
              {slides[currentSlide].description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Button 
                    onClick={handleLoginClick}
                className="group bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-10 py-5 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border border-white/20"
              >
                <Shield className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                Access Platform
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
              
              <Button 
                variant="outline"
                className="group border-2 border-white/30 text-black hover:bg-white hover:text-blue-600 px-10 py-5 text-xl rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
                  </Button>
                </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
                <div className="text-blue-200 text-lg">Naval Vessels</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
                <div className="text-blue-200 text-lg">Support</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">99.9%</div>
                <div className="text-blue-200 text-lg">Uptime</div>
              </div>
            </div>
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                KEY FEATURES
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the powerful capabilities that make Hull Insight the premier choice for naval maintenance management
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Settings className="w-12 h-12 text-amber-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-amber-600 transition-colors duration-300">
                  Design Approach
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Our systematic approach ensures comprehensive hull maintenance planning with integrated data analytics and predictive modeling for optimal vessel performance.
                </p>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-amber-200 transition-colors duration-500"></div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Sparkles className="w-12 h-12 text-blue-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  Innovative Solutions
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Cutting-edge technology solutions including AI-powered defect detection, automated reporting systems, and real-time monitoring capabilities for naval operations.
                </p>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-500"></div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <BarChart3 className="w-12 h-12 text-purple-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  Project Management
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Streamlined project workflows with comprehensive tracking, resource allocation, and milestone management for efficient naval maintenance operations.
                </p>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-purple-200 transition-colors duration-500"></div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Experience Excellence?
              </h3>
              <p className="text-gray-600 mb-6">
                Join thousands of naval professionals who trust Hull Insight for their maintenance management needs.
              </p>
              <Button 
                onClick={handleLoginClick}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Shield className="w-5 h-5 mr-2" />
                Get Started Today
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
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  ABOUT HULL INSIGHT
                </h2>
              </div>

              {/* Content with Beautiful Typography */}
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Hull Insight is an <span className="font-semibold text-blue-600">integrative software tool</span> aimed at effective life cycle management and paperless return and reports. The application ensures easy availability of all routine returns rendered by ship staff and survey rendered by repair yards across all stakeholders over the Naval Unified Domain.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  Further, the <span className="font-semibold text-indigo-600">single repository concept</span> envisaged is aimed at ensuring an institutional memory for informed decision making. At DNA, we solicit constructive feedback and suggestions to further enhance the applicability of the portal towards reliable life cycle management of Hull and associated systems.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-gray-700 font-medium">Life Cycle Management</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-gray-700 font-medium">Paperless Reports</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-gray-700 font-medium">Unified Domain</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-gray-700 font-medium">Institutional Memory</span>
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <span>Read More</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-300">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                OUR SERVICES
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive naval management solutions designed to streamline operations and enhance efficiency
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
                Ready to Experience Our Services?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Discover how our comprehensive naval management solutions can transform your operations and enhance efficiency.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleLoginClick}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Access Services
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beautiful Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                CONTACT US
              </h2>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Get in touch with our team for support, inquiries, or to learn more about Hull Insight
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <MapPin className="w-6 h-6 mr-3 text-blue-400" />
                  Our Address
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
            <div>
                      <p className="font-bold text-white text-lg">Directorate of Naval Architecture</p>
                      <p className="text-blue-100">Room No 200, Talkatora Stadium Annexe</p>
                      <p className="text-blue-100">New Delhi - 110 004</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                  <div>
                      <p className="text-white font-bold text-lg">NHQ-DNA-HULLINSIGHT</p>
                      <p className="text-blue-100">PAX: 6063, 6099</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                </div>
                  <div>
                      <Button 
                        variant="outline" 
                        className="border-2 border-white/30 text-black hover:bg-white hover:text-blue-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email Us
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form & Stats */}
            <div className="space-y-8">
              {/* Contact Form */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <MessageCircle className="w-6 h-6 mr-3 text-blue-400" />
                  Get in Touch
                </h3>
                <p className="text-blue-100 mb-6 leading-relaxed">
                  For any queries or support regarding Hull Insight, please contact us using the information provided or fill out the form below.
                </p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    />
                    <input 
                      type="email" 
                      placeholder="Your Email" 
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <textarea 
                    placeholder="Your Message" 
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none"
                  ></textarea>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                  <div className="text-3xl font-bold text-white mb-2">06/09/2025</div>
                  <div className="text-blue-200 text-sm">Last Updated</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
                  <div className="text-3xl font-bold text-white mb-2">71,298</div>
                  <div className="text-blue-200 text-sm">Visitors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beautiful Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white py-16 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500"></div>
          <div className="absolute top-10 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">HULL INSIGHT</h3>
                  <p className="text-blue-200">Naval Excellence Platform</p>
                </div>
              </div>
              <p className="text-blue-100 leading-relaxed mb-6 max-w-md">
                Advanced hull maintenance management system designed for naval operations, providing comprehensive tracking, analytics, and reporting capabilities.
              </p>
              <div className="flex space-x-4">
                <Button 
                  onClick={handleLoginClick}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Access Platform
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-white/30 text-black hover:bg-white hover:text-blue-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-cyan-300">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#home" className="text-blue-100 hover:text-white transition-colors duration-300">Home</a></li>
                <li><a href="#about" className="text-blue-100 hover:text-white transition-colors duration-300">About</a></li>
                <li><a href="#services" className="text-blue-100 hover:text-white transition-colors duration-300">Services</a></li>
                <li><a href="#contact" className="text-blue-100 hover:text-white transition-colors duration-300">Contact</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-cyan-300">Contact Info</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-100 text-sm">New Delhi, India</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-100 text-sm">PAX: 6063, 6099</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-100 text-sm">support@hullinsight.navy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
             
              <div className="flex items-center space-x-6 text-blue-200 text-sm">
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