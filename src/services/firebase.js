// src/services/firebase.js
import { initializeApp } from 'firebase/app';
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
  onSnapshot
} from 'firebase/firestore';

// ============================================
// 🔥 YOUR FIREBASE CONFIGURATION
// REPLACE THIS WITH YOUR ACTUAL CONFIG FROM FIREBASE CONSOLE
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyABC123def456GHI789jklMNO012pqr",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
  // measurementId: "G-XXXXXXXX" // Optional
};

// ============================================
// Initialize Firebase
// ============================================
const app = initializeApp(firebaseConfig);
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
  }
};

export default db;
