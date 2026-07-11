// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc,
  query,
  where,
  deleteDoc,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  setDoc,
  getDoc
} from 'firebase/firestore';

// ============================================
// 🔥 YOUR FIREBASE CONFIGURATION
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyCWpNDyHhFhZOXecMU79uDUKJXVeevEoVo",
  authDomain: "cycle-d52bd.firebaseapp.com",
  projectId: "cycle-d52bd",
  storageBucket: "cycle-d52bd.firebasestorage.app",
  messagingSenderId: "876772415754",
  appId: "1:876772415754:web:0f75c80e5da6bb73f142f3",
  measurementId: "G-BSMZF71LWZ"
};

// ============================================
// Initialize Firebase
// ============================================
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// ============================================
// DELIVERY SERVICE - All database operations
// ============================================
export const deliveryService = {
  /**
   * Get all deliveries from Firebase
   * @returns {Promise<Array>} Array of delivery objects
   */
  getAll: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'deliveries'));
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
    } catch (error) {
      console.error('Error getting all deliveries:', error);
      return [];
    }
  },

  /**
   * Get deliveries by customer email
   * @param {string} email - Customer's email address
   * @returns {Promise<Array>} Array of delivery objects
   */
  getByEmail: async (email) => {
    try {
      const q = query(
        collection(db, 'deliveries'), 
        where('customerEmail', '==', email.toLowerCase()),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
    } catch (error) {
      console.error('Error getting deliveries by email:', error);
      return [];
    }
  },

  /**
   * Get delivery by tracking ID
   * @param {string} trackingId - Tracking ID
   * @returns {Promise<Object|null>} Delivery object or null if not found
   */
  getByTrackingId: async (trackingId) => {
    try {
      const q = query(
        collection(db, 'deliveries'), 
        where('trackingId', '==', trackingId.toUpperCase())
      );
      const snapshot = await getDocs(q);
      const deliveries = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      return deliveries[0] || null;
    } catch (error) {
      console.error('Error getting delivery by tracking ID:', error);
      return null;
    }
  },

  /**
   * Create a new delivery
   * @param {Object} data - Delivery data
   * @returns {Promise<Object>} Created delivery object
   */
  create: async (data) => {
    try {
      const deliveryData = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: data.status || 'pending'
      };
      
      const docRef = await addDoc(collection(db, 'deliveries'), deliveryData);
      return { 
        id: docRef.id, 
        ...deliveryData 
      };
    } catch (error) {
      console.error('Error creating delivery:', error);
      throw error;
    }
  },

  /**
   * Update an existing delivery
   * @param {string} id - Delivery document ID
   * @param {Object} data - Updated delivery data
   * @returns {Promise<Object>} Updated delivery object
   */
  update: async (id, data) => {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(doc(db, 'deliveries', id), updateData);
      return { 
        id, 
        ...updateData 
      };
    } catch (error) {
      console.error('Error updating delivery:', error);
      throw error;
    }
  },

  /**
   * Delete a delivery by ID
   * @param {string} id - Delivery document ID
   * @returns {Promise<boolean>} Success status
   */
  delete: async (id) => {
    try {
      await deleteDoc(doc(db, 'deliveries', id));
      return true;
    } catch (error) {
      console.error('Error deleting delivery:', error);
      throw error;
    }
  },

  /**
   * Get recent deliveries (last N)
   * @param {number} count - Number of deliveries to return
   * @returns {Promise<Array>} Array of delivery objects
   */
  getRecent: async (count = 10) => {
    try {
      const q = query(
        collection(db, 'deliveries'),
        orderBy('createdAt', 'desc'),
        limit(count)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
    } catch (error) {
      console.error('Error getting recent deliveries:', error);
      return [];
    }
  },

  /**
   * Get deliveries by status
   * @param {string} status - Delivery status (pending, assigned, in_transit, etc.)
   * @returns {Promise<Array>} Array of delivery objects
   */
  getByStatus: async (status) => {
    try {
      const q = query(
        collection(db, 'deliveries'),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
    } catch (error) {
      console.error('Error getting deliveries by status:', error);
      return [];
    }
  },

  /**
   * Listen to real-time updates for all deliveries
   * @param {Function} callback - Function to call on data change
   * @returns {Function} Unsubscribe function
   */
  listenToAll: (callback) => {
    return onSnapshot(collection(db, 'deliveries'), (snapshot) => {
      const deliveries = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      callback(deliveries);
    }, (error) => {
      console.error('Error listening to deliveries:', error);
    });
  },

  /**
   * Listen to real-time updates for a specific delivery
   * @param {string} id - Delivery document ID
   * @param {Function} callback - Function to call on data change
   * @returns {Function} Unsubscribe function
   */
  listenToOne: (id, callback) => {
    return onSnapshot(doc(db, 'deliveries', id), (snapshot) => {
      if (snapshot.exists()) {
        callback({ 
          id: snapshot.id, 
          ...snapshot.data() 
        });
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error listening to delivery:', error);
    });
  },

  /**
   * Get a single delivery by ID
   * @param {string} id - Delivery document ID
   * @returns {Promise<Object|null>} Delivery object or null if not found
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'deliveries', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting delivery by ID:', error);
      return null;
    }
  },

  /**
   * Get deliveries by driver name
   * @param {string} driverName - Driver's name
   * @returns {Promise<Array>} Array of delivery objects
   */
  getByDriver: async (driverName) => {
    try {
      const q = query(
        collection(db, 'deliveries'),
        where('driverName', '==', driverName),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
    } catch (error) {
      console.error('Error getting deliveries by driver:', error);
      return [];
    }
  },

  /**
   * Get deliveries by date range
   * @param {string} startDate - Start date ISO string
   * @param {string} endDate - End date ISO string
   * @returns {Promise<Array>} Array of delivery objects
   */
  getByDateRange: async (startDate, endDate) => {
    try {
      const q = query(
        collection(db, 'deliveries'),
        where('createdAt', '>=', startDate),
        where('createdAt', '<=', endDate),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
    } catch (error) {
      console.error('Error getting deliveries by date range:', error);
      return [];
    }
  },

  /**
   * Count deliveries by status
   * @returns {Promise<Object>} Count of deliveries by status
   */
  countByStatus: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'deliveries'));
      const deliveries = snapshot.docs.map(doc => doc.data());
      
      const counts = {
        pending: 0,
        assigned: 0,
        picked_up: 0,
        in_transit: 0,
        delivered: 0
      };
      
      deliveries.forEach(delivery => {
        if (counts.hasOwnProperty(delivery.status)) {
          counts[delivery.status]++;
        }
      });
      
      return counts;
    } catch (error) {
      console.error('Error counting deliveries by status:', error);
      return {};
    }
  }
};

// Export db for direct use if needed
export { db, analytics, app };

// Default export
export default db;
