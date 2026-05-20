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
  Sun, Moon, Lock, Key, User, LogIn
} from "lucide-react";

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
  
  // Admin Login States
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  
  // Refs for receipt capture
  const receiptRef = useRef(null);
  
  const phrases = ["deliveries", "happiness", "business growth", "customer trust"];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const features = [
    { icon: Zap, title: "Lightning Fast", description: "Same-day delivery across all major cities", color: "#f59e0b" },
    { icon: Shield, title: "100% Secure", description: "End-to-end encryption & insurance", color: "#10b981" },
    { icon: Globe, title: "Global Reach", description: "200+ countries worldwide", color: "#3b82f6" },
    { icon: Clock, title: "24/7 Support", description: "Round-the-clock assistance", color: "#8b5cf6" }
  ];

  const stats = [
    { value: "50K+", label: "Deliveries", icon: Package },
    { value: "98%", label: "On-Time Rate", icon: Clock },
    { value: "4.9", label: "Rating", icon: Star }
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

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleAdminLogin = () => {
    if (adminUsername === "admin" && adminPassword === "admin123") {
      localStorage.setItem("admin_authenticated", "true");
      toast.success("Admin access granted! Redirecting...");
      setTimeout(() => {
        window.location.href = "/MyValentineMessage/admin/dashboard";
      }, 1000);
    } else {
      toast.error("Invalid admin credentials. Use: admin / admin123");
    }
    setShowAdminLogin(false);
    setAdminUsername("");
    setAdminPassword("");
  };

  const handleTrackPackage = () => {
    if (!trackingId.trim()) {
      toast.error("Please enter a tracking ID");
      return;
    }
    
    const deliveries = JSON.parse(localStorage.getItem("cycle_deliveries") || "[]");
    const delivery = deliveries.find(d => d.trackingId === trackingId);
    
    if (delivery) {
      setTrackedDelivery(delivery);
      setShowTrackModal(true);
    } else {
      toast.error("No delivery found with that tracking ID");
    }
  };

  const handleCustomerLogin = () => {
    if (!customerEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const deliveries = JSON.parse(localStorage.getItem("cycle_deliveries") || "[]");
      const userDeliveries = deliveries.filter(d => 
        d.customerEmail?.toLowerCase() === customerEmail.toLowerCase()
      );
      
      setCustomerDeliveries(userDeliveries);
      setShowCustomerPortal(true);
      setLoading(false);
      
      if (userDeliveries.length === 0) {
        toast.error("No deliveries found for this email. Please check with the sender.");
      } else {
        toast.success(`Welcome! Found ${userDeliveries.length} delivery/deliveries.`);
      }
    }, 1000);
  };

  const handleLogout = () => {
    setShowCustomerPortal(false);
    setCustomerEmail("");
    setCustomerName("");
    setCustomerDeliveries([]);
    setActiveCustomerTab("track");
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
          logging: false
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
      assigned: { color: "text-blue-600", bg: "bg-blue-100", icon: User, text: "Assigned" },
      picked_up: { color: "text-purple-600", bg: "bg-purple-100", icon: Package, text: "Picked Up" },
      in_transit: { color: "text-cyan-600", bg: "bg-cyan-100", icon: Truck, text: "In Transit" },
      delivered: { color: "text-emerald-600", bg: "bg-emerald-100", icon: CheckCircle, text: "Delivered" }
    };
    return badges[status] || badges.pending;
  };

  const bgGradient = darkMode 
    ? "bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]"
    : "bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100";

  const textColor = darkMode ? "text-white" : "text-slate-800";
  const cardBg = darkMode ? "bg-white/10" : "bg-white/90";
  const borderColor = darkMode ? "border-white/20" : "border-black/10";

  return (
    <div className={`${bgGradient} ${textColor} overflow-x-hidden min-h-screen relative transition-all duration-300`}>
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] -top-[200px] -left-[200px] rounded-full bg-gradient-radial from-blue-500/15 to-transparent animate-float"></div>
        <div className="absolute w-[300px] h-[300px] -bottom-[100px] -right-[100px] rounded-full bg-gradient-radial from-purple-500/15 to-transparent animate-float-delayed"></div>
        <div className="absolute w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-pink-500/10 to-transparent animate-float-slow"></div>
      </div>

      <Toaster position="top-right" />

      {/* Admin Access Icon */}
      <div 
        className="fixed bottom-5 left-5 w-11 h-11 bg-black/50 rounded-full flex items-center justify-center cursor-pointer z-[99] transition-all duration-300 hover:bg-blue-600 hover:scale-110 backdrop-blur-sm"
        onClick={() => setShowAdminLogin(true)}
      >
        <Shield size={22} color="white" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 ${darkMode ? 'bg-[#0f0c29]/95' : 'bg-white/95'} backdrop-blur-xl z-[1000] border-b ${borderColor} transition-all duration-300`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse-glow">
              <Truck size={28} color="white" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">CYCLE</div>
              <div className={`text-xs ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>Logistics Platform</div>
            </div>
          </div>
          
          <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-[72px] md:top-0 left-0 right-0 ${darkMode ? 'bg-[#0f0c29]/98' : 'bg-white/98'} md:bg-transparent p-8 md:p-0 gap-6 md:gap-8 items-center z-50 transition-all duration-300`}>
            <a onClick={() => scrollToSection('home')} className="cursor-pointer hover:text-blue-500 transition-all">Home</a>
            <a onClick={() => scrollToSection('features')} className="cursor-pointer hover:text-blue-500 transition-all">Features</a>
            <a onClick={() => scrollToSection('customer-portal')} className="cursor-pointer hover:text-blue-500 transition-all">Track Delivery</a>
            <a onClick={() => scrollToSection('contact')} className="cursor-pointer hover:text-blue-500 transition-all">Contact</a>
          </div>
          
          <div className="flex gap-3 items-center">
            <button onClick={() => setDarkMode(!darkMode)} className="cursor-pointer">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen pt-32 pb-20 px-4 sm:px-8 relative z-10 flex items-center" id="home">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Track Your
              <span className="block mt-2">
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">{typedText}</span>
                <span className="inline-block w-1 h-8 ml-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-blink">|</span>
              </span>
              <br />in Real-Time
            </h1>
            <p className={`text-base sm:text-lg mt-6 leading-relaxed ${darkMode ? 'text-white/70' : 'text-slate-600'}`}>
              Enterprise-grade logistics platform. Track your packages in real-time, 
              get instant updates, and experience hassle-free deliveries with Cycle.
            </p>
            <div className="flex flex-wrap gap-8 mt-8">
              {stats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <div key={idx} className="text-center">
                    <IconComponent size={24} className="text-blue-500 mx-auto" />
                    <div className="text-2xl font-bold mt-1">{stat.value}</div>
                    <div className={`text-xs ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            {!showCustomerPortal ? (
              <motion.div className={`${cardBg} backdrop-blur-md rounded-2xl p-6 sm:p-8 border ${borderColor} shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
                  <button 
                    onClick={() => setActiveCustomerTab("track")} 
                    className={`cursor-pointer font-medium px-4 py-2 transition-all ${activeCustomerTab === "track" ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}
                  >
                    Quick Track
                  </button>
                  <button 
                    onClick={() => setActiveCustomerTab("login")} 
                    className={`cursor-pointer font-medium px-4 py-2 transition-all ${activeCustomerTab === "login" ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}
                  >
                    My Account
                  </button>
                </div>

                {activeCustomerTab === "track" ? (
                  <>
                    <h3 className="text-xl font-bold mb-2">Quick Track</h3>
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
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-2">Customer Portal</h3>
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
                    <p className={`text-xs text-center mt-3 opacity-50`}>
                      Only deliveries created with your email will appear here
                    </p>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div className={`${cardBg} backdrop-blur-md rounded-2xl p-6 sm:p-8 border ${borderColor} shadow-xl`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Welcome, {customerEmail.split('@')[0]}!</h3>
                    <p className={`text-xs ${darkMode ? 'text-white/60' : 'text-slate-500'}`}>{customerEmail}</p>
                  </div>
                  <button className="border-2 border-gray-300 dark:border-gray-600 px-4 py-2 rounded-full font-bold transition-all hover:border-blue-500" onClick={handleLogout}>Logout</button>
                </div>
                
                <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-4 flex-wrap">
                  {[
                    { id: "deliveries", label: "My Deliveries", icon: Package },
                    { id: "track", label: "Track Package", icon: Search }
                  ].map(tab => {
                    const IconComponent = tab.icon;
                    return (
                      <button 
                        key={tab.id} 
                        className={`cursor-pointer font-medium px-4 py-2 transition-all flex items-center gap-1 ${activeCustomerTab === tab.id ? 'text-blue-500 border-b-2 border-blue-500' : ''}`} 
                        onClick={() => setActiveCustomerTab(tab.id)}
                      >
                        <IconComponent size={16} /> {tab.label}
                      </button>
                    );
                  })}
                </div>

                {activeCustomerTab === "deliveries" && (
                  <div>
                    {customerDeliveries.length === 0 ? (
                      <p className="text-center opacity-50 py-10">No deliveries found for this email. Please check with the sender.</p>
                    ) : (
                      customerDeliveries.map(delivery => {
                        const badge = getStatusBadge(delivery.status);
                        const IconComponent = badge.icon;
                        return (
                          <div key={delivery.id} className={`${darkMode ? 'bg-white/5' : 'bg-black/5'} rounded-xl p-4 mb-3 cursor-pointer transition-all hover:${darkMode ? 'bg-white/10' : 'bg-black/10'} hover:translate-x-1`} onClick={() => { setTrackedDelivery(delivery); setShowTrackModal(true); }}>
                            <div className="flex justify-between items-center flex-wrap gap-3 mb-2">
                              <div><span className="font-mono font-semibold">{delivery.trackingId}</span></div>
                              <span className={`px-3 py-1 rounded-full text-xs ${badge.bg} ${badge.color}`}>
                                <IconComponent size={10} className="inline mr-1" />{badge.text}
                              </span>
                            </div>
                            <div className={`text-xs opacity-60`}>From: {delivery.pickupAddress?.substring(0, 40)}...</div>
                            <div className={`text-xs opacity-60`}>To: {delivery.dropoffAddress?.substring(0, 40)}...</div>
                            {delivery.currentLocation && (
                              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full text-xs mt-2">
                                <MapPin size={12} /> Current Package Location: {delivery.currentLocation}
                              </div>
                            )}
                            <div className="flex justify-between text-xs mt-2">
                              <span>Driver: {delivery.driverName || 'Assigning...'}</span>
                              <span>${delivery.price || 25}</span>
                            </div>
                            {delivery.receipt && (
                              <button className="mt-3 border-2 border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:border-blue-500" onClick={(e) => { e.stopPropagation(); viewReceipt(delivery); }}>
                                <FileText size={12} className="inline mr-1" /> View Receipt
                              </button>
                            )}
                          </div>
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
                      />
                      <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold transition-all hover:-translate-y-1 hover:shadow-lg" onClick={handleTrackPackage}>
                        Track
                      </button>
                    </div>
                    <div className="mt-5">
                      <h4 className="font-bold mb-4">Your Recent Deliveries</h4>
                      {customerDeliveries.slice(0, 3).map(delivery => {
                        const badge = getStatusBadge(delivery.status);
                        return (
                          <div key={delivery.id} className={`${darkMode ? 'bg-white/5' : 'bg-black/5'} rounded-xl p-3 mb-2 cursor-pointer transition-all hover:${darkMode ? 'bg-white/10' : 'bg-black/10'}`} onClick={() => { setTrackedDelivery(delivery); setShowTrackModal(true); }}>
                            <div className="flex justify-between items-center flex-wrap gap-2">
                              <div>
                                <span className="font-mono text-sm">{delivery.trackingId}</span>
                                <div className={`text-xs opacity-50`}>{new Date(delivery.createdAt).toLocaleDateString()}</div>
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
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-8 relative z-10 bg-black/30" id="features">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-4">
            Why Choose <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Cycle</span>?
          </h2>
          <p className={`text-center ${darkMode ? 'text-white/70' : 'text-slate-600'} mb-12 max-w-2xl mx-auto`}>
            Experience the future of logistics with our cutting-edge features
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const IconComponent = feature.icon;
              return (
                <motion.div 
                  key={idx} 
                  className={`${cardBg} backdrop-blur-md p-6 rounded-2xl text-center transition-all duration-300 border ${borderColor} cursor-pointer hover:-translate-y-2 hover:border-blue-500/50`}
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ delay: idx * 0.1 }} 
                  viewport={{ once: true }}
                >
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-br from-${feature.color}/20 to-transparent`}>
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

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-8 relative z-10 bg-gradient-to-br from-blue-500/10 to-purple-600/10 text-center" id="contact">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
          Need Help With <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Your Delivery</span>?
        </h2>
        <p className={`${darkMode ? 'text-white/70' : 'text-slate-600'} mb-8`}>Contact our support team for any assistance</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold transition-all hover:-translate-y-1 hover:shadow-lg" onClick={() => window.location.href = "mailto:support@cycle.com"}>
            <Mail size={18} className="inline mr-2" /> Email Support
          </button>
          <button className="border-2 border-gray-300 dark:border-gray-600 px-6 py-3 rounded-full font-bold transition-all hover:border-blue-500" onClick={() => alert("Call us: +1 (800) 123-4567")}>
            <Phone size={18} className="inline mr-2" /> Call Us
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 py-12 px-4 sm:px-8 relative z-10 text-white">
        <div className="max-w-[1200px] mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center">
                <Truck size={20} />
              </div>
              <div className="text-xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">CYCLE</div>
            </div>
            <p className="text-white/70 text-sm">Global Logistics Platform</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <div className="space-y-2 text-white/70">
              <div><a onClick={() => scrollToSection('home')} className="cursor-pointer hover:text-white transition">Home</a></div>
              <div><a onClick={() => scrollToSection('features')} className="cursor-pointer hover:text-white transition">Features</a></div>
              <div><a onClick={() => scrollToSection('customer-portal')} className="cursor-pointer hover:text-white transition">Track Delivery</a></div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <div className="space-y-2 text-white/70">
              <div><a className="cursor-pointer hover:text-white transition">Privacy Policy</a></div>
              <div><a className="cursor-pointer hover:text-white transition">Terms of Service</a></div>
            </div>
          </div>
        </div>
        <div className="text-center pt-8 mt-8 border-t border-white/10 text-white/50 text-sm">
          <p>&copy; 2025 Cycle Logistics. All rights reserved.</p>
        </div>
      </footer>

      {/* Scroll to Top */}
      <div className={`fixed bottom-7 right-7 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer z-[1000] transition-all duration-300 hover:-translate-y-1 hover:scale-110 ${showScrollTop ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={scrollToTop}>
        <ArrowUp size={24} />
      </div>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[2000] p-5" onClick={() => setShowAdminLogin(false)}>
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl max-w-md w-full p-6 ${textColor}`} onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-5 border-b border-gray-200 dark:border-gray-700 pb-3">
                <h3 className="text-xl font-bold flex items-center gap-2"><Shield size={20} /> Admin Access</h3>
                <button onClick={() => setShowAdminLogin(false)} className="cursor-pointer text-2xl">✕</button>
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Username</label>
                <input type="text" placeholder="Enter username" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${darkMode ? 'bg-white/10' : 'bg-white'} outline-none focus:border-blue-500`} />
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-medium">Password</label>
                <input type="password" placeholder="Enter password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${darkMode ? 'bg-white/10' : 'bg-white'} outline-none focus:border-blue-500`} onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()} />
              </div>
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold transition-all hover:-translate-y-1 hover:shadow-lg" onClick={handleAdminLogin}>
                Login as Admin
              </button>
              <p className="text-xs text-center mt-4 opacity-50">Demo: admin / admin123</p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Tracking Modal */}
      <AnimatePresence>
        {showTrackModal && trackedDelivery && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[2000] p-5" onClick={() => setShowTrackModal(false)}>
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl max-w-md w-full max-h-[80vh] overflow-auto p-6 ${textColor}`} onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold">Delivery Status</h3>
                <button onClick={() => setShowTrackModal(false)} className="cursor-pointer text-2xl">✕</button>
              </div>
              
              <div className="text-center p-5 bg-blue-500/10 rounded-xl mb-5">
                <div className="font-mono text-sm mb-2">{trackedDelivery.trackingId}</div>
                <div className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusBadge(trackedDelivery.status).bg} ${getStatusBadge(trackedDelivery.status).color}`}>
                  {getStatusBadge(trackedDelivery.status).text}
                </div>
              </div>

              {trackedDelivery.currentLocation && (
                <div className="mb-5 p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <LocateFixed size={18} className="text-blue-500" />
                    <strong className="text-sm">Current Package Location</strong>
                  </div>
                  <div className="text-sm ml-7">{trackedDelivery.currentLocation}</div>
                  {trackedDelivery.locationUpdatedAt && (
                    <div className="text-xs text-gray-500 ml-7 mt-1">
                      Last updated: {new Date(trackedDelivery.locationUpdatedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              <div className="mb-5">
                <h4 className="text-sm font-bold mb-3">Tracking Progress</h4>
                <div className="flex justify-between flex-wrap gap-2">
                  {['Order', 'Driver', 'Pickup', 'Transit', 'Delivered'].map((label, idx) => {
                    const statuses = ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered'];
                    const isCompleted = idx <= statuses.indexOf(trackedDelivery.status);
                    return (
                      <div key={idx} className="text-center flex-1">
                        <div className={`w-8 h-8 mx-auto mb-1 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-white/20'} flex items-center justify-center`}>
                          {isCompleted && <CheckCircle size={16} color="white" />}
                        </div>
                        <div className="text-[10px]">{label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-5">
                <h4 className="text-sm font-bold mb-3">Delivery Details</h4>
                <div className="text-sm space-y-1">
                  <div><strong>Pickup:</strong> {trackedDelivery.pickupAddress}</div>
                  <div><strong>Dropoff:</strong> {trackedDelivery.dropoffAddress}</div>
                  <div><strong>Driver:</strong> {trackedDelivery.driverName || 'Assigning...'}</div>
                  <div><strong>Est. Delivery:</strong> {new Date(trackedDelivery.estimatedDelivery).toLocaleDateString()}</div>
                </div>
              </div>

              {trackedDelivery.receipt && (
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold transition-all hover:-translate-y-1 hover:shadow-lg" onClick={() => viewReceipt(trackedDelivery)}>
                  <FileText size={16} className="inline mr-2" /> View Receipt
                </button>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceiptModal && selectedReceipt && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[2000] p-5" onClick={() => setShowReceiptModal(false)}>
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl max-w-md w-full p-6 ${textColor}`} onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-5 border-b border-gray-200 dark:border-gray-700 pb-3">
                <h3 className="text-xl font-bold flex items-center gap-2"><FileText size={20} /> Delivery Receipt</h3>
                <button onClick={() => setShowReceiptModal(false)} className="cursor-pointer text-2xl">✕</button>
              </div>
              
              {/* Hidden receipt template for PNG capture */}
              <div className="fixed -top-[9999px] -left-[9999px] z-[-1]">
                <div ref={receiptRef} className="w-[420px] bg-white font-['Courier_New',monospace] p-6 text-[10px] border border-gray-300 text-black">
                  <div className="text-center mb-5 border-b-2 border-black pb-3">
                    <div className="text-2xl font-bold">CYCLE LOGISTICS</div>
                    <div className="text-[9px]">Global Delivery Services</div>
                    <div className="text-[8px]">www.cycle.com | support@cycle.com</div>
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-sm font-bold bg-gray-100 inline-block px-3 py-1 rounded">OFFICIAL DELIVERY RECEIPT</div>
                    <div className="text-[9px] mt-1">Receipt #{selectedReceipt.receiptId}</div>
                  </div>
                  <div className="mb-4 border-b border-dotted border-gray-400 pb-3">
                    <div><strong>DATE:</strong> {new Date(selectedReceipt.date).toLocaleString()}</div>
                    <div><strong>TRACKING ID:</strong> {selectedReceipt.trackingId}</div>
                    <div><strong>CUSTOMER:</strong> {selectedReceipt.customerName}</div>
                    <div><strong>EMAIL:</strong> {selectedReceipt.customerEmail}</div>
                  </div>
                  <div className="mb-4 border-b border-dotted border-gray-400 pb-3 bg-gray-50 p-3 rounded">
                    <div>🕐 <strong>PICKUP TIME:</strong> {selectedReceipt.pickupTime}</div>
                    <div>⏰ <strong>ESTIMATED DELIVERY:</strong> {selectedReceipt.estimatedDelivery}</div>
                    <div>📅 <strong>ARRIVAL DATE:</strong> {selectedReceipt.arrivalDate}</div>
                  </div>
                  <div className="mb-4 border-b border-dotted border-gray-400 pb-3">
                    <div><strong>📍 PICKUP ADDRESS:</strong></div>
                    <div className="ml-2 mb-2">{selectedReceipt.pickupAddress || 'N/A'}</div>
                    <div><strong>🏠 DROP OFF ADDRESS:</strong></div>
                    <div className="ml-2">{selectedReceipt.dropoffAddress || 'N/A'}</div>
                  </div>
                  <div className="mb-4 border-b border-black pb-3">
                    <div className="flex justify-between border-b border-black mb-2 pb-1 font-bold">
                      <span>ITEM</span><span>QTY</span><span>UNIT</span><span>TOTAL</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>{selectedReceipt.itemName}</span><span>{selectedReceipt.quantity}</span><span>${selectedReceipt.unitPrice}</span><span>${(selectedReceipt.quantity * selectedReceipt.unitPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold mt-2 pt-2 border-t border-dashed border-gray-300">
                      <span>GRAND TOTAL</span><span>${selectedReceipt.price}.00</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div><strong>🚚 DRIVER:</strong> {selectedReceipt.driverName}</div>
                  </div>
                  <div className="text-center bg-blue-50 p-2 rounded mb-4">
                    <div>🔗 TRACK: cycle.com/track/{selectedReceipt.trackingId}</div>
                  </div>
                  <div className="text-center mt-4 pt-4 border-t-2 border-black">
                    <div className="inline-block bg-amber-100 p-2 rounded">✓ VERIFIED DELIVERY ✓</div>
                    <div className="mt-3 text-[8px]">Thank you for choosing Cycle Logistics!</div>
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
        .animate-float {
          animation: float 20s infinite ease-in-out;
        }
        .animate-float-delayed {
          animation: float 20s infinite ease-in-out 5s;
        }
        .animate-float-slow {
          animation: float 25s infinite ease-in-out 10s;
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