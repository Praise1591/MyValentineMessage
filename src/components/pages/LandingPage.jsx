// src/components/pages/LandingPage.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import html2canvas from 'html2canvas';
import { 
  Truck, Shield, Zap, Globe, Clock, Package, Users, Star, 
  ChevronRight, Menu, X, ArrowRight, MapPin, Phone, Mail, 
  CheckCircle, Headphones, ArrowUp, Search, FileText, Download,
  Eye, Navigation, LocateFixed, Calendar, Clock as ClockIcon,
  Sun, Moon, Lock, Key, User, LogIn, Award, TrendingUp, 
  Heart, Gift, Coffee, Smartphone, Laptop, Bot, Cpu,
  Sparkles, UserCheck, RefreshCw
} from "lucide-react";

// Import Firebase service
import { deliveryService } from '../../services/firebase';

function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [trackingId, setTrackingId] = useState("");
  const [trackedDelivery, setTrackedDelivery] = useState(null);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerDeliveries, setCustomerDeliveries] = useState([]);
  const [showCustomerPortal, setShowCustomerPortal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeCustomerTab, setActiveCustomerTab] = useState("track");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Refs for receipt capture
  const receiptRef = useRef(null);
  
  const phrases = ["deliveries", "happiness", "business growth", "customer trust"];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const features = [
    { icon: Zap, title: "Lightning Fast", description: "Same-day delivery across all major cities", color: "#f59e0b" },
    { icon: Shield, title: "100% Secure", description: "End-to-end encryption & insurance up to $10,000", color: "#10b981" },
    { icon: Globe, title: "Global Reach", description: "200+ countries worldwide with local partners", color: "#3b82f6" },
    { icon: Clock, title: "24/7 Support", description: "Round-the-clock assistance via email", color: "#8b5cf6" },
    { icon: Award, title: "Trusted Service", description: "10,000+ satisfied customers", color: "#ec4899" },
    { icon: TrendingUp, title: "Real-time Tracking", description: "Live updates at every step", color: "#06b6d4" }
  ];

  const stats = [
    { value: "58K+", label: "Deliveries", icon: Package },
    { value: "98%", label: "On-Time Rate", icon: Clock },
    { value: "4.7", label: "Rating", icon: Star },
    { value: "200+", label: "Cities", icon: Globe }
  ];

  // Typing animation
  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex <= currentPhrase.length) {
        setTypedText(currentPhrase.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setTypedText(currentPhrase.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex > currentPhrase.length) {
        setIsDeleting(true);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPhraseIndex((phraseIndex + 1) % phrases.length);
      }
    }, isDeleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(prev => !prev), 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-refresh deliveries every 15 seconds to show updated locations
  useEffect(() => {
    if (showCustomerPortal && customerEmail) {
      const interval = setInterval(() => {
        refreshDeliveries();
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [showCustomerPortal, customerEmail]);

  // UPDATED: Refresh function to load latest deliveries from Firebase
  const refreshDeliveries = async () => {
    if (!customerEmail) return;
    
    setIsRefreshing(true);
    try {
      // Use Firebase service to get deliveries by email
      const userDeliveries = await deliveryService.getByEmail(customerEmail);
      setCustomerDeliveries(userDeliveries);
      
      if (userDeliveries.length === 0) {
        toast.error(`No deliveries found for "${customerEmail}".`);
      } else {
        toast.success(`📦 Found ${userDeliveries.length} deliveries!`);
      }
    } catch (error) {
      console.error('Error refreshing deliveries:', error);
      toast.error('Failed to refresh deliveries');
    } finally {
      setIsRefreshing(false);
    }
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // UPDATED: Handle Track Package with Firebase
  const handleTrackPackage = async () => {
    if (!trackingId.trim()) {
      toast.error("Please enter a tracking ID");
      return;
    }
    
    try {
      // Use Firebase service to get delivery by tracking ID
      const delivery = await deliveryService.getByTrackingId(trackingId.trim());
      
      if (delivery) {
        setTrackedDelivery(delivery);
        setShowTrackModal(true);
        setTrackingId("");
        toast.success("✅ Delivery found!");
      } else {
        toast.error("No delivery found with that tracking ID. Please check and try again.");
      }
    } catch (error) {
      console.error('Error tracking package:', error);
      toast.error("Error searching for delivery. Please try again.");
    }
  };

  // UPDATED: SECURE ADMIN ACCESS + Customer Login with Firebase
  const handleCustomerLogin = async () => {
    if (!customerEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }
    
    // SECRET ADMIN ACCESS PATTERN - Hidden from UI
    const isAdminSecret = customerEmail.toLowerCase() === "cycle.admin@system.local" || 
                          customerEmail.toLowerCase().includes("admin+secret") ||
                          customerEmail.toLowerCase() === "admin@cycle.secret";
    
    if (isAdminSecret) {
      localStorage.setItem("admin_authenticated", "true");
      toast.success("🔐 Administrative access granted! Redirecting to control panel...", {
        icon: '🔑',
        duration: 3000
      });
      setTimeout(() => {
        window.location.href = "/#/admin/dashboard";
      }, 1500);
      setCustomerEmail("");
      setShowCustomerPortal(false);
      return;
    }
    
    // Regular customer login - Use Firebase
    setLoading(true);
    try {
      // Use Firebase service to get deliveries by email
      const userDeliveries = await deliveryService.getByEmail(customerEmail);
      
      setCustomerDeliveries(userDeliveries);
      setShowCustomerPortal(true);
      
      if (userDeliveries.length === 0) {
        toast.error(`No deliveries found for "${customerEmail}". Please check with the sender.`);
        
        // Check if there are any deliveries in the system
        const allDeliveries = await deliveryService.getAll();
        if (allDeliveries.length > 0) {
          const availableEmails = [...new Set(allDeliveries.map(d => d.customerEmail).filter(Boolean))];
          console.log("💡 Available customer emails in system:", availableEmails);
        }
      } else {
        toast.success(`Welcome! Found ${userDeliveries.length} delivery/deliveries.`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error("Error loading deliveries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setShowCustomerPortal(false);
    setCustomerEmail("");
    setCustomerName("");
    setCustomerDeliveries([]);
    setActiveCustomerTab("deliveries");
    toast.success("Logged out successfully");
  };

  const viewReceipt = (delivery) => {
    if (delivery.receipt) {
      setSelectedReceipt(delivery.receipt);
      setShowReceiptModal(true);
    } else {
      toast.error("Receipt not available yet. Please check back later.");
    }
  };

  const downloadReceiptAsPNG = async () => {
    if (receiptRef.current) {
      try {
        toast.loading("Generating receipt image...", { id: "receipt-gen" });
        const canvas = await html2canvas(receiptRef.current, { 
          scale: 2, 
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true
        });
        const imageUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Cycle_Receipt_${selectedReceipt.receiptId}.png`;
        link.href = imageUrl;
        link.click();
        toast.success(`Receipt ${selectedReceipt.receiptId} downloaded!`, { id: "receipt-gen" });
      } catch (error) {
        console.error('Error generating receipt:', error);
        toast.error('Failed to generate receipt', { id: "receipt-gen" });
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: "text-amber-600", bg: "bg-amber-100", icon: Clock, text: "Pending" },
      assigned: { color: "text-blue-600", bg: "bg-blue-100", icon: UserCheck, text: "Assigned" },
      picked_up: { color: "text-purple-600", bg: "bg-purple-100", icon: Package, text: "Picked Up" },
      in_transit: { color: "text-cyan-600", bg: "bg-cyan-100", icon: Truck, text: "In Transit" },
      delivered: { color: "text-emerald-600", bg: "bg-emerald-100", icon: CheckCircle, text: "Delivered" }
    };
    return badges[status] || badges.pending;
  };

  const bgGradient = darkMode 
    ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50";

  const textColor = darkMode ? "text-white" : "text-slate-800";
  const cardBg = darkMode ? "bg-white/10 backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl";
  const borderColor = darkMode ? "border-white/20" : "border-white/50";

  return (
    <div className={`${bgGradient} ${textColor} overflow-x-hidden min-h-screen relative transition-all duration-500`}>
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] -top-[300px] -right-[200px] rounded-full bg-gradient-radial from-blue-500/10 to-transparent animate-float"></div>
        <div className="absolute w-[500px] h-[500px] -bottom-[250px] -left-[200px] rounded-full bg-gradient-radial from-purple-500/10 to-transparent animate-float-delayed"></div>
        <div className="absolute w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-pink-500/5 to-transparent animate-float-slow"></div>
        <div className="absolute w-[300px] h-[300px] top-20 right-20 rounded-full bg-gradient-radial from-cyan-500/5 to-transparent animate-pulse-slow"></div>
      </div>

      <Toaster position="top-right" />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 ${darkMode ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-xl z-[1000] border-b ${borderColor} transition-all duration-300 shadow-sm`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('home')}>
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse-glow shadow-lg group-hover:scale-105 transition-transform">
              <Truck size={28} color="white" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">CYCLE</div>
              <div className={`text-xs ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>Premium Logistics</div>
            </div>
          </div>
          
          <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-[72px] md:top-0 left-0 right-0 ${darkMode ? 'bg-slate-900/98' : 'bg-white/98'} md:bg-transparent p-8 md:p-0 gap-6 md:gap-8 items-center z-50 transition-all duration-300`}>
            <a onClick={() => scrollToSection('home')} className="cursor-pointer hover:text-blue-500 transition-all font-medium">Home</a>
            <a onClick={() => scrollToSection('features')} className="cursor-pointer hover:text-blue-500 transition-all font-medium">Features</a>
            <a onClick={() => scrollToSection('customer-portal')} className="cursor-pointer hover:text-blue-500 transition-all font-medium">Track Delivery</a>
            <a onClick={() => scrollToSection('contact')} className="cursor-pointer hover:text-blue-500 transition-all font-medium">Contact</a>
          </div>
          
          <div className="flex gap-3 items-center">
            <button onClick={() => setDarkMode(!darkMode)} className="cursor-pointer p-2 rounded-full hover:bg-gray-200/20 transition">
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>
            <button className="md:hidden p-2 rounded-full hover:bg-gray-200/20 transition" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen pt-32 pb-20 px-4 sm:px-8 relative z-10 flex items-center" id="home">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm mb-6">
              <Sparkles size={16} className="text-purple-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Premium Delivery Service</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight">
              Track Your
              <span className="block mt-2">
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">{typedText}</span>
                <span className="inline-block w-1 h-10 ml-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-blink">|</span>
              </span>
              <br />in Real-Time
            </h1>
            <p className={`text-base sm:text-lg mt-6 leading-relaxed max-w-lg ${darkMode ? 'text-white/70' : 'text-slate-600'}`}>
              Enterprise-grade logistics platform with AI-powered tracking. Track your packages in real-time, 
              get instant updates, and experience hassle-free deliveries with Cycle.
            </p>
            <div className="flex flex-wrap gap-8 mt-8">
              {stats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div key={idx} className="text-center" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}>
                    <IconComponent size={28} className="text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className={`text-xs ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <div>
            {!showCustomerPortal ? (
              <motion.div className={`${cardBg} backdrop-blur-md rounded-2xl p-6 sm:p-8 border ${borderColor} shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-3xl`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
                  <button 
                    onClick={() => setActiveCustomerTab("track")} 
                    className={`cursor-pointer font-medium px-4 py-2 transition-all rounded-lg ${activeCustomerTab === "track" ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' : ''}`}
                  >
                    Quick Track
                  </button>
                  <button 
                    onClick={() => setActiveCustomerTab("login")} 
                    className={`cursor-pointer font-medium px-4 py-2 transition-all rounded-lg ${activeCustomerTab === "login" ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' : ''}`}
                  >
                    My Account
                  </button>
                </div>

                {activeCustomerTab === "track" ? (
                  <>
                    <h3 className="text-2xl font-bold mb-2">Quick Track</h3>
                    <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-slate-500'} mb-4`}>Enter your tracking ID to get real-time updates</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="text" 
                        className={`flex-1 px-4 py-3 rounded-xl border ${borderColor} ${darkMode ? 'bg-white/10' : 'bg-white'} outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                        placeholder="e.g., CYC-1734567890-ABC123" 
                        value={trackingId} 
                        onChange={(e) => setTrackingId(e.target.value)} 
                        onKeyPress={(e) => e.key === 'Enter' && handleTrackPackage()} 
                      />
                      <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold transition-all hover:-translate-y-1 hover:shadow-lg" onClick={handleTrackPackage}>
                        Track Now <Search size={16} className="inline ml-2" />
                      </button>
                    </div>
                    <div className="mt-4 p-3 rounded-lg bg-blue-500/10 text-xs text-center">
                      <span className="font-medium">🔍 Pro tip:</span> Enter your tracking ID from order confirmation email
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold mb-2">Customer Portal</h3>
                    <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-slate-500'} mb-4`}>Enter the email used when placing your order</p>
                    <input 
                      type="email" 
                      className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${darkMode ? 'bg-white/10' : 'bg-white'} outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all mb-3`}
                      placeholder="Your Email *" 
                      value={customerEmail} 
                      onChange={(e) => setCustomerEmail(e.target.value)} 
                    />
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold transition-all hover:-translate-y-1 hover:shadow-lg disabled:opacity-50" onClick={handleCustomerLogin} disabled={loading}>
                      {loading ? <div className="spinner mx-auto" /> : <>Access My Deliveries <ArrowRight size={16} className="inline ml-2" /></>}
                    </button>
                    <p className={`text-xs text-center mt-3 opacity-60`}>
                      Only deliveries created with your email will appear here
                    </p>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div className={`${cardBg} backdrop-blur-md rounded-2xl p-6 sm:p-8 border ${borderColor} shadow-2xl`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
                  <div>
                    <h3 className="text-2xl font-bold mb-1 flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                        <User size={20} color="white" />
                      </div>
                      Welcome, {customerEmail.split('@')[0]}!
                    </h3>
                    <p className={`text-xs ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>{customerEmail}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="border-2 border-blue-500/30 px-3 py-2 rounded-full font-bold transition-all hover:border-blue-500 disabled:opacity-50 text-sm flex items-center gap-2"
                      onClick={refreshDeliveries}
                      disabled={isRefreshing}
                    >
                      <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin' : ''}`} />
                      {isRefreshing ? '...' : 'Refresh'}
                    </button>
                    <button className="border-2 border-red-500/30 px-4 py-2 rounded-full font-bold transition-all hover:border-red-500 hover:text-red-500" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-4 flex-wrap">
                  {[
                    { id: "deliveries", label: `My Deliveries (${customerDeliveries.length})`, icon: Package },
                    { id: "track", label: "Track Package", icon: Search }
                  ].map(tab => {
                    const IconComponent = tab.icon;
                    return (
                      <button 
                        key={tab.id} 
                        className={`cursor-pointer font-medium px-4 py-2 transition-all flex items-center gap-2 rounded-t-lg ${activeCustomerTab === tab.id ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : ''}`} 
                        onClick={() => setActiveCustomerTab(tab.id)}
                      >
                        <IconComponent size={16} /> {tab.label}
                      </button>
                    );
                  })}
                </div>

                {activeCustomerTab === "deliveries" && (
                  <div className="max-h-[500px] overflow-y-auto space-y-3">
                    {customerDeliveries.length === 0 ? (
                      <div className="text-center py-12">
                        <Package size={48} className="mx-auto opacity-30 mb-3" />
                        <p className="opacity-60">No deliveries found for this email.</p>
                        <p className="text-xs opacity-40 mt-2">Please check with the sender or try refreshing.</p>
                      </div>
                    ) : (
                      customerDeliveries.map(delivery => {
                        const badge = getStatusBadge(delivery.status);
                        const IconComponent = badge.icon;
                        const hasReceipt = delivery.receipt && delivery.receiptGenerated;
                        return (
                          <motion.div 
                            key={delivery.id} 
                            className={`${darkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-xl p-4 cursor-pointer transition-all hover:${darkMode ? 'bg-white/10' : 'bg-gray-100'} hover:translate-x-1 border ${borderColor}`} 
                            onClick={() => { setTrackedDelivery(delivery); setShowTrackModal(true); }}
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex justify-between items-center flex-wrap gap-3 mb-2">
                              <div><span className="font-mono font-semibold text-sm">{delivery.trackingId}</span></div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.color}`}>
                                <IconComponent size={10} className="inline mr-1" />{badge.text}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                              <div className="flex items-center gap-1">
                                <MapPin size={12} className="text-blue-500" />
                                <span className="opacity-70">From: {delivery.pickupAddress?.substring(0, 30)}...</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <LocateFixed size={12} className="text-purple-500" />
                                <span className="opacity-70">To: {delivery.dropoffAddress?.substring(0, 30)}...</span>
                              </div>
                            </div>
                            
                            {/* Live Location Display */}
                            {delivery.currentLocation && delivery.status !== "delivered" && (
                              <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                                <div className="flex items-center gap-2 mb-1">
                                  <Navigation size={14} className="text-blue-500 animate-pulse" />
                                  <span className="text-xs font-semibold">Live Package Location</span>
                                  <span className="ml-auto text-[10px] text-green-500 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                    Live
                                  </span>
                                </div>
                                <div className="text-sm font-medium ml-6">{delivery.currentLocation}</div>
                                {delivery.locationUpdatedAt && (
                                  <div className="text-[10px] text-gray-500 ml-6 mt-1">
                                    Updated: {new Date(delivery.locationUpdatedAt).toLocaleString()}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs">
                              <div className="flex items-center gap-1">
                                <Truck size={12} />
                                <span>Driver: {delivery.driverName || 'Assigning...'}</span>
                              </div>
                              <div className="font-semibold">${delivery.price || 25}</div>
                            </div>
                            
                            {/* Receipt Button - Only show if receipt exists */}
                            {hasReceipt && (
                              <button className="mt-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105" onClick={(e) => { e.stopPropagation(); viewReceipt(delivery); }}>
                                <FileText size={12} className="inline mr-1" /> View Receipt
                              </button>
                            )}
                            
                            {/* Refresh indicator for live updates */}
                            <div className="mt-2 text-[10px] text-gray-400 text-right">
                              <span className="inline-flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                Live tracking active
                              </span>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                )}

                {activeCustomerTab === "track" && (
                  <div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-0">
                      <input 
                        type="text" 
                        className={`flex-1 px-4 py-3 rounded-xl border ${borderColor} ${darkMode ? 'bg-white/10' : 'bg-white'} outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                        placeholder="Enter tracking ID" 
                        value={trackingId} 
                        onChange={(e) => setTrackingId(e.target.value)} 
                        onKeyPress={(e) => e.key === 'Enter' && handleTrackPackage()}
                      />
                      <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold transition-all hover:-translate-y-1 hover:shadow-lg" onClick={handleTrackPackage}>
                        Track Now
                      </button>
                    </div>
                    <div className="mt-5">
                      <h4 className="font-bold mb-3 flex items-center gap-2">
                        <Clock size={16} className="text-blue-500" />
                        Your Recent Deliveries ({customerDeliveries.length})
                        <button 
                          className="ml-auto text-xs text-blue-500 hover:text-blue-600 transition flex items-center gap-1"
                          onClick={refreshDeliveries}
                          disabled={isRefreshing}
                        >
                          <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
                          {isRefreshing ? '...' : 'Refresh'}
                        </button>
                      </h4>
                      <div className="space-y-2">
                        {customerDeliveries.slice(0, 3).map(delivery => {
                          const badge = getStatusBadge(delivery.status);
                          return (
                            <div key={delivery.id} className={`${darkMode ? 'bg-white/5' : 'bg-gray-50'} rounded-xl p-3 cursor-pointer transition-all hover:${darkMode ? 'bg-white/10' : 'bg-gray-100'}`} onClick={() => { setTrackedDelivery(delivery); setShowTrackModal(true); }}>
                              <div className="flex justify-between items-center flex-wrap gap-2">
                                <div>
                                  <span className="font-mono text-sm font-semibold">{delivery.trackingId}</span>
                                  {delivery.currentLocation && delivery.status !== "delivered" && (
                                    <div className="text-[10px] text-blue-500 mt-1 flex items-center gap-1">
                                      <MapPin size={10} /> {delivery.currentLocation.substring(0, 30)}...
                                    </div>
                                  )}
                                  <div className={`text-xs opacity-50 mt-1`}>{new Date(delivery.createdAt).toLocaleDateString()}</div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs ${badge.bg} ${badge.color}`}>{badge.text}</span>
                              </div>
                            </div>
                          );
                        })}
                        {customerDeliveries.length > 3 && (
                          <button className="w-full mt-3 border-2 border-gray-300 dark:border-gray-600 py-2 rounded-full font-bold transition-all hover:border-blue-500" onClick={() => setActiveCustomerTab("deliveries")}>
                            View All ({customerDeliveries.length})
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-8 relative z-10" id="features">
        <div className="max-w-[1400px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm mb-4">
              <Award size={16} className="text-purple-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Why Choose Us</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              Why Choose <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Cycle</span>?
            </h2>
            <p className={`text-center ${darkMode ? 'text-white/70' : 'text-slate-600'} max-w-2xl mx-auto`}>
              Experience the future of logistics with our cutting-edge features and unmatched service quality
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const IconComponent = feature.icon;
              return (
                <motion.div 
                  key={idx} 
                  className={`${cardBg} backdrop-blur-md p-6 rounded-2xl text-center transition-all duration-300 border ${borderColor} cursor-pointer group hover:-translate-y-2 hover:shadow-2xl`}
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ delay: idx * 0.1 }} 
                  viewport={{ once: true }}
                >
                  <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-gradient-to-br from-${feature.color}/20 to-transparent group-hover:scale-110 transition-transform`}>
                    <IconComponent size={40} color={feature.color} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className={`opacity-70 text-sm`}>{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Email Only */}
      <section className="py-24 px-4 sm:px-8 relative z-10" id="contact">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className={`${cardBg} backdrop-blur-md rounded-3xl p-12 border ${borderColor} shadow-2xl`}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center animate-pulse-glow">
              <Mail size={40} color="white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Need Help With <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Your Delivery</span>?
            </h2>
            <p className={`${darkMode ? 'text-white/70' : 'text-slate-600'} mb-8 max-w-lg mx-auto`}>
              Our customer support team is available 24/7 to assist you with any questions or concerns.
            </p>
            <div className="flex flex-col items-center gap-4">
              <a 
                href="mailto:mycycleride1@gmail.com" 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:-translate-y-2 hover:shadow-2xl"
              >
                <Mail size={24} /> mycycleride1@gmail.com
              </a>
              <p className={`text-xs ${darkMode ? 'text-white/50' : 'text-slate-500'}`}>
                ✉️ We typically respond within 2-4 hours
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-xl py-12 px-4 sm:px-8 relative z-10 text-white mt-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center">
                  <Truck size={20} />
                </div>
                <div className="text-xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">CYCLE</div>
              </div>
              <p className="text-white/60 text-sm mb-4">Premium logistics platform delivering happiness worldwide since 2020.</p>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.683-3.027 13.9 13.9 0 002.049-7.137c0-.21-.005-.418-.015-.626a9.946 9.946 0 002.44-2.524z"/></svg>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
              <div className="space-y-2 text-white/60">
                <div><a onClick={() => scrollToSection('home')} className="cursor-pointer hover:text-white transition">Home</a></div>
                <div><a onClick={() => scrollToSection('features')} className="cursor-pointer hover:text-white transition">Features</a></div>
                <div><a onClick={() => scrollToSection('customer-portal')} className="cursor-pointer hover:text-white transition">Track Delivery</a></div>
                <div><a onClick={() => scrollToSection('contact')} className="cursor-pointer hover:text-white transition">Contact Support</a></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Legal</h4>
              <div className="space-y-2 text-white/60">
                <div><a onClick={() => setShowPrivacyModal(true)} className="cursor-pointer hover:text-white transition">Privacy Policy</a></div>
                <div><a onClick={() => setShowTermsModal(true)} className="cursor-pointer hover:text-white transition">Terms of Service</a></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-lg">Contact Info</h4>
              <div className="space-y-3 text-white/60 text-sm">
                <div className="flex items-center gap-2">
                  <Mail size={16} /> mycycleride1@gmail.com
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} /> 24/7 Support Available
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={16} /> Worldwide Delivery
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-8 mt-8 border-t border-white/10 text-white/40 text-sm">
            <p>&copy; 2025 Cycle Logistics. All rights reserved. | Premium Delivery Service</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      <div className={`fixed bottom-7 right-7 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer z-[1000] transition-all duration-300 hover:-translate-y-1 hover:scale-110 shadow-lg ${showScrollTop ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={scrollToTop}>
        <ArrowUp size={24} />
      </div>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[2000] p-5" onClick={() => setShowPrivacyModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-auto p-6 ${textColor}`} onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-5 border-b border-gray-200 dark:border-gray-700 pb-3">
                <h3 className="text-2xl font-bold flex items-center gap-2"><Lock size={24} className="text-blue-500" /> Privacy Policy</h3>
                <button onClick={() => setShowPrivacyModal(false)} className="cursor-pointer text-2xl hover:text-red-500 transition">✕</button>
              </div>
              <div className="space-y-4 text-sm leading-relaxed">
                <div>
                  <h4 className="font-bold text-lg mb-2">1. Information We Collect</h4>
                  <p className="opacity-80">We collect information you provide directly to us, such as your name, email address, phone number, delivery addresses, and payment information when you create an account, place an order, or contact customer support.</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">2. How We Use Your Information</h4>
                  <p className="opacity-80">We use the information we collect to process your deliveries, communicate with you about your orders, improve our services, personalize your experience, and comply with legal obligations.</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">3. Data Security</h4>
                  <p className="opacity-80">We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your personal information from unauthorized access or disclosure.</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">4. Information Sharing</h4>
                  <p className="opacity-80">We do not sell your personal information. We may share your information with delivery partners, payment processors, or as required by law. All partners are bound by strict confidentiality agreements.</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">5. Your Rights</h4>
                  <p className="opacity-80">You have the right to access, correct, or delete your personal information. You can also opt-out of marketing communications at any time by clicking the unsubscribe link in our emails.</p>
                </div>
                <div className="bg-blue-500/10 p-4 rounded-lg mt-4">
                  <p className="text-sm"><strong>Contact Us:</strong> For privacy-related questions, email us at mycycleride1@gmail.com</p>
                  <p className="text-xs mt-2 opacity-60">Last updated: January 1, 2025</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:-translate-y-0.5 transition" onClick={() => setShowPrivacyModal(false)}>Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Terms of Service Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[2000] p-5" onClick={() => setShowTermsModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-auto p-6 ${textColor}`} onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-5 border-b border-gray-200 dark:border-gray-700 pb-3">
                <h3 className="text-2xl font-bold flex items-center gap-2"><FileText size={24} className="text-purple-500" /> Terms of Service</h3>
                <button onClick={() => setShowTermsModal(false)} className="cursor-pointer text-2xl hover:text-red-500 transition">✕</button>
              </div>
              <div className="space-y-4 text-sm leading-relaxed">
                <div>
                  <h4 className="font-bold text-lg mb-2">1. Acceptance of Terms</h4>
                  <p className="opacity-80">By accessing or using Cycle Logistics services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">2. Service Description</h4>
                  <p className="opacity-80">Cycle Logistics provides package delivery and logistics services including pickup, transportation, tracking, and delivery of packages to specified destinations within our service area.</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">3. User Responsibilities</h4>
                  <p className="opacity-80">You agree to provide accurate and complete information for all deliveries. You are responsible for ensuring that packages comply with all applicable laws and regulations and do not contain prohibited items.</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">4. Prohibited Items</h4>
                  <p className="opacity-80">The following items are strictly prohibited: illegal substances, hazardous materials, flammable liquids, explosives, weapons, perishable goods without proper packaging, live animals, and any items prohibited by law.</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">5. Delivery Estimates</h4>
                  <p className="opacity-80">Delivery time estimates are provided as a courtesy and are not guaranteed. Actual delivery times may vary due to weather, traffic, customs, or other unforeseen circumstances.</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">6. Liability and Insurance</h4>
                  <p className="opacity-80">Cycle Logistics provides insurance coverage up to $100 per package unless additional insurance is purchased. We are not liable for delays, lost packages due to incorrect addresses, or damages caused by improper packaging.</p>
                </div>
                <div className="bg-purple-500/10 p-4 rounded-lg mt-4">
                  <p className="text-sm"><strong>Contact:</strong> For questions about these terms, email us at mycycleride1@gmail.com</p>
                  <p className="text-xs mt-2 opacity-60">Last updated: January 1, 2025</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:-translate-y-0.5 transition" onClick={() => setShowTermsModal(false)}>Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tracking Modal with Live Location */}
      <AnimatePresence>
        {showTrackModal && trackedDelivery && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[2000] p-5" onClick={() => setShowTrackModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl max-w-md w-full max-h-[85vh] overflow-auto p-6 ${textColor}`} onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Package size={24} className="text-blue-500" />
                  Delivery Status
                </h3>
                <button onClick={() => setShowTrackModal(false)} className="cursor-pointer text-2xl hover:text-red-500 transition">✕</button>
              </div>
              
              <div className="text-center p-5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl mb-5">
                <div className="font-mono text-lg font-bold mb-2">{trackedDelivery.trackingId}</div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(trackedDelivery.status).bg} ${getStatusBadge(trackedDelivery.status).color}`}>
                  {getStatusBadge(trackedDelivery.status).text}
                </div>
              </div>

              {/* Live Location Section */}
              {trackedDelivery.currentLocation && trackedDelivery.status !== "delivered" && (
                <div className="mb-5 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Navigation size={18} className="text-blue-500 animate-pulse" />
                    <strong className="text-sm">Live Package Location</strong>
                    <span className="ml-auto text-[10px] text-green-500 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      Live
                    </span>
                  </div>
                  <div className="text-sm font-medium ml-7">{trackedDelivery.currentLocation}</div>
                  {trackedDelivery.locationUpdatedAt && (
                    <div className="text-xs text-gray-500 ml-7 mt-1">
                      Last updated: {new Date(trackedDelivery.locationUpdatedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              <div className="mb-5">
                <h4 className="text-sm font-bold mb-4">Tracking Progress</h4>
                <div className="relative">
                  <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="relative flex justify-between">
                    {[
                      { label: "Order", status: "pending", icon: FileText },
                      { label: "Driver", status: "assigned", icon: UserCheck },
                      { label: "Pickup", status: "picked_up", icon: Package },
                      { label: "Transit", status: "in_transit", icon: Truck },
                      { label: "Delivered", status: "delivered", icon: CheckCircle }
                    ].map((step, idx) => {
                      const statuses = ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered'];
                      const isCompleted = idx <= statuses.indexOf(trackedDelivery.status);
                      const IconComp = step.icon;
                      return (
                        <div key={idx} className="text-center z-10">
                          <div className={`w-8 h-8 rounded-full ${isCompleted ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-300 dark:bg-gray-600'} flex items-center justify-center mx-auto mb-2 shadow-md`}>
                            <IconComp size={14} color="white" />
                          </div>
                          <div className="text-[10px] font-medium">{step.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <h4 className="text-sm font-bold mb-3">Delivery Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-blue-500 mt-0.5" />
                    <div><strong>Pickup:</strong> {trackedDelivery.pickupAddress}</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <LocateFixed size={14} className="text-purple-500 mt-0.5" />
                    <div><strong>Dropoff:</strong> {trackedDelivery.dropoffAddress}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck size={14} className="text-green-500" />
                    <div><strong>Driver:</strong> {trackedDelivery.driverName || 'Assigning...'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-orange-500" />
                    <div><strong>Est. Delivery:</strong> {new Date(trackedDelivery.estimatedDelivery).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              {trackedDelivery.receipt && trackedDelivery.receiptGenerated && (
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold transition-all hover:-translate-y-1 hover:shadow-lg" onClick={() => viewReceipt(trackedDelivery)}>
                  <FileText size={16} className="inline mr-2" /> View Receipt
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceiptModal && selectedReceipt && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[2000] p-5" onClick={() => setShowReceiptModal(false)}>
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl max-w-md w-full p-6 ${textColor}`} onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-5 border-b border-gray-200 dark:border-gray-700 pb-3">
                <h3 className="text-xl font-bold flex items-center gap-2"><FileText size={20} /> Delivery Receipt</h3>
                <button onClick={() => setShowReceiptModal(false)} className="cursor-pointer text-2xl hover:text-red-500 transition">✕</button>
              </div>
              
              {/* Hidden receipt template with inline styles */}
              <div className="fixed -top-[9999px] -left-[9999px] z-[-1]">
                <div ref={receiptRef} style={{ 
                  width: '420px', 
                  background: '#ffffff', 
                  fontFamily: "'Courier New', monospace", 
                  padding: '24px', 
                  fontSize: '10px', 
                  border: '1px solid #cccccc',
                  color: '#000000'
                }}>
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #000000', paddingBottom: '10px' }}>
                      <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#000000' }}>CYCLE LOGISTICS</div>
                      <div style={{ fontSize: '9px', color: '#333333' }}>Global Delivery Services</div>
                      <div style={{ fontSize: '8px', color: '#666666' }}>mycycleride1@gmail.com</div>
                    </div>
                    
                    <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', background: '#f0f0f0', display: 'inline-block', padding: '4px 12px', borderRadius: '4px', color: '#000000' }}>OFFICIAL DELIVERY RECEIPT</div>
                      <div style={{ fontSize: '9px', marginTop: '5px', color: '#333333' }}>Receipt #{selectedReceipt.receiptId}</div>
                    </div>
                    
                    <div style={{ marginBottom: '15px', borderBottom: '1px dotted #999999', paddingBottom: '10px' }}>
                      <div style={{ color: '#000000' }}><strong>DATE:</strong> {new Date(selectedReceipt.date).toLocaleString()}</div>
                      <div style={{ color: '#000000' }}><strong>TRACKING ID:</strong> {selectedReceipt.trackingId}</div>
                      <div style={{ color: '#000000' }}><strong>CUSTOMER:</strong> {selectedReceipt.customerName}</div>
                      <div style={{ color: '#000000' }}><strong>EMAIL:</strong> {selectedReceipt.customerEmail}</div>
                    </div>
                    
                    <div style={{ marginBottom: '15px', borderBottom: '1px dotted #999999', paddingBottom: '10px', background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                      <div style={{ color: '#000000' }}>🕐 <strong>PICKUP TIME:</strong> {selectedReceipt.pickupTime}</div>
                      <div style={{ color: '#000000' }}>⏰ <strong>ESTIMATED DELIVERY:</strong> {selectedReceipt.estimatedDelivery}</div>
                      <div style={{ color: '#000000' }}>📅 <strong>ARRIVAL DATE:</strong> {selectedReceipt.arrivalDate}</div>
                      {selectedReceipt.actualDelivery && <div style={{ color: '#000000' }}>✅ <strong>ACTUAL DELIVERY:</strong> {selectedReceipt.actualDelivery}</div>}
                    </div>
                    
                    <div style={{ marginBottom: '15px', borderBottom: '1px dotted #999999', paddingBottom: '10px' }}>
                      <div style={{ color: '#000000' }}><strong>📍 PICKUP ADDRESS:</strong></div>
                      <div style={{ marginLeft: '8px', marginBottom: '8px', color: '#333333' }}>{selectedReceipt.pickupAddress || 'N/A'}</div>
                      <div style={{ color: '#000000' }}><strong>🏠 DROP OFF ADDRESS:</strong></div>
                      <div style={{ marginLeft: '8px', color: '#333333' }}>{selectedReceipt.dropoffAddress || 'N/A'}</div>
                    </div>
                    
                    <div style={{ marginBottom: '15px', borderBottom: '1px solid #000000', paddingBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #000000', marginBottom: '8px', paddingBottom: '4px', fontWeight: 'bold', color: '#000000' }}>
                        <span>ITEM</span><span>QTY</span><span>UNIT</span><span>TOTAL</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#000000' }}>
                        <span>{selectedReceipt.itemName}</span><span>{selectedReceipt.quantity}</span><span>${selectedReceipt.unitPrice}</span><span>${(selectedReceipt.quantity * selectedReceipt.unitPrice).toFixed(2)}</span>
                      </div>
                      <div style={{ borderTop: '1px dashed #cccccc', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#000000' }}>
                        <span>GRAND TOTAL</span><span>${selectedReceipt.price}.00</span>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ color: '#000000' }}><strong>🚚 DRIVER:</strong> {selectedReceipt.driverName}</div>
                      {selectedReceipt.driverNote && <div style={{ color: '#000000' }}><strong>📝 NOTE:</strong> {selectedReceipt.driverNote}</div>}
                    </div>
                    
                    <div style={{ marginTop: '15px', borderTop: '2px solid #000000', paddingTop: '15px', textAlign: 'center' }}>
                      <div style={{ marginTop: '10px', padding: '8px', background: '#fef3c7', borderRadius: '6px', display: 'inline-block' }}>
                        <div style={{ color: '#000000' }}>✓ VERIFIED DELIVERY ✓</div>
                      </div>
                      <div style={{ marginTop: '12px', fontSize: '8px', color: '#333333' }}>
                        Authorized by: <strong>Cycle Management</strong>
                        <div style={{ marginTop: '6px', color: '#666666' }}>Thank you for choosing Cycle Logistics!</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Preview */}
              <div className="max-h-[60vh] overflow-auto border border-gray-200 dark:border-gray-700 rounded-xl bg-white mb-4">
                <div className="p-4">
                  <div className="text-center mb-4 border-b-2 border-black pb-2">
                    <div className="text-lg font-bold">CYCLE LOGISTICS</div>
                    <div className="text-[8px]">Global Delivery Services</div>
                  </div>
                  <div className="text-center mb-3">
                    <div className="text-xs font-bold bg-gray-100 inline-block px-2 py-1 rounded">OFFICIAL DELIVERY RECEIPT</div>
                  </div>
                  <div className="text-[10px] space-y-1">
                    <div><strong>Receipt:</strong> {selectedReceipt.receiptId}</div>
                    <div><strong>Date:</strong> {new Date(selectedReceipt.date).toLocaleString()}</div>
                    <div><strong>Tracking:</strong> {selectedReceipt.trackingId}</div>
                    <div><strong>Customer:</strong> {selectedReceipt.customerName}</div>
                    <div className="mt-2 bg-gray-50 p-2 rounded">
                      <div>🕐 Pickup: {selectedReceipt.pickupTime}</div>
                      <div>⏰ Est. Delivery: {selectedReceipt.estimatedDelivery}</div>
                    </div>
                    <div><strong>Total:</strong> ${selectedReceipt.price}.00</div>
                    <div className="text-center mt-2 p-1 bg-amber-100 rounded">✓ VERIFIED DELIVERY ✓</div>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold transition-all hover:-translate-y-1 hover:shadow-lg" onClick={downloadReceiptAsPNG}>
                <Download size={16} className="inline mr-2" /> Download Receipt as PNG
              </button>
              <p className="text-[10px] text-center mt-3 opacity-60">
                Receipt will be downloaded as a high-quality PNG image
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, -50px) scale(1.1); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-float {
          animation: float 20s infinite ease-in-out;
        }
        .animate-float-delayed {
          animation: float 20s infinite ease-in-out 5s;
        }
        .animate-float-slow {
          animation: float 25s infinite ease-in-out 10s;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
        .animate-pulse-glow {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          50% { box-shadow: 0 0 0 20px rgba(59, 130, 246, 0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${darkMode ? '#1e1b4b' : '#e2e8f0'};
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
