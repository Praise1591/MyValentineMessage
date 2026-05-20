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
  LocateFixed, Navigation2, Route as RouteIcon
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

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadData();
    loadNotifications();
    generateMockData();
  }, []);

  const generateMockData = () => {
    setRecentActivity([
      { id: 1, type: "delivery", action: "created", user: "John Smith", time: "5 min ago", icon: Package, color: "#10b981" },
      { id: 2, type: "driver", action: "approved", user: "Mike Driver", time: "1 hour ago", icon: UserCheck, color: "#3b82f6" },
      { id: 3, type: "delivery", action: "completed", user: "Sarah Johnson", time: "2 hours ago", icon: CheckCircle, color: "#10b981" }
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
    
    setLoading(false);
  };

  const generateDemoDeliveries = () => {
    const customersList = ["John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis"];
    const customerEmails = ["john@example.com", "sarah@example.com", "michael@example.com", "emily@example.com"];
    const addresses = [
      "123 Main St, Downtown, NY 10001",
      "456 Oak Ave, Uptown, NY 10002",
      "789 Pine St, Westside, NY 10003",
      "321 Elm Blvd, Eastside, NY 10004"
    ];
    const statuses = ["pending", "assigned", "picked_up", "in_transit", "delivered"];
    const weights = ["Light", "Medium", "Heavy"];
    const items = ["Smartphone", "Laptop", "Books", "Clothing"];
    
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
      currentLocation: null
    }));
  };

  const loadNotifications = () => {
    const demoNotifications = [
      { id: 1, message: "New driver registration pending approval", time: "5 min ago", read: false, type: "warning" },
      { id: 2, message: "Delivery completed successfully", time: "1 hour ago", read: true, type: "success" }
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
    if (!receiptInfo.pickupTime || !receiptInfo.estimatedDelivery || !receiptInfo.price || !receiptInfo.itemPrice || !receiptInfo.arrivalDate) {
      toast.error("Please fill in all receipt information");
      return;
    }
    
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
      unitPrice: receiptInfo.itemPrice,
      price: receiptInfo.price,
      pickupTime: receiptInfo.pickupTime,
      estimatedDelivery: receiptInfo.estimatedDelivery,
      actualDelivery: receiptInfo.actualDelivery || receiptInfo.estimatedDelivery,
      arrivalDate: receiptInfo.arrivalDate,
      driverNote: receiptInfo.driverNote || "Package handled with care",
      driverName: selectedDelivery.driverName,
      date: new Date().toISOString(),
      trackingUrl: `https://cycle.com/track/${selectedDelivery.trackingId}`
    };
    
    setReceiptData(receipt);
    setShowReceiptInfoModal(false);
    setShowReceiptModal(true);
    
    setTimeout(async () => {
      if (receiptRef.current) {
        try {
          const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: '#ffffff' });
          const imageUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `Cycle_Receipt_${receipt.receiptId}.png`;
          link.href = imageUrl;
          link.click();
          toast.success(`Receipt ${receipt.receiptId} generated!`);
          
          const allDeliveries = JSON.parse(localStorage.getItem("cycle_deliveries") || "[]");
          const index = allDeliveries.findIndex(d => d.id === selectedDelivery.id);
          if (index !== -1) {
            allDeliveries[index].receipt = receipt;
            allDeliveries[index].receiptSent = true;
            allDeliveries[index].status = "in_transit";
            localStorage.setItem("cycle_deliveries", JSON.stringify(allDeliveries));
          }
          loadData();
        } catch (error) {
          toast.error('Failed to generate receipt');
        }
      }
    }, 500);
  };

  const openReceiptModal = (delivery) => {
    setSelectedDelivery(delivery);
    setReceiptInfo({
      pickupTime: new Date().toLocaleTimeString(),
      estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleTimeString(),
      actualDelivery: "",
      arrivalDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
      toast.success(`${assignDriverName} assigned to delivery!`);
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
      vehicle: driverForm.vehicle,
      licensePlate: driverForm.licensePlate,
      createdAt: new Date().toISOString(),
      deliveriesCompleted: 0,
      rating: 5.0
    };
    
    allUsers.push(newDriver);
    localStorage.setItem("cycle_users", JSON.stringify(allUsers));
    loadData();
    setShowDriverModal(false);
    setDriverForm({ name: "", email: "", vehicle: "", licensePlate: "", address: "" });
    toast.success(`${driverForm.name} added successfully!`);
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
      itemName: deliveryForm.itemName || deliveryForm.packageDescription,
      quantity: deliveryForm.quantity || 1,
      unitPrice: deliveryForm.unitPrice || 25,
      status: "pending",
      driverName: "Unassigned",
      driverId: null,
      price: totalPrice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString(),
      currentLocation: null
    };
    
    const allDeliveries = JSON.parse(localStorage.getItem("cycle_deliveries") || "[]");
    allDeliveries.push(newDelivery);
    localStorage.setItem("cycle_deliveries", JSON.stringify(allDeliveries));
    loadData();
    setShowDeliveryModal(false);
    setDeliveryForm({ customerName: "", customerEmail: "", customerPhone: "", pickupAddress: "", dropoffAddress: "", packageWeight: "", packageDescription: "", itemName: "", quantity: 1, unitPrice: 25 });
    toast.success(`Delivery created! Tracking ID: ${newTrackingId}`);
  };

  const handleApproveDriver = (driverId) => {
    const allUsers = JSON.parse(localStorage.getItem("cycle_users") || "[]");
    const index = allUsers.findIndex(u => u.id === driverId);
    if (index !== -1) {
      allUsers[index].status = "active";
      localStorage.setItem("cycle_users", JSON.stringify(allUsers));
      loadData();
      toast.success(`${allUsers[index].name} approved!`);
    }
  };

  const updateDeliveryStatus = (deliveryId, newStatus, successMessage) => {
    const allDeliveries = JSON.parse(localStorage.getItem("cycle_deliveries") || "[]");
    const index = allDeliveries.findIndex(d => d.id === deliveryId);
    if (index !== -1) {
      allDeliveries[index].status = newStatus;
      allDeliveries[index].updatedAt = new Date().toISOString();
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

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'} flex`}>
      <Toaster position="top-right" />
      
      {/* Floating Menu Button */}
      <button 
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-600 text-white border-none cursor-pointer flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all z-[90]"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-all duration-300 z-[1000] overflow-y-auto shadow-lg ${sidebarOpen ? 'w-[280px]' : 'w-0'} ${sidebarOpen ? 'opacity-100' : 'opacity-0'} overflow-hidden`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold mb-5">🚚 CYCLE</div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-4 flex items-center justify-center">
            <Shield size={40} color="white" />
          </div>
          <div className="font-semibold">Administrator</div>
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="mt-3 bg-transparent border-none cursor-pointer text-gray-800 dark:text-white hover:text-indigo-600 transition"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
        
        <div className="p-4">
          {[
            { id: "overview", label: "Dashboard", icon: LayoutDashboard },
            { id: "drivers", label: "Drivers", icon: Truck },
            { id: "customers", label: "Customers", icon: Users },
            { id: "deliveries", label: "Deliveries", icon: Package }
          ].map(item => {
            const IconComponent = item.icon;
            return (
              <div 
                key={item.id} 
                onClick={() => { setActiveTab(item.id); if (window.innerWidth < 768) setSidebarOpen(false); }} 
                className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-xl cursor-pointer transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <IconComponent size={20} />
                <span>{item.label}</span>
                {item.id === "drivers" && pendingDrivers.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px]">{pendingDrivers.length}</span>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Updated Logout link with base URL */}
        <div className="absolute bottom-5 left-5 right-5">
          <a href="/MyValentineMessage" className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition no-underline">
            <LogOut size={20} /> Logout
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-[280px]' : 'ml-0'}`}>
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {activeTab === "overview" && "Dashboard"}
            {activeTab === "drivers" && "Drivers"}
            {activeTab === "customers" && "Customers"}
            {activeTab === "deliveries" && "Deliveries"}
          </h1>
          <div className="flex gap-3 items-center">
            <div className={`px-4 py-2 rounded-full text-sm ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'} shadow-sm`}>
              {currentTime.toLocaleTimeString()}
            </div>
            {(activeTab === "drivers" || activeTab === "deliveries") && (
              <button 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-1.5 hover:bg-indigo-700 transition"
                onClick={() => activeTab === "drivers" ? setShowDriverModal(true) : setShowDeliveryModal(true)}
              >
                <Plus size={16} /> Add {activeTab === "drivers" ? "Driver" : "Order"}
              </button>
            )}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <DollarSign size={24} className="text-emerald-500" />
                  </div>
                  <span className="text-xs text-emerald-500">+12%</span>
                </div>
                <div className="text-3xl font-bold mb-1">${stats.revenue}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</div>
              </div>
              
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Truck size={24} className="text-indigo-500" />
                  </div>
                  <span className="text-xs text-emerald-500">+5%</span>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.inTransitDeliveries}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Active Deliveries</div>
              </div>
              
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Users size={24} className="text-purple-500" />
                  </div>
                  <span className="text-xs text-emerald-500">+2</span>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.totalDrivers}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Drivers</div>
              </div>
              
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Target size={24} className="text-amber-500" />
                  </div>
                  <span className="text-xs text-emerald-500">+8%</span>
                </div>
                <div className="text-3xl font-bold mb-1">{stats.totalDeliveries > 0 ? Math.round((stats.completedDeliveries / stats.totalDeliveries) * 100) : 0}%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className="text-base font-semibold mb-5">Recent Activity</h3>
                {recentActivity.map(activity => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center gap-3 py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center`} style={{ background: activity.color + '20' }}>
                        <IconComponent size={16} color={activity.color} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">{activity.user} {activity.action}</div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
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
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 mb-6 flex gap-4 flex-wrap border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <Search size={18} className="text-gray-500 mt-2.5" />
              <input 
                type="text" 
                placeholder="Search drivers..." 
                className={`flex-1 px-4 py-2.5 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white text-gray-900'} outline-none focus:border-indigo-500 text-sm`}
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            
            {pendingDrivers.length > 0 && (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-auto border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
                <div className="px-5 py-4 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
                  <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400">Pending Approval ({pendingDrivers.length})</h3>
                </div>
                <table className="w-full border-collapse min-w-[800px]">
                  <thead>
                    <tr>
                      <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Name</th>
                      <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Email</th>
                      <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Registered</th>
                      <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingDrivers.map(driver => (
                      <tr key={driver.id}>
                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm font-medium">{driver.name}</td>
                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">{driver.email}</td>
                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">{new Date(driver.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                          <button className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-600 transition" onClick={() => handleApproveDriver(driver.id)}>Approve</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-auto border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr>
                    <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Driver</th>
                    <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Email</th>
                    <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Vehicle</th>
                    <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Rating</th>
                    <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase())).map(driver => (
                    <tr key={driver.id}>
                      <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="font-semibold text-sm">{driver.name}</div>
                        <div className="text-xs text-gray-500">ID: {driver.uniqueId}</div>
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">{driver.email}</td>
                      <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">{driver.vehicle || 'Motorcycle'} · {driver.licensePlate}</td>
                      <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">
                        <Star size={14} className="inline text-amber-500 mr-1" />{driver.rating || 4.8}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                        <button className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-600 transition" onClick={() => handleDeleteDriver(driver.id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Customers Tab */}
        {activeTab === "customers" && (
          <>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 mb-6 flex gap-4 flex-wrap border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <Search size={18} className="text-gray-500 mt-2.5" />
              <input 
                type="text" 
                placeholder="Search customers..." 
                className={`flex-1 px-4 py-2.5 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white text-gray-900'} outline-none focus:border-indigo-500 text-sm`}
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-auto border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr>
                    <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Customer</th>
                    <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Email</th>
                    <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Address</th>
                    <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Orders</th>
                    <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(customer => (
                    <tr key={customer.id}>
                      <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm font-semibold">{customer.name}</td>
                      <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">{customer.email}</td>
                      <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">{customer.address?.substring(0, 50)}...</td>
                      <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">{deliveries.filter(d => d.customerName === customer.name).length}</td>
                      <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">${deliveries.filter(d => d.customerName === customer.name).reduce((sum, d) => sum + (d.price || 25), 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Deliveries Tab */}
        {activeTab === "deliveries" && (
          <>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 mb-6 flex gap-4 flex-wrap border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <Search size={18} className="text-gray-500 mt-2.5" />
              <input 
                type="text" 
                placeholder="Search by tracking ID..." 
                className={`flex-1 px-4 py-2.5 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white text-gray-900'} outline-none focus:border-indigo-500 text-sm`}
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
              <select 
                className={`px-4 py-2.5 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white text-gray-900'} outline-none focus:border-indigo-500 text-sm`}
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
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-auto border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <table className="w-full border-collapse min-w-[1000px]">
                <thead>
                  <tr>
                    <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Tracking ID</th>
                    <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Customer</th>
                    <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Item</th>
                    <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Status</th>
                    <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Driver</th>
                    <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Amount</th>
                    <th className="text-left px-5 py-4 bg-gray-50 dark:bg-gray-900 font-semibold text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredDeliveries().map(delivery => {
                    const badge = getStatusBadge(delivery.status);
                    const IconComponent = badge.icon;
                    return (
                      <tr key={delivery.id}>
                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm font-mono font-semibold">{delivery.trackingId}</td>
                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">{delivery.customerName}</td>
                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">{delivery.itemName}</td>
                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                          <span className={`px-3 py-1 rounded-full text-xs ${badge.bg} ${badge.color}`}>
                            <IconComponent size={12} className="inline mr-1" />{badge.text}
                          </span>
                        </td>
                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">{delivery.driverName || '—'}</td>
                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 text-sm">${delivery.price}</td>
                        <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex gap-2 flex-wrap">
                            {delivery.status === 'pending' && (
                              <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-700 transition" onClick={() => { setSelectedDelivery(delivery); setShowAssignModal(true); }}>Assign</button>
                            )}
                            {delivery.status === 'assigned' && (
                              <button className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-600 transition" onClick={() => updateDeliveryStatus(delivery.id, "picked_up", "Marked as Picked Up")}>Pick Up</button>
                            )}
                            {delivery.status === 'picked_up' && (
                              <button className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-600 transition" onClick={() => updateDeliveryStatus(delivery.id, "in_transit", "Now In Transit")}>Start Transit</button>
                            )}
                            {delivery.status === 'in_transit' && (
                              <>
                                <button className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-600 transition" onClick={() => openReceiptModal(delivery)}>Receipt</button>
                                <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:border-indigo-500 transition" onClick={() => { setSelectedDelivery(delivery); setShowLocationModal(true); }}>
                                  <MapPin size={12} className="inline mr-1" />Set Location
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add Driver Modal */}
      <AnimatePresence>
        {showDriverModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1100] p-5" onClick={() => setShowDriverModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto`} onClick={(e) => e.stopPropagation()}>
              <div className="p-5 border-b border-gray-200 dark:border-gray-700"><h3 className="text-lg font-bold">Add New Driver</h3></div>
              <div className="p-5">
                <input type="text" placeholder="Full Name" value={driverForm.name} onChange={(e) => setDriverForm({...driverForm, name: e.target.value})} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 mb-3`} />
                <input type="email" placeholder="Email" value={driverForm.email} onChange={(e) => setDriverForm({...driverForm, email: e.target.value})} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 mb-3`} />
                <input type="text" placeholder="Vehicle Type" value={driverForm.vehicle} onChange={(e) => setDriverForm({...driverForm, vehicle: e.target.value})} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 mb-3`} />
                <input type="text" placeholder="License Plate" value={driverForm.licensePlate} onChange={(e) => setDriverForm({...driverForm, licensePlate: e.target.value})} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500`} />
              </div>
              <div className="p-5 pt-0 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition" onClick={() => setShowDriverModal(false)}>Cancel</button>
                <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition" onClick={handleAddDriver}>Add Driver</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Delivery Modal */}
      <AnimatePresence>
        {showDeliveryModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1100] p-5" onClick={() => setShowDeliveryModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto`} onClick={(e) => e.stopPropagation()}>
              <div className="p-5 border-b border-gray-200 dark:border-gray-700"><h3 className="text-lg font-bold">Create Order</h3></div>
              <div className="p-5">
                <input type="text" placeholder="Customer Name" value={deliveryForm.customerName} onChange={(e) => setDeliveryForm({...deliveryForm, customerName: e.target.value})} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 mb-3`} />
                <input type="email" placeholder="Customer Email" value={deliveryForm.customerEmail} onChange={(e) => setDeliveryForm({...deliveryForm, customerEmail: e.target.value})} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 mb-3`} />
                <input type="text" placeholder="Item Name" value={deliveryForm.itemName} onChange={(e) => setDeliveryForm({...deliveryForm, itemName: e.target.value})} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 mb-3`} />
                <div className="flex gap-3 mb-3">
                  <input type="number" placeholder="Qty" value={deliveryForm.quantity} onChange={(e) => setDeliveryForm({...deliveryForm, quantity: parseInt(e.target.value) || 1})} className={`flex-1 px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500`} />
                  <input type="number" placeholder="Unit Price" value={deliveryForm.unitPrice} onChange={(e) => setDeliveryForm({...deliveryForm, unitPrice: parseInt(e.target.value) || 25})} className={`flex-1 px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500`} />
                </div>
                <input type="text" placeholder="Pickup Address" value={deliveryForm.pickupAddress} onChange={(e) => setDeliveryForm({...deliveryForm, pickupAddress: e.target.value})} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 mb-3`} />
                <input type="text" placeholder="Dropoff Address" value={deliveryForm.dropoffAddress} onChange={(e) => setDeliveryForm({...deliveryForm, dropoffAddress: e.target.value})} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500`} />
              </div>
              <div className="p-5 pt-0 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition" onClick={() => setShowDeliveryModal(false)}>Cancel</button>
                <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition" onClick={handleAddDelivery}>Create Order</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assign Modal */}
      <AnimatePresence>
        {showAssignModal && selectedDelivery && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1100] p-5" onClick={() => setShowAssignModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto`} onClick={(e) => e.stopPropagation()}>
              <div className="p-5 bg-indigo-600 text-white rounded-t-2xl"><h3 className="text-lg font-bold">Assign Driver</h3></div>
              <div className="p-5">
                <input type="text" placeholder="Driver Name" value={assignDriverName} onChange={(e) => setAssignDriverName(e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 mb-3`} />
                <input type="email" placeholder="Driver Email" value={assignDriverEmail} onChange={(e) => setAssignDriverEmail(e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500`} />
              </div>
              <div className="p-5 pt-0 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition" onClick={() => setShowAssignModal(false)}>Cancel</button>
                <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition" onClick={() => handleAssignDelivery(selectedDelivery.id)}>Assign</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Receipt Info Modal */}
      <AnimatePresence>
        {showReceiptInfoModal && selectedDelivery && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1100] p-5" onClick={() => setShowReceiptInfoModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto`} onClick={(e) => e.stopPropagation()}>
              <div className="p-5 bg-emerald-500 text-white rounded-t-2xl"><h3 className="text-lg font-bold">Receipt Information</h3></div>
              <div className="p-5">
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-sm">Pickup Time *</label>
                  <input type="time" value={receiptInfo.pickupTime} onChange={(e) => setReceiptInfo({...receiptInfo, pickupTime: e.target.value})} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500`} />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-sm">Estimated Delivery *</label>
                  <input type="time" value={receiptInfo.estimatedDelivery} onChange={(e) => setReceiptInfo({...receiptInfo, estimatedDelivery: e.target.value})} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500`} />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-sm">Actual Delivery</label>
                  <input type="time" value={receiptInfo.actualDelivery} onChange={(e) => setReceiptInfo({...receiptInfo, actualDelivery: e.target.value})} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500`} />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-sm">Arrival Date *</label>
                  <input type="date" value={receiptInfo.arrivalDate} onChange={(e) => setReceiptInfo({...receiptInfo, arrivalDate: e.target.value})} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500`} />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-sm">Item Price (per unit) *</label>
                  <input type="number" placeholder="Amount" value={receiptInfo.itemPrice} onChange={(e) => setReceiptInfo({...receiptInfo, itemPrice: e.target.value})} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500`} />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-sm">Total Price *</label>
                  <input type="number" placeholder="Amount" value={receiptInfo.price} onChange={(e) => setReceiptInfo({...receiptInfo, price: e.target.value})} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500`} />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-sm">Driver Note</label>
                  <textarea rows="3" value={receiptInfo.driverNote} onChange={(e) => setReceiptInfo({...receiptInfo, driverNote: e.target.value})} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 resize-vertical`} />
                </div>
              </div>
              <div className="p-5 pt-0 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition" onClick={() => setShowReceiptInfoModal(false)}>Cancel</button>
                <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition" onClick={generateAndDownloadReceipt}>Generate Receipt</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Location Modal */}
      <AnimatePresence>
        {showLocationModal && selectedDelivery && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1100] p-5" onClick={() => setShowLocationModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto`} onClick={(e) => e.stopPropagation()}>
              <div className="p-5 bg-blue-500 text-white rounded-t-2xl"><h3 className="text-lg font-bold">Update Package Location</h3></div>
              <div className="p-5">
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-sm">Current Location</label>
                  <textarea placeholder="Enter current location (e.g., 'At sorting facility', 'Out for delivery', 'Arriving at destination')" value={customLocation} onChange={(e) => setCustomLocation(e.target.value)} rows="4" className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'border-gray-700 bg-[#0a0a0a] text-white' : 'border-gray-200 bg-white'} outline-none focus:border-indigo-500 resize-vertical`} />
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-blue-800 dark:text-blue-300">
                  📍 This location will be visible to the customer when tracking their package.
                </div>
                {selectedDelivery.currentLocation && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 mt-3">
                    Current location: {selectedDelivery.currentLocation}
                  </div>
                )}
              </div>
              <div className="p-5 pt-0 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition" onClick={() => setShowLocationModal(false)}>Cancel</button>
                <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50" onClick={() => updateDeliveryLocation(selectedDelivery.id, customLocation)} disabled={!customLocation.trim()}>Update Location</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceiptModal && receiptData && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1100] p-5" onClick={() => setShowReceiptModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto`} onClick={(e) => e.stopPropagation()}>
              <div className="p-5 bg-emerald-500 text-white rounded-t-2xl"><h3 className="text-lg font-bold">Receipt Generated!</h3></div>
              <div className="p-5 text-center">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl">
                  <CheckCircle size={48} className="text-emerald-500 mx-auto" />
                  <p className="mt-3">Receipt {receiptData.receiptId} has been downloaded!</p>
                  <p className="text-xs text-gray-500 mt-2">Check your downloads folder for the PNG image.</p>
                </div>
              </div>
              <div className="p-5 pt-0 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                <button className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 transition" onClick={() => setShowReceiptModal(false)}>Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden Receipt Template */}
      <div className="fixed -top-[9999px] -left-[9999px] z-[-1]">
        <div ref={receiptRef} className="w-[420px] bg-white font-['Courier_New',monospace] p-6 text-[10px] border border-gray-300">
          {receiptData && (
            <div>
              <div className="text-center mb-5 border-b-2 border-black pb-3">
                <div className="text-2xl font-bold">CYCLE LOGISTICS</div>
                <div className="text-[9px]">Global Delivery Services</div>
                <div className="text-[8px]">www.cycle.com | support@cycle.com</div>
              </div>
              
              <div className="text-center mb-4">
                <div className="text-sm font-bold bg-gray-100 inline-block px-3 py-1 rounded">OFFICIAL DELIVERY RECEIPT</div>
                <div className="text-[9px] mt-1">Receipt #{receiptData.receiptId}</div>
              </div>
              
              <div className="mb-4 border-b border-dotted border-gray-400 pb-3">
                <div><strong>DATE:</strong> {new Date(receiptData.date).toLocaleString()}</div>
                <div><strong>TRACKING ID:</strong> {receiptData.trackingId}</div>
                <div><strong>CUSTOMER:</strong> {receiptData.customerName}</div>
                <div><strong>EMAIL:</strong> {receiptData.customerEmail}</div>
              </div>
              
              <div className="mb-4 border-b border-dotted border-gray-400 pb-3 bg-gray-50 p-3 rounded">
                <div>🕐 <strong>PICKUP TIME:</strong> {receiptData.pickupTime}</div>
                <div>⏰ <strong>ESTIMATED DELIVERY:</strong> {receiptData.estimatedDelivery}</div>
                <div>📅 <strong>ARRIVAL DATE:</strong> {receiptData.arrivalDate}</div>
                {receiptData.actualDelivery && <div>✅ <strong>ACTUAL DELIVERY:</strong> {receiptData.actualDelivery}</div>}
              </div>
              
              <div className="mb-4 border-b border-dotted border-gray-400 pb-3">
                <div><strong>📍 PICKUP ADDRESS:</strong></div>
                <div className="ml-2 mb-2">{receiptData.pickupAddress}</div>
                <div><strong>🏠 DROP OFF ADDRESS:</strong></div>
                <div className="ml-2">{receiptData.dropoffAddress}</div>
              </div>
              
              <div className="mb-4 border-b border-black pb-3">
                <div className="flex justify-between border-b border-black mb-2 pb-1 font-bold">
                  <span>ITEM</span><span>QTY</span><span>UNIT</span><span>TOTAL</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>{receiptData.itemName}</span><span>{receiptData.quantity}</span><span>${receiptData.unitPrice}</span><span>${(receiptData.quantity * receiptData.unitPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold mt-2 pt-2 border-t border-dashed border-gray-300">
                  <span>GRAND TOTAL</span><span>${receiptData.price}.00</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div><strong>🚚 DRIVER:</strong> {receiptData.driverName}</div>
                {receiptData.driverNote && <div><strong>📝 NOTE:</strong> {receiptData.driverNote}</div>}
              </div>
              
              <div className="text-center bg-blue-50 p-2 rounded mb-4">
                <div>🔗 TRACK: {receiptData.trackingUrl}</div>
              </div>
              
              <div className="text-center mt-4 pt-4 border-t-2 border-black">
                <div className="inline-block bg-amber-100 p-2 rounded">
                  <div>✓ VERIFIED DELIVERY ✓</div>
                </div>
                <div className="mt-3 text-[8px]">
                  Authorized by: <strong>Cycle Management</strong>
                  <div className="mt-1">Thank you for choosing Cycle Logistics!</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;