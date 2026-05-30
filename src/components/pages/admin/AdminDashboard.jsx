// src/components/pages/admin/AdminDashboard.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import html2canvas from 'html2canvas';
import { 
  LayoutDashboard, Users, Truck, Package, DollarSign, MapPin, Clock, 
  CheckCircle, XCircle, TrendingUp, TrendingDown, Eye, Edit, Trash2, 
  Plus, Search, Filter, RefreshCw, Menu, X, Home, UserPlus, UserCheck, 
  UserX, Calendar, Download, Printer, BarChart3, PieChart, LineChart, 
  Activity, Bell, Settings, LogOut, ChevronRight, ChevronDown, MoreHorizontal, 
  Star, Phone, Mail, AlertCircle, Shield, Award, Zap, Target, Globe, 
  Navigation, PackageCheck, PackageX, Clock4, ThumbsUp, MessageCircle, 
  FileText, CreditCard, Wallet, Send, MapPinIcon, Compass, QrCode,
  Copy, ExternalLink, Info, HelpCircle, Maximize2, Minimize2, Sparkles,
  Cloud, Wifi, Battery, Signal, Fingerprint, Lock, Key, Gift, Heart,
  LocateFixed, Navigation2, Route as RouteIcon, PartyPopper, Rocket,
  TrendingUp as TrendingUpIcon, Users as UsersIcon, ShoppingBag, Briefcase,
  Gamepad2, Trophy, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Brain, 
  Coffee, Moon, Sun, Music, Video, Camera, BookOpen, Map as MapIcon,
  Flag, Anchor, Compass as CompassIcon, Wind, CloudRain, Thermometer,
  BarChart, LineChart as LineChartIcon, PieChart as PieChartIcon,
  DollarSign as DollarSignIcon, Percent, Calendar as CalendarIcon,
  MessageSquare, Heart as HeartIcon, Smile, Frown, Meh, Lightbulb
} from "lucide-react";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReceiptInfoModal, setShowReceiptInfoModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignDriverName, setAssignDriverName] = useState("");
  const [assignDriverEmail, setAssignDriverEmail] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratingDelivery, setCelebratingDelivery] = useState(null);
  const [receiptCounter, setReceiptCounter] = useState(() => {
    const saved = localStorage.getItem("receipt_counter");
    return saved ? parseInt(saved) : 1001;
  });
  const [receiptInfo, setReceiptInfo] = useState({
    pickupTime: "",
    estimatedDelivery: "",
    actualDelivery: "",
    arrivalDate: "",
    price: "",
    driverNote: "",
    itemPrice: ""
  });
  
  // Game states
  const [diceValue, setDiceValue] = useState(null);
  const [diceRolling, setDiceRolling] = useState(false);
  const [diceHistory, setDiceHistory] = useState([]);
  const [mood, setMood] = useState("😊");
  const [funFact, setFunFact] = useState("");
  const [joke, setJoke] = useState("");
  
  // Weather mock data
  const [weather, setWeather] = useState({
    temp: 72,
    condition: "Sunny",
    icon: "☀️",
    humidity: 65,
    wind: 12
  });
  
  const [dailyQuote, setDailyQuote] = useState({
    quote: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  });
  
  const receiptRef = useRef(null);
  
  const [drivers, setDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [driverForm, setDriverForm] = useState({
    name: "", email: "", vehicle: "", licensePlate: "", address: ""
  });
  
  const [deliveryForm, setDeliveryForm] = useState({
    customerName: "", customerEmail: "", customerPhone: "", pickupAddress: "", 
    dropoffAddress: "", packageWeight: "", packageDescription: "", itemName: "", quantity: 1, unitPrice: 25
  });

  // Quick stats for dashboard
  const [quickStats, setQuickStats] = useState({
    todayDeliveries: 0,
    weeklyRevenue: 0,
    avgDeliveryTime: "2.5 hours",
    customerSatisfaction: "98%"
  });

  // Fun facts array
  const funFacts = [
    "🐱 A group of cats is called a clowder!",
    "🌊 The Pacific Ocean covers more area than all the continents combined!",
    "🍕 The world's largest pizza was 122 feet in diameter!",
    "🐘 Elephants are the only mammals that can't jump!",
    "🍫 Dark chocolate produces feel-good chemicals in your brain!",
    "🐬 Dolphins have names for each other!",
    "🎵 Listening to music releases dopamine in your brain!",
    "🌙 The moon is moving away from Earth by 1.5 inches per year!",
    "🐧 Penguins propose to their mates with a pebble!",
    "☕ Coffee is the second most traded commodity in the world!"
  ];

  // Jokes array
  const jokes = [
    "Why don't scientists trust atoms? Because they make up everything! 🔬",
    "What do you call a fake noodle? An impasta! 🍝",
    "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
    "What do you call a bear with no teeth? A gummy bear! 🐻",
    "Why don't eggs tell jokes? They'd crack each other up! 🥚",
    "What do you call a fish with no eyes? A fsh! 🐟",
    "Why did the math book look so sad? Because it had too many problems! 📚",
    "What do you call a sleeping bull? A bulldozer! 🐂"
  ];

  // Quotes array
  const quotes = [
    { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { quote: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { quote: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" }
  ];

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadData();
    loadNotifications();
    generateMockData();
    calculateQuickStats();
    setRandomFunFact();
    setRandomJoke();
    setRandomQuote();
  }, []);

  const setRandomFunFact = () => {
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    setFunFact(randomFact);
  };

  const setRandomJoke = () => {
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    setJoke(randomJoke);
  };

  const setRandomQuote = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setDailyQuote(randomQuote);
  };

  const rollDice = () => {
    setDiceRolling(true);
    setTimeout(() => {
      const value = Math.floor(Math.random() * 6) + 1;
      setDiceValue(value);
      setDiceRolling(false);
      setDiceHistory(prev => [value, ...prev].slice(0, 10));
      toast.success(`🎲 You rolled a ${value}!`);
    }, 500);
  };

  const calculateQuickStats = () => {
    const today = new Date().toDateString();
    const todayDeliveries = deliveries.filter(d => 
      new Date(d.createdAt).toDateString() === today
    ).length;
    
    const weeklyRevenue = deliveries
      .filter(d => d.status === "delivered")
      .reduce((sum, d) => sum + (d.price || 25), 0);
    
    setQuickStats({
      todayDeliveries,
      weeklyRevenue,
      avgDeliveryTime: "2.5 hours",
      customerSatisfaction: "98%"
    });
  };

  const generateMockData = () => {
    setRecentActivity([
      { id: 1, type: "delivery", action: "created", user: "John Smith", time: "5 min ago", icon: Package, color: "#10b981" },
      { id: 2, type: "driver", action: "approved", user: "Mike Driver", time: "1 hour ago", icon: UserCheck, color: "#3b82f6" },
      { id: 3, type: "delivery", action: "completed", user: "Sarah Johnson", time: "2 hours ago", icon: CheckCircle, color: "#10b981" },
      { id: 4, type: "delivery", action: "in transit", user: "David Wilson", time: "3 hours ago", icon: Truck, color: "#8b5cf6" }
    ]);
  };

  const loadData = () => {
    setLoading(true);
    
    const allUsers = JSON.parse(localStorage.getItem("cycle_users") || "[]");
    const allDrivers = allUsers.filter(u => u.userType === "driver");
    const allCustomers = allUsers.filter(u => u.userType === "customer");
    const pending = allDrivers.filter(d => d.status === "pending");
    
    setDrivers(allDrivers.filter(d => d.status === "active"));
    setCustomers(allCustomers);
    setPendingDrivers(pending);
    
    const allDeliveries = JSON.parse(localStorage.getItem("cycle_deliveries") || "[]");
    if (allDeliveries.length === 0) {
      const demoDeliveries = generateDemoDeliveries();
      localStorage.setItem("cycle_deliveries", JSON.stringify(demoDeliveries));
      setDeliveries(demoDeliveries);
    } else {
      setDeliveries(allDeliveries);
    }
    
    calculateQuickStats();
    setLoading(false);
  };

  const generateDemoDeliveries = () => {
    const customersList = ["John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis", "Robert Wilson", "Lisa Anderson"];
    const customerEmails = ["john@example.com", "sarah@example.com", "michael@example.com", "emily@example.com", "robert@example.com", "lisa@example.com"];
    const addresses = [
      "123 Main St, Downtown, NY 10001",
      "456 Oak Ave, Uptown, NY 10002",
      "789 Pine St, Westside, NY 10003",
      "321 Elm Blvd, Eastside, NY 10004",
      "555 Maple Dr, Northside, NY 10005",
      "777 Cedar Ln, Southside, NY 10006"
    ];
    const statuses = ["pending", "assigned", "picked_up", "in_transit", "delivered"];
    const weights = ["Light", "Medium", "Heavy"];
    const items = ["Smartphone", "Laptop", "Books", "Clothing", "Electronics", "Furniture"];
    
    return addresses.map((addr, index) => ({
      id: Date.now() + index,
      trackingId: `CYC-${Date.now() + index}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      customerName: customersList[index % customersList.length],
      customerEmail: customerEmails[index % customerEmails.length],
      customerPhone: `+1 555-${1000 + index}`,
      pickupAddress: addr,
      dropoffAddress: addresses[(index + 2) % addresses.length],
      packageWeight: weights[index % 3],
      packageDescription: items[index % items.length],
      itemName: items[index % items.length],
      quantity: Math.floor(Math.random() * 3) + 1,
      unitPrice: 25,
      status: statuses[index % statuses.length],
      driverName: index % 2 === 0 ? "John Driver" : "Sarah Driver",
      driverId: index % 2 === 0 ? 1 : 2,
      driverEmail: index % 2 === 0 ? "john@driver.com" : "sarah@driver.com",
      price: 25 + (index * 5),
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      deliveredAt: index < 2 ? new Date(Date.now() - index * 86400000).toISOString() : null,
      estimatedDelivery: new Date(Date.now() + (index + 1) * 86400000).toISOString(),
      currentLocation: null,
      receiptGenerated: false,
      priority: index % 2 === 0 ? "Normal" : "Express"
    }));
  };

  const loadNotifications = () => {
    const demoNotifications = [
      { id: 1, message: "New driver registration pending approval", time: "5 min ago", read: false, type: "warning" },
      { id: 2, message: "Delivery completed successfully 🎉", time: "1 hour ago", read: true, type: "success" },
      { id: 3, message: "Peak hour traffic expected", time: "2 hours ago", read: false, type: "info" },
      { id: 4, message: "Weekly report ready", time: "1 day ago", read: true, type: "success" }
    ];
    setNotifications(demoNotifications);
  };

  const updateDeliveryLocation = (deliveryId, location) => {
    const allDeliveries = JSON.parse(localStorage.getItem("cycle_deliveries") || "[]");
    const index = allDeliveries.findIndex(d => d.id === deliveryId);
    if (index !== -1) {
      allDeliveries[index].currentLocation = location;
      allDeliveries[index].locationUpdatedAt = new Date().toISOString();
      localStorage.setItem("cycle_deliveries", JSON.stringify(allDeliveries));
      loadData();
      toast.success(`📍 Location updated: ${location}`);
      setShowLocationModal(false);
      setCustomLocation("");
    }
  };

  const generateAndDownloadReceipt = async () => {
    if (selectedDelivery.receiptGenerated) {
      toast.error("Receipt has already been generated for this delivery.");
      setShowReceiptInfoModal(false);
      return;
    }

    if (!receiptInfo.pickupTime || !receiptInfo.estimatedDelivery || !receiptInfo.price || !receiptInfo.itemPrice || !receiptInfo.arrivalDate) {
      toast.error("Please fill in all receipt information fields");
      return;
    }
    
    if (!selectedDelivery) {
      toast.error("No delivery selected");
      return;
    }
    
    try {
      const newReceiptNumber = receiptCounter + 1;
      setReceiptCounter(newReceiptNumber);
      localStorage.setItem("receipt_counter", newReceiptNumber.toString());
      
      const receipt = {
        receiptId: `RCP-${newReceiptNumber}`,
        trackingId: selectedDelivery.trackingId,
        customerName: selectedDelivery.customerName,
        customerEmail: selectedDelivery.customerEmail,
        pickupAddress: selectedDelivery.pickupAddress,
        dropoffAddress: selectedDelivery.dropoffAddress,
        packageWeight: selectedDelivery.packageWeight,
        packageDescription: selectedDelivery.packageDescription,
        itemName: selectedDelivery.itemName,
        quantity: selectedDelivery.quantity,
        unitPrice: parseFloat(receiptInfo.itemPrice),
        price: parseFloat(receiptInfo.price),
        pickupTime: receiptInfo.pickupTime,
        estimatedDelivery: receiptInfo.estimatedDelivery,
        actualDelivery: receiptInfo.actualDelivery || receiptInfo.estimatedDelivery,
        arrivalDate: receiptInfo.arrivalDate,
        driverNote: receiptInfo.driverNote || "Package handled with care",
        driverName: selectedDelivery.driverName || "Assigned Driver",
        date: new Date().toISOString(),
        trackingUrl: `https://cycle.com/track/${selectedDelivery.trackingId}`
      };
      
      setReceiptData(receipt);
      setShowReceiptInfoModal(false);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      setShowReceiptModal(true);
      
      setTimeout(async () => {
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
            link.download = `Cycle_Receipt_${receipt.receiptId}.png`;
            link.href = imageUrl;
            link.click();
            toast.success(`Receipt ${receipt.receiptId} generated!`, { id: "receipt-gen" });
            
            const allDeliveries = JSON.parse(localStorage.getItem("cycle_deliveries") || "[]");
            const index = allDeliveries.findIndex(d => d.id === selectedDelivery.id);
            if (index !== -1) {
              allDeliveries[index].receipt = receipt;
              allDeliveries[index].receiptSent = true;
              allDeliveries[index].receiptGenerated = true;
              allDeliveries[index].status = "in_transit";
              localStorage.setItem("cycle_deliveries", JSON.stringify(allDeliveries));
            }
            loadData();
          } catch (error) {
            console.error('Error generating receipt:', error);
            toast.error('Failed to generate receipt.', { id: "receipt-gen" });
          }
        } else {
          toast.error('Receipt reference not found', { id: "receipt-gen" });
        }
      }, 500);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate receipt');
    }
  };

  const openReceiptModal = (delivery) => {
    if (delivery.receiptGenerated || delivery.receipt) {
      toast.error("Receipt already generated for this delivery.");
      return;
    }
    
    setSelectedDelivery(delivery);
    const now = new Date();
    const pickupTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const estimatedTime = new Date(now.getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const arrivalDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    setReceiptInfo({
      pickupTime: pickupTime,
      estimatedDelivery: estimatedTime,
      actualDelivery: "",
      arrivalDate: arrivalDate,
      price: delivery.price || 25,
      itemPrice: delivery.unitPrice || 25,
      driverNote: ""
    });
    setShowReceiptInfoModal(true);
  };

  const handleAssignDelivery = (deliveryId) => {
    if (!assignDriverName || !assignDriverEmail) {
      toast.error("Please fill in driver details");
      return;
    }
    
    const allDeliveries = JSON.parse(localStorage.getItem("cycle_deliveries") || "[]");
    const index = allDeliveries.findIndex(d => d.id === deliveryId);
    if (index !== -1) {
      allDeliveries[index].driverName = assignDriverName;
      allDeliveries[index].driverEmail = assignDriverEmail;
      allDeliveries[index].status = "assigned";
      localStorage.setItem("cycle_deliveries", JSON.stringify(allDeliveries));
      loadData();
      toast.success(`✅ ${assignDriverName} assigned to delivery!`);
      setShowAssignModal(false);
      setAssignDriverName("");
      setAssignDriverEmail("");
    }
  };

  const handleAddDriver = () => {
    if (!driverForm.name || !driverForm.email) {
      toast.error("Please fill in required fields");
      return;
    }
    
    const allUsers = JSON.parse(localStorage.getItem("cycle_users") || "[]");
    const newDriver = {
      id: Date.now(),
      uniqueId: "DRV-" + Date.now(),
      name: driverForm.name,
      email: driverForm.email,
      phone: "Private",
      address: driverForm.address || "N/A",
      password: "password123",
      userType: "driver",
      status: "active",
      vehicle: driverForm.vehicle || "Motorcycle",
      licensePlate: driverForm.licensePlate || "ABC-123",
      createdAt: new Date().toISOString(),
      deliveriesCompleted: 0,
      rating: 5.0
    };
    
    allUsers.push(newDriver);
    localStorage.setItem("cycle_users", JSON.stringify(allUsers));
    loadData();
    setShowDriverModal(false);
    setDriverForm({ name: "", email: "", vehicle: "", licensePlate: "", address: "" });
    toast.success(`🎉 ${driverForm.name} added successfully!`);
  };

  const handleDeleteDriver = (driverId) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      const allUsers = JSON.parse(localStorage.getItem("cycle_users") || "[]");
      const filtered = allUsers.filter(u => u.id !== driverId);
      localStorage.setItem("cycle_users", JSON.stringify(filtered));
      loadData();
      toast.success("Driver deleted successfully");
    }
  };

  const handleAddDelivery = () => {
    if (!deliveryForm.pickupAddress || !deliveryForm.dropoffAddress) {
      toast.error("Please fill in pickup and dropoff addresses");
      return;
    }
    
    const newTrackingId = `CYC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const totalPrice = (deliveryForm.quantity || 1) * (deliveryForm.unitPrice || 25);
    
    const newDelivery = {
      id: Date.now(),
      trackingId: newTrackingId,
      customerName: deliveryForm.customerName || "Walk-in Customer",
      customerEmail: deliveryForm.customerEmail || "customer@example.com",
      customerPhone: deliveryForm.customerPhone || "N/A",
      pickupAddress: deliveryForm.pickupAddress,
      dropoffAddress: deliveryForm.dropoffAddress,
      packageWeight: deliveryForm.packageWeight || "Standard",
      packageDescription: deliveryForm.packageDescription || "General package",
      itemName: deliveryForm.itemName || deliveryForm.packageDescription || "Package",
      quantity: deliveryForm.quantity || 1,
      unitPrice: deliveryForm.unitPrice || 25,
      status: "pending",
      driverName: "Unassigned",
      driverId: null,
      price: totalPrice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString(),
      currentLocation: null,
      receiptGenerated: false,
      priority: "Normal"
    };
    
    const allDeliveries = JSON.parse(localStorage.getItem("cycle_deliveries") || "[]");
    allDeliveries.push(newDelivery);
    localStorage.setItem("cycle_deliveries", JSON.stringify(allDeliveries));
    loadData();
    setShowDeliveryModal(false);
    setDeliveryForm({ customerName: "", customerEmail: "", customerPhone: "", pickupAddress: "", dropoffAddress: "", packageWeight: "", packageDescription: "", itemName: "", quantity: 1, unitPrice: 25 });
    toast.success(`📦 Delivery created! Tracking ID: ${newTrackingId}`);
  };

  const handleApproveDriver = (driverId) => {
    const allUsers = JSON.parse(localStorage.getItem("cycle_users") || "[]");
    const index = allUsers.findIndex(u => u.id === driverId);
    if (index !== -1) {
      allUsers[index].status = "active";
      localStorage.setItem("cycle_users", JSON.stringify(allUsers));
      loadData();
      toast.success(`✅ ${allUsers[index].name} approved!`);
    }
  };

  const updateDeliveryStatus = (deliveryId, newStatus, successMessage) => {
    const allDeliveries = JSON.parse(localStorage.getItem("cycle_deliveries") || "[]");
    const index = allDeliveries.findIndex(d => d.id === deliveryId);
    if (index !== -1) {
      allDeliveries[index].status = newStatus;
      allDeliveries[index].updatedAt = new Date().toISOString();
      if (newStatus === "delivered") {
        allDeliveries[index].deliveredAt = new Date().toISOString();
        setCelebratingDelivery(allDeliveries[index]);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
      }
      localStorage.setItem("cycle_deliveries", JSON.stringify(allDeliveries));
      loadData();
      toast.success(successMessage);
    }
  };

  const getFilteredDeliveries = () => {
    let filtered = [...deliveries];
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(d => d.status === statusFilter);
    }
    return filtered;
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

  const stats = {
    totalDrivers: drivers.length,
    pendingDrivers: pendingDrivers.length,
    totalCustomers: customers.length,
    totalDeliveries: deliveries.length,
    pendingDeliveries: deliveries.filter(d => d.status === "pending").length,
    inTransitDeliveries: deliveries.filter(d => ["assigned", "picked_up", "in_transit"].includes(d.status)).length,
    completedDeliveries: deliveries.filter(d => d.status === "delivered").length,
    revenue: deliveries.filter(d => d.status === "delivered").reduce((sum, d) => sum + (d.price || 25), 0)
  };

  // Get dice icon based on value
  const getDiceIcon = (value) => {
    const icons = {
      1: <Dice1 size={40} />,
      2: <Dice2 size={40} />,
      3: <Dice3 size={40} />,
      4: <Dice4 size={40} />,
      5: <Dice5 size={40} />,
      6: <Dice6 size={40} />
    };
    return icons[value] || <Dice1 size={40} />;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100'} flex`}>
      <Toaster position="top-right" />
      
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && celebratingDelivery && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[2000]"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-sm mx-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center"
              >
                <PartyPopper size={40} color="white" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">🎉 Delivery Completed! 🎉</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Package for {celebratingDelivery.customerName} has been successfully delivered!
              </p>
              <p className="text-sm text-gray-500">Tracking: {celebratingDelivery.trackingId}</p>
              <button 
                onClick={() => setShowCelebration(false)}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium"
              >
                Awesome! 🚀
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Button */}
      <button 
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all z-[90] md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Enhanced with more sections */}
      <div className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-all duration-300 z-[1000] overflow-y-auto shadow-2xl
        ${sidebarOpen ? 'w-[280px] translate-x-0' : '-translate-x-full md:translate-x-0 md:w-[70px]'} 
        md:w-[70px] hover:md:w-[280px] group/sidebar transition-all duration-300`}>
        
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 text-center overflow-hidden">
          <div className={`text-2xl font-bold mb-3 transition-all ${sidebarOpen ? 'block' : 'md:hidden group-hover/sidebar:block'}`}>
            🚚 CYCLE
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-2 flex items-center justify-center shadow-lg">
            <Shield size={24} color="white" />
          </div>
          <div className={`font-semibold text-xs transition-all ${sidebarOpen ? 'block' : 'md:hidden group-hover/sidebar:block'}`}>
            Admin Panel
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className={`mt-2 bg-transparent border-none cursor-pointer text-gray-800 dark:text-white hover:text-indigo-600 transition text-xs ${sidebarOpen ? 'block' : 'md:hidden group-hover/sidebar:block'}`}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
        
        {/* Main Navigation */}
        <div className="p-2 space-y-1">
          <div className={`text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2 ${sidebarOpen ? 'block' : 'md:hidden group-hover/sidebar:block'}`}>
            Main
          </div>
          {[
            { id: "overview", label: "Dashboard", icon: LayoutDashboard, color: "text-indigo-500", emoji: "📊" },
            { id: "drivers", label: "Drivers", icon: Truck, color: "text-blue-500", emoji: "🚚" },
            { id: "customers", label: "Customers", icon: Users, color: "text-green-500", emoji: "👥" },
            { id: "deliveries", label: "Deliveries", icon: Package, color: "text-purple-500", emoji: "📦" }
          ].map(item => {
            const IconComponent = item.icon;
            return (
              <div 
                key={item.id} 
                onClick={() => { setActiveTab(item.id); if (window.innerWidth < 768) setSidebarOpen(false); }} 
                className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200
                  ${activeTab === item.id 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <IconComponent size={18} className={`min-w-[18px] ${activeTab !== item.id ? item.color : ''}`} />
                <span className={`text-sm transition-all whitespace-nowrap ${sidebarOpen ? 'inline' : 'md:hidden group-hover/sidebar:inline'}`}>
                  {item.label}
                </span>
                {item.id === "drivers" && pendingDrivers.length > 0 && (
                  <span className={`ml-auto bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[9px] min-w-[18px] text-center ${sidebarOpen ? 'inline' : 'md:hidden group-hover/sidebar:inline'}`}>
                    {pendingDrivers.length}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Fun Zone Section */}
        <div className="p-2 mt-4 border-t border-gray-200 dark:border-gray-700">
          <div className={`text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2 ${sidebarOpen ? 'block' : 'md:hidden group-hover/sidebar:block'}`}>
            🎮 Fun Zone
          </div>
          
          {/* Dice Game */}
          <div className={`px-3 py-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 mb-2 ${sidebarOpen ? 'block' : 'md:hidden group-hover/sidebar:block'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Gamepad2 size={16} className="text-purple-500" />
              <span className="text-xs font-semibold">Dice Roller</span>
            </div>
            <div className="text-center">
              <div className="mb-2">
                {diceValue ? (
                  <motion.div
                    animate={diceRolling ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {getDiceIcon(diceValue)}
                  </motion.div>
                ) : (
                  <Dice1 size={40} className="opacity-50" />
                )}
              </div>
              <button
                onClick={rollDice}
                disabled={diceRolling}
                className="w-full text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white py-1 rounded-lg hover:shadow-lg transition disabled:opacity-50"
              >
                {diceRolling ? "Rolling..." : "Roll Dice! 🎲"}
              </button>
              {diceHistory.length > 0 && (
                <div className="mt-2 text-[10px] text-gray-500">
                  History: {diceHistory.join(", ")}
                </div>
              )}
            </div>
          </div>

          {/* Daily Mood */}
          <div className={`px-3 py-3 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 ${sidebarOpen ? 'block' : 'md:hidden group-hover/sidebar:block'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Smile size={16} className="text-green-500" />
              <span className="text-xs font-semibold">Daily Mood</span>
            </div>
            <div className="flex justify-around">
              <button onClick={() => setMood("😊")} className={`text-2xl hover:scale-110 transition ${mood === "😊" ? "opacity-100" : "opacity-40"}`}>😊</button>
              <button onClick={() => setMood("😎")} className={`text-2xl hover:scale-110 transition ${mood === "😎" ? "opacity-100" : "opacity-40"}`}>😎</button>
              <button onClick={() => setMood("🤔")} className={`text-2xl hover:scale-110 transition ${mood === "🤔" ? "opacity-100" : "opacity-40"}`}>🤔</button>
              <button onClick={() => setMood("🥳")} className={`text-2xl hover:scale-110 transition ${mood === "🥳" ? "opacity-100" : "opacity-40"}`}>🥳</button>
              <button onClick={() => setMood("😴")} className={`text-2xl hover:scale-110 transition ${mood === "😴" ? "opacity-100" : "opacity-40"}`}>😴</button>
            </div>
            <div className="text-center text-xs mt-2">Today's Mood: {mood}</div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="p-2 mt-4 border-t border-gray-200 dark:border-gray-700">
          <div className={`text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2 ${sidebarOpen ? 'block' : 'md:hidden group-hover/sidebar:block'}`}>
            📈 Analytics
          </div>
          {[
            { id: "analytics", label: "Performance", icon: TrendingUp, color: "text-emerald-500" },
            { id: "reports", label: "Reports", icon: FileText, color: "text-blue-500" },
            { id: "insights", label: "Insights", icon: Lightbulb, color: "text-yellow-500" }
          ].map(item => {
            const IconComponent = item.icon;
            return (
              <div 
                key={item.id} 
                className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800`}
              >
                <IconComponent size={18} className={`min-w-[18px] ${item.color}`} />
                <span className={`text-xs transition-all whitespace-nowrap ${sidebarOpen ? 'inline' : 'md:hidden group-hover/sidebar:inline'}`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Logout */}
        <div className={`absolute bottom-4 left-0 right-0 px-2 ${sidebarOpen ? 'block' : 'md:hidden group-hover/sidebar:block'}`}>
          <a href="/#/" className="flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition no-underline">
            <LogOut size={18} /> 
            <span className="text-sm whitespace-nowrap">Logout</span>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-[280px]' : 'ml-0 md:ml-[70px]'}`}>
        <div className="p-3 sm:p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {activeTab === "overview" && "📊 Dashboard Overview"}
                {activeTab === "drivers" && "🚚 Driver Management"}
                {activeTab === "customers" && "👥 Customer Management"}
                {activeTab === "deliveries" && "📦 Delivery Management"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Welcome back, Admin! {mood}</p>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <div className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'} shadow-sm`}>
                {currentTime.toLocaleTimeString()}
              </div>
              {(activeTab === "drivers" || activeTab === "deliveries") && (
                <button 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium flex items-center gap-1.5 hover:shadow-lg transition-all text-xs sm:text-sm"
                  onClick={() => activeTab === "drivers" ? setShowDriverModal(true) : setShowDeliveryModal(true)}
                >
                  <Plus size={14} className="sm:w-4 sm:h-4" /> 
                  <span className="hidden xs:inline">Add</span> {activeTab === "drivers" ? "Driver" : "Order"}
                </button>
              )}
            </div>
          </div>

          {/* Overview Tab - Enhanced with fun widgets */}
          {activeTab === "overview" && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <motion.div whileHover={{ scale: 1.02 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 sm:p-4 shadow-lg border-l-4 border-emerald-500`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <DollarSign size={16} className="sm:w-5 sm:h-5 text-emerald-500" />
                    </div>
                    <span className="text-[10px] sm:text-xs text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-full">+12%</span>
                  </div>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold">${stats.revenue}</div>
                  <div className="text-[10px] sm:text-xs text-gray-500">Total Revenue</div>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 sm:p-4 shadow-lg border-l-4 border-blue-500`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Truck size={16} className="sm:w-5 sm:h-5 text-blue-500" />
                    </div>
                    <span className="text-[10px] sm:text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">Active</span>
                  </div>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold">{stats.inTransitDeliveries}</div>
                  <div className="text-[10px] sm:text-xs text-gray-500">Active Deliveries</div>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 sm:p-4 shadow-lg border-l-4 border-purple-500`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Users size={16} className="sm:w-5 sm:h-5 text-purple-500" />
                    </div>
                    <span className="text-[10px] sm:text-xs text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded-full">Total</span>
                  </div>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold">{stats.totalDrivers}</div>
                  <div className="text-[10px] sm:text-xs text-gray-500">Active Drivers</div>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 sm:p-4 shadow-lg border-l-4 border-amber-500`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Target size={16} className="sm:w-5 sm:h-5 text-amber-500" />
                    </div>
                    <span className="text-[10px] sm:text-xs text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-full">Rate</span>
                  </div>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold">{stats.totalDeliveries > 0 ? Math.round((stats.completedDeliveries / stats.totalDeliveries) * 100) : 0}%</div>
                  <div className="text-[10px] sm:text-xs text-gray-500">Completion Rate</div>
                </motion.div>
              </div>

              {/* Fun Widgets Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Weather Widget */}
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-lg`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Cloud size={18} className="text-blue-500" />
                    <h3 className="font-semibold text-sm">Weather Update</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">{weather.temp}°F</div>
                      <div className="text-xs text-gray-500">{weather.condition}</div>
                    </div>
                    <div className="text-5xl">{weather.icon}</div>
                  </div>
                  <div className="flex justify-between mt-3 text-xs text-gray-500">
                    <span>💧 Humidity: {weather.humidity}%</span>
                    <span>💨 Wind: {weather.wind} mph</span>
                  </div>
                </div>

                {/* Daily Quote */}
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-lg`}>
                  <div className="flex items-center gap-2 mb-3">
                    <HeartIcon size={18} className="text-red-500" />
                    <h3 className="font-semibold text-sm">Daily Inspiration</h3>
                  </div>
                  <p className="text-sm italic">"{dailyQuote.quote}"</p>
                  <p className="text-xs text-gray-500 mt-2">— {dailyQuote.author}</p>
                  <button onClick={setRandomQuote} className="mt-2 text-xs text-indigo-500 hover:underline">New Quote ↻</button>
                </div>

                {/* Fun Fact */}
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-lg`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Brain size={18} className="text-purple-500" />
                    <h3 className="font-semibold text-sm">Did You Know?</h3>
                  </div>
                  <p className="text-sm">{funFact}</p>
                  <button onClick={setRandomFunFact} className="mt-2 text-xs text-indigo-500 hover:underline">New Fact ↻</button>
                </div>
              </div>

              {/* Joke of the Moment */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-lg mb-6`}>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare size={18} className="text-yellow-500" />
                  <h3 className="font-semibold text-sm">😂 Joke of the Moment</h3>
                </div>
                <p className="text-sm">{joke}</p>
                <button onClick={setRandomJoke} className="mt-2 text-xs text-indigo-500 hover:underline">Another Joke ↻</button>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 text-center shadow-md`}>
                  <div className="text-lg sm:text-xl font-bold text-blue-500">{quickStats.todayDeliveries}</div>
                  <div className="text-[10px] sm:text-xs text-gray-500">Today's Deliveries</div>
                </div>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 text-center shadow-md`}>
                  <div className="text-lg sm:text-xl font-bold text-green-500">${quickStats.weeklyRevenue}</div>
                  <div className="text-[10px] sm:text-xs text-gray-500">Weekly Revenue</div>
                </div>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 text-center shadow-md`}>
                  <div className="text-lg sm:text-xl font-bold text-purple-500">{quickStats.avgDeliveryTime}</div>
                  <div className="text-[10px] sm:text-xs text-gray-500">Avg Delivery Time</div>
                </div>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 text-center shadow-md`}>
                  <div className="text-lg sm:text-xl font-bold text-amber-500">{quickStats.customerSatisfaction}</div>
                  <div className="text-[10px] sm:text-xs text-gray-500">Satisfaction</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-4 shadow-lg`}>
                <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-indigo-500" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.map(activity => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-center gap-3 py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center`} style={{ background: activity.color + '20' }}>
                          <IconComponent size={16} color={activity.color} />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs sm:text-sm font-medium">{activity.user} {activity.action}</div>
                          <div className="text-[10px] sm:text-xs text-gray-500">{activity.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Drivers Tab */}
          {activeTab === "drivers" && (
            <>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 sm:p-4 mb-4 flex gap-3 flex-wrap shadow-md`}>
                <Search size={16} className="text-gray-500 mt-2" />
                <input 
                  type="text" 
                  placeholder="Search drivers..." 
                  className={`flex-1 min-w-[150px] px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-900'} outline-none focus:border-indigo-500 text-sm`}
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
              
              {pendingDrivers.length > 0 && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-auto border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-4`}>
                  <div className="px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200">
                    <h3 className="text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-400">⏳ Pending Approval ({pendingDrivers.length})</h3>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {pendingDrivers.map(driver => (
                      <div key={driver.id} className="p-3 flex justify-between items-center flex-wrap gap-2">
                        <div>
                          <div className="font-semibold text-sm">{driver.name}</div>
                          <div className="text-xs text-gray-500">{driver.email}</div>
                        </div>
                        <button className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-emerald-600 transition" onClick={() => handleApproveDriver(driver.id)}>
                          Approve ✓
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-lg`}>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {drivers.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase())).map(driver => (
                    <div key={driver.id} className="p-3 sm:p-4">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div className="flex-1">
                          <div className="font-semibold text-sm sm:text-base">{driver.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{driver.email}</div>
                          <div className="text-xs text-gray-400 mt-1">🚗 {driver.vehicle || 'Motorcycle'} • 📋 {driver.uniqueId}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-amber-500">⭐ {driver.rating || 4.8}</span>
                            <span className="text-xs text-gray-400">📦 {driver.deliveriesCompleted || 0} deliveries</span>
                          </div>
                        </div>
                        <button className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium hover:bg-red-600 transition" onClick={() => handleDeleteDriver(driver.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Customers Tab */}
          {activeTab === "customers" && (
            <>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 sm:p-4 mb-4 flex gap-3 flex-wrap shadow-md`}>
                <Search size={16} className="text-gray-500 mt-2" />
                <input 
                  type="text" 
                  placeholder="Search customers..." 
                  className={`flex-1 min-w-[150px] px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-900'} outline-none focus:border-indigo-500 text-sm`}
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
              
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-lg`}>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {customers.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(customer => (
                    <div key={customer.id} className="p-3 sm:p-4">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div className="flex-1">
                          <div className="font-semibold text-sm sm:text-base">{customer.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{customer.email}</div>
                          <div className="text-xs text-gray-400 mt-1">📦 Orders: {deliveries.filter(d => d.customerName === customer.name).length}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-indigo-600">${deliveries.filter(d => d.customerName === customer.name).reduce((sum, d) => sum + (d.price || 25), 0)}</div>
                          <div className="text-[10px] text-gray-500">Total Spent</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Deliveries Tab */}
          {activeTab === "deliveries" && (
            <>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 sm:p-4 mb-4 flex flex-col sm:flex-row gap-3 shadow-md`}>
                <div className="flex items-center gap-2 flex-1">
                  <Search size={16} className="text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search by tracking ID..." 
                    className={`flex-1 px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-900'} outline-none focus:border-indigo-500 text-sm`}
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                  />
                </div>
                <select 
                  className={`px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-900'} outline-none focus:border-indigo-500 text-sm w-full sm:w-32`}
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              
              <div className="space-y-3">
                {getFilteredDeliveries().map(delivery => {
                  const badge = getStatusBadge(delivery.status);
                  const IconComponent = badge.icon;
                  const hasReceipt = delivery.receiptGenerated || delivery.receipt;
                  return (
                    <motion.div 
                      key={delivery.id} 
                      whileHover={{ scale: 1.01 }}
                      className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3 sm:p-4 shadow-lg border-l-4 ${delivery.priority === 'Express' ? 'border-red-500' : 'border-indigo-500'}`}
                    >
                      <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                        <div>
                          <div className="font-mono text-xs sm:text-sm font-bold">{delivery.trackingId}</div>
                          <div className="text-xs text-gray-500 mt-1">{delivery.customerName}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium ${badge.bg} ${badge.color}`}>
                          <IconComponent size={10} className="inline mr-1" />{badge.text}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-blue-500" />
                          <span className="truncate">{delivery.pickupAddress?.substring(0, 25)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <LocateFixed size={12} className="text-purple-500" />
                          <span className="truncate">{delivery.dropoffAddress?.substring(0, 25)}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-sm font-bold text-indigo-600">${delivery.price}</div>
                        <div className="flex gap-2">
                          {delivery.status === 'pending' && (
                            <button className="bg-indigo-600 text-white px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium hover:bg-indigo-700 transition" onClick={() => { setSelectedDelivery(delivery); setShowAssignModal(true); }}>Assign</button>
                          )}
                          {delivery.status === 'assigned' && (
                            <button className="bg-amber-500 text-white px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium hover:bg-amber-600 transition" onClick={() => updateDeliveryStatus(delivery.id, "picked_up", "📦 Marked as Picked Up")}>Pick Up</button>
                          )}
                          {delivery.status === 'picked_up' && (
                            <button className="bg-amber-500 text-white px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium hover:bg-amber-600 transition" onClick={() => updateDeliveryStatus(delivery.id, "in_transit", "🚚 Now In Transit")}>Start Transit</button>
                          )}
                          {delivery.status === 'in_transit' && (
                            <div className="flex gap-1">
                              <button 
                                className={`${hasReceipt ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600'} text-white px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium transition`} 
                                onClick={() => !hasReceipt && openReceiptModal(delivery)}
                                disabled={hasReceipt}
                              >
                                {hasReceipt ? '✓ Receipt' : 'Receipt'}
                              </button>
                              <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium hover:border-indigo-500 transition" onClick={() => { setSelectedDelivery(delivery); setShowLocationModal(true); }}>
                                <MapPin size={12} className="inline" />
                              </button>
                            </div>
                          )}
                          {delivery.status === 'delivered' && (
                            <button className="bg-emerald-500 text-white px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium" disabled>
                              ✓ Delivered
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {getFilteredDeliveries().length === 0 && (
                  <div className="text-center py-12">
                    <Package size={48} className="mx-auto opacity-30 mb-3" />
                    <p className="text-gray-500">No deliveries found</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Driver Modal */}
      <AnimatePresence>
        {showDriverModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1100] p-4" onClick={() => setShowDriverModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto m-4`} onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700"><h3 className="text-lg font-bold">Add New Driver</h3></div>
              <div className="p-4 space-y-3">
                <input type="text" placeholder="Full Name" value={driverForm.name} onChange={(e) => setDriverForm({...driverForm, name: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 text-sm`} />
                <input type="email" placeholder="Email" value={driverForm.email} onChange={(e) => setDriverForm({...driverForm, email: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 text-sm`} />
                <input type="text" placeholder="Vehicle Type" value={driverForm.vehicle} onChange={(e) => setDriverForm({...driverForm, vehicle: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 text-sm`} />
                <input type="text" placeholder="License Plate" value={driverForm.licensePlate} onChange={(e) => setDriverForm({...driverForm, licensePlate: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 text-sm`} />
              </div>
              <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition text-sm" onClick={() => setShowDriverModal(false)}>Cancel</button>
                <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition text-sm" onClick={handleAddDriver}>Add Driver</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Delivery Modal */}
      <AnimatePresence>
        {showDeliveryModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1100] p-4" onClick={() => setShowDeliveryModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto m-4`} onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700"><h3 className="text-lg font-bold">Create Order</h3></div>
              <div className="p-4 space-y-3">
                <input type="text" placeholder="Customer Name" value={deliveryForm.customerName} onChange={(e) => setDeliveryForm({...deliveryForm, customerName: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 text-sm`} />
                <input type="email" placeholder="Customer Email" value={deliveryForm.customerEmail} onChange={(e) => setDeliveryForm({...deliveryForm, customerEmail: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 text-sm`} />
                <input type="text" placeholder="Item Name" value={deliveryForm.itemName} onChange={(e) => setDeliveryForm({...deliveryForm, itemName: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 text-sm`} />
                <div className="flex gap-2">
                  <input type="number" placeholder="Qty" value={deliveryForm.quantity} onChange={(e) => setDeliveryForm({...deliveryForm, quantity: parseInt(e.target.value) || 1})} className={`flex-1 px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 text-sm`} />
                  <input type="number" placeholder="Unit Price" value={deliveryForm.unitPrice} onChange={(e) => setDeliveryForm({...deliveryForm, unitPrice: parseInt(e.target.value) || 25})} className={`flex-1 px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 text-sm`} />
                </div>
                <input type="text" placeholder="Pickup Address" value={deliveryForm.pickupAddress} onChange={(e) => setDeliveryForm({...deliveryForm, pickupAddress: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 text-sm`} />
                <input type="text" placeholder="Dropoff Address" value={deliveryForm.dropoffAddress} onChange={(e) => setDeliveryForm({...deliveryForm, dropoffAddress: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 text-sm`} />
              </div>
              <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition text-sm" onClick={() => setShowDeliveryModal(false)}>Cancel</button>
                <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition text-sm" onClick={handleAddDelivery}>Create Order</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assign Modal */}
      <AnimatePresence>
        {showAssignModal && selectedDelivery && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1100] p-4" onClick={() => setShowAssignModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto m-4`} onClick={(e) => e.stopPropagation()}>
              <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl"><h3 className="text-lg font-bold">Assign Driver</h3></div>
              <div className="p-4 space-y-3">
                <input type="text" placeholder="Driver Name" value={assignDriverName} onChange={(e) => setAssignDriverName(e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 text-sm`} />
                <input type="email" placeholder="Driver Email" value={assignDriverEmail} onChange={(e) => setAssignDriverEmail(e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 text-sm`} />
              </div>
              <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition text-sm" onClick={() => setShowAssignModal(false)}>Cancel</button>
                <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition text-sm" onClick={() => handleAssignDelivery(selectedDelivery.id)}>Assign Driver</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Receipt Info Modal */}
      <AnimatePresence>
        {showReceiptInfoModal && selectedDelivery && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1100] p-4" onClick={() => setShowReceiptInfoModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto m-4`} onClick={(e) => e.stopPropagation()}>
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-t-2xl"><h3 className="text-lg font-bold">Receipt Information</h3></div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="block mb-1 font-medium text-sm">Pickup Time *</label>
                  <input type="time" value={receiptInfo.pickupTime} onChange={(e) => setReceiptInfo({...receiptInfo, pickupTime: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 text-sm`} />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sm">Estimated Delivery *</label>
                  <input type="time" value={receiptInfo.estimatedDelivery} onChange={(e) => setReceiptInfo({...receiptInfo, estimatedDelivery: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 text-sm`} />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sm">Arrival Date *</label>
                  <input type="date" value={receiptInfo.arrivalDate} onChange={(e) => setReceiptInfo({...receiptInfo, arrivalDate: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 text-sm`} />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sm">Item Price (per unit) *</label>
                  <input type="number" placeholder="Amount" value={receiptInfo.itemPrice} onChange={(e) => setReceiptInfo({...receiptInfo, itemPrice: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 text-sm`} />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sm">Total Price *</label>
                  <input type="number" placeholder="Amount" value={receiptInfo.price} onChange={(e) => setReceiptInfo({...receiptInfo, price: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 text-sm`} />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sm">Driver Note</label>
                  <textarea rows="2" value={receiptInfo.driverNote} onChange={(e) => setReceiptInfo({...receiptInfo, driverNote: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 resize-vertical text-sm`} />
                </div>
              </div>
              <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition text-sm" onClick={() => setShowReceiptInfoModal(false)}>Cancel</button>
                <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition text-sm" onClick={generateAndDownloadReceipt}>Generate Receipt</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Location Modal */}
      <AnimatePresence>
        {showLocationModal && selectedDelivery && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1100] p-4" onClick={() => setShowLocationModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto m-4`} onClick={(e) => e.stopPropagation()}>
              <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-t-2xl"><h3 className="text-lg font-bold">Update Package Location</h3></div>
              <div className="p-4">
                <textarea placeholder="Enter current location..." value={customLocation} onChange={(e) => setCustomLocation(e.target.value)} rows="4" className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 resize-vertical text-sm`} />
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-800 dark:text-blue-300">
                  📍 This location will be visible to the customer in real-time
                </div>
                {selectedDelivery.currentLocation && (
                  <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-xs text-emerald-800 dark:text-emerald-300">
                    Current: {selectedDelivery.currentLocation}
                  </div>
                )}
              </div>
              <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition text-sm" onClick={() => setShowLocationModal(false)}>Cancel</button>
                <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition text-sm disabled:opacity-50" onClick={() => updateDeliveryLocation(selectedDelivery.id, customLocation)} disabled={!customLocation.trim()}>Update Location</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceiptModal && receiptData && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1100] p-4" onClick={() => setShowReceiptModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto m-4`} onClick={(e) => e.stopPropagation()}>
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-t-2xl"><h3 className="text-lg font-bold">🎉 Receipt Generated!</h3></div>
              <div className="p-6 text-center">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl">
                  <CheckCircle size={48} className="text-emerald-500 mx-auto" />
                  <p className="mt-4 font-medium">Receipt {receiptData.receiptId} Downloaded!</p>
                  <p className="text-xs text-gray-500 mt-2">Check your downloads folder for the PNG image.</p>
                </div>
              </div>
              <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                <button className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition text-sm font-medium" onClick={() => setShowReceiptModal(false)}>Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden Receipt Template */}
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
          {receiptData && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #000000', paddingBottom: '10px' }}>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#000000' }}>CYCLE LOGISTICS</div>
                <div style={{ fontSize: '9px', color: '#333333' }}>Global Delivery Services</div>
                <div style={{ fontSize: '8px', color: '#666666' }}>cycle@gmail.com</div>
              </div>
              
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', background: '#f0f0f0', display: 'inline-block', padding: '4px 12px', borderRadius: '4px', color: '#000000' }}>OFFICIAL DELIVERY RECEIPT</div>
                <div style={{ fontSize: '9px', marginTop: '5px', color: '#333333' }}>Receipt #{receiptData.receiptId}</div>
              </div>
              
              <div style={{ marginBottom: '15px', borderBottom: '1px dotted #999999', paddingBottom: '10px' }}>
                <div style={{ color: '#000000' }}><strong>DATE:</strong> {new Date(receiptData.date).toLocaleString()}</div>
                <div style={{ color: '#000000' }}><strong>TRACKING ID:</strong> {receiptData.trackingId}</div>
                <div style={{ color: '#000000' }}><strong>CUSTOMER:</strong> {receiptData.customerName}</div>
                <div style={{ color: '#000000' }}><strong>EMAIL:</strong> {receiptData.customerEmail}</div>
              </div>
              
              <div style={{ marginBottom: '15px', borderBottom: '1px dotted #999999', paddingBottom: '10px', background: '#f9fafb', padding: '10px', borderRadius: '6px' }}>
                <div style={{ color: '#000000' }}>🕐 <strong>PICKUP TIME:</strong> {receiptData.pickupTime}</div>
                <div style={{ color: '#000000' }}>⏰ <strong>ESTIMATED DELIVERY:</strong> {receiptData.estimatedDelivery}</div>
                <div style={{ color: '#000000' }}>📅 <strong>ARRIVAL DATE:</strong> {receiptData.arrivalDate}</div>
                {receiptData.actualDelivery && <div style={{ color: '#000000' }}>✅ <strong>ACTUAL DELIVERY:</strong> {receiptData.actualDelivery}</div>}
              </div>
              
              <div style={{ marginBottom: '15px', borderBottom: '1px dotted #999999', paddingBottom: '10px' }}>
                <div style={{ color: '#000000' }}><strong>📍 PICKUP ADDRESS:</strong></div>
                <div style={{ marginLeft: '8px', marginBottom: '8px', color: '#333333' }}>{receiptData.pickupAddress || 'N/A'}</div>
                <div style={{ color: '#000000' }}><strong>🏠 DROP OFF ADDRESS:</strong></div>
                <div style={{ marginLeft: '8px', color: '#333333' }}>{receiptData.dropoffAddress || 'N/A'}</div>
              </div>
              
              <div style={{ marginBottom: '15px', borderBottom: '1px solid #000000', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #000000', marginBottom: '8px', paddingBottom: '4px', fontWeight: 'bold', color: '#000000' }}>
                  <span>ITEM</span><span>QTY</span><span>UNIT</span><span>TOTAL</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#000000' }}>
                  <span>{receiptData.itemName}</span><span>{receiptData.quantity}</span><span>${receiptData.unitPrice}</span><span>${(receiptData.quantity * receiptData.unitPrice).toFixed(2)}</span>
                </div>
                <div style={{ borderTop: '1px dashed #cccccc', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#000000' }}>
                  <span>GRAND TOTAL</span><span>${receiptData.price}.00</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <div style={{ color: '#000000' }}><strong>🚚 DRIVER:</strong> {receiptData.driverName}</div>
                {receiptData.driverNote && <div style={{ color: '#000000' }}><strong>📝 NOTE:</strong> {receiptData.driverNote}</div>}
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
          )}
        </div>
      </div>

      <style>{`
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
        @media (max-width: 480px) {
          .xs\\:inline {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;