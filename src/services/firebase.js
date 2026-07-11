// src/services/firebase.js
// 🔥 FIREBASE WITH CDN - No npm install needed!

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCWpNDyHhFhZOXecMU79uDUKJXVeevEoVo",
  authDomain: "cycle-d52bd.firebaseapp.com",
  projectId: "cycle-d52bd",
  storageBucket: "cycle-d52bd.firebasestorage.app",
  messagingSenderId: "876772415754",
  appId: "1:876772415754:web:0f75c80e5da6bb73f142f3",
  measurementId: "G-BSMZF71LWZ"
};

// Load Firebase from CDN dynamically
const loadFirebase = () => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.firebase) {
      resolve(window.firebase);
      return;
    }

    // Load Firebase scripts from CDN
    const scripts = [
      'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js',
      'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js',
      'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics-compat.js'
    ];

    let loaded = 0;
    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        loaded++;
        if (loaded === scripts.length) {
          // Initialize Firebase
          const app = window.firebase.initializeApp(firebaseConfig);
          const db = window.firebase.firestore();
          const analytics = window.firebase.analytics();
          console.log('✅ Firebase initialized successfully!');
          resolve({ app, db, analytics, firebase: window.firebase });
        }
      };
      script.onerror = (error) => {
        console.error('❌ Failed to load Firebase CDN:', error);
        reject(error);
      };
      document.head.appendChild(script);
    });
  });
};

// Firebase service wrapper
let firebaseInstance = null;

export const deliveryService = {
  // Initialize Firebase
  init: async () => {
    if (!firebaseInstance) {
      firebaseInstance = await loadFirebase();
    }
    return firebaseInstance;
  },

  // Get all deliveries (with logging)
  getAll: async () => {
    try {
      const { db } = await deliveryService.init();
      console.log('📡 Fetching all deliveries from Firebase...');
      const snapshot = await db.collection('deliveries').get();
      const deliveries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`✅ Found ${deliveries.length} deliveries in Firebase`);
      return deliveries;
    } catch (error) {
      console.error('❌ Error getting deliveries:', error);
      return [];
    }
  },

  // Get deliveries by email (CASE INSENSITIVE)
  getByEmail: async (email) => {
    try {
      const { db } = await deliveryService.init();
      console.log(`📡 Searching for deliveries with email: "${email}"`);
      
      // Get ALL deliveries first (for debugging)
      const allSnapshot = await db.collection('deliveries').get();
      const allDeliveries = allSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`📦 Total deliveries in Firebase: ${allDeliveries.length}`);
      
      // Log all emails found
      const allEmails = allDeliveries.map(d => d.customerEmail);
      console.log('📧 All customer emails in Firebase:', allEmails);
      
      // Case insensitive search
      const searchEmail = email.toLowerCase().trim();
      const matchingDeliveries = allDeliveries.filter(d => {
        const deliveryEmail = d.customerEmail?.toLowerCase().trim();
        return deliveryEmail === searchEmail;
      });
      
      console.log(`✅ Found ${matchingDeliveries.length} deliveries for email: "${email}"`);
      return matchingDeliveries;
    } catch (error) {
      console.error('❌ Error getting deliveries by email:', error);
      return [];
    }
  },

  // Get delivery by tracking ID (CASE INSENSITIVE)
  getByTrackingId: async (trackingId) => {
    try {
      const { db } = await deliveryService.init();
      console.log(`📡 Searching for tracking ID: "${trackingId}"`);
      
      // Get ALL deliveries first (for debugging)
      const allSnapshot = await db.collection('deliveries').get();
      const allDeliveries = allSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Log all tracking IDs found
      const allTrackingIds = allDeliveries.map(d => d.trackingId);
      console.log('🔍 All tracking IDs in Firebase:', allTrackingIds);
      
      // Case insensitive search
      const searchId = trackingId.toUpperCase().trim();
      const matchingDelivery = allDeliveries.find(d => {
        const deliveryId = d.trackingId?.toUpperCase().trim();
        return deliveryId === searchId;
      });
      
      if (matchingDelivery) {
        console.log('✅ Found delivery:', matchingDelivery);
        return matchingDelivery;
      } else {
        console.log(`❌ No delivery found with tracking ID: "${trackingId}"`);
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting delivery by tracking ID:', error);
      return null;
    }
  },

  // Create delivery
  create: async (data) => {
    try {
      const { db } = await deliveryService.init();
      console.log('📝 Creating new delivery:', data);
      
      const docRef = await db.collection('deliveries').add({
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: data.status || 'pending'
      });
      
      console.log(`✅ Delivery created with ID: ${docRef.id}`);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('❌ Error creating delivery:', error);
      throw error;
    }
  },

  // Update delivery
  update: async (id, data) => {
    try {
      const { db } = await deliveryService.init();
      console.log(`📝 Updating delivery ${id}:`, data);
      
      await db.collection('deliveries').doc(id).update({
        ...data,
        updatedAt: new Date().toISOString()
      });
      
      console.log(`✅ Delivery ${id} updated successfully`);
      return { id, ...data };
    } catch (error) {
      console.error('❌ Error updating delivery:', error);
      throw error;
    }
  },

  // Delete delivery
  delete: async (id) => {
    try {
      const { db } = await deliveryService.init();
      await db.collection('deliveries').doc(id).delete();
      console.log(`✅ Delivery ${id} deleted successfully`);
      return true;
    } catch (error) {
      console.error('❌ Error deleting delivery:', error);
      throw error;
    }
  },

  // Get recent deliveries
  getRecent: async (count = 10) => {
    try {
      const { db } = await deliveryService.init();
      const snapshot = await db
        .collection('deliveries')
        .orderBy('createdAt', 'desc')
        .limit(count)
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting recent deliveries:', error);
      return [];
    }
  },

  // Get deliveries by status
  getByStatus: async (status) => {
    try {
      const { db } = await deliveryService.init();
      const snapshot = await db
        .collection('deliveries')
        .where('status', '==', status)
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting deliveries by status:', error);
      return [];
    }
  },

  // Real-time listener for all deliveries
  listenToAll: (callback) => {
    deliveryService.init().then(({ db }) => {
      return db.collection('deliveries').onSnapshot((snapshot) => {
        const deliveries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`🔄 Real-time update: ${deliveries.length} deliveries`);
        callback(deliveries);
      }, (error) => {
        console.error('Error listening to deliveries:', error);
      });
    });
  },

  // Real-time listener for a specific delivery
  listenToOne: (id, callback) => {
    deliveryService.init().then(({ db }) => {
      return db.collection('deliveries').doc(id).onSnapshot((doc) => {
        if (doc.exists) {
          callback({ id: doc.id, ...doc.data() });
        } else {
          callback(null);
        }
      }, (error) => {
        console.error('Error listening to delivery:', error);
      });
    });
  }
};

export default deliveryService;
