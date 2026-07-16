// src/firebase.js
// 🔥 FIREBASE WITH npm install

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
  onSnapshot,
  getDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWpNDyHhFhZOXecMU79uDUKJXVeevEoVo",
  authDomain: "cycle-d52bd.firebaseapp.com",
  projectId: "cycle-d52bd",
  storageBucket: "cycle-d52bd.firebasestorage.app",
  messagingSenderId: "876772415754",
  appId: "1:876772415754:web:0f75c80e5da6bb73f142f3",
  measurementId: "G-BSMZF71LWZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const deliveryService = {
  getAll: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'deliveries'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting deliveries:', error);
      return [];
    }
  },

  getByEmail: async (email) => {
    try {
      const q = query(
        collection(db, 'deliveries'),
        where('customerEmail', '==', email.toLowerCase())
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting deliveries by email:', error);
      return [];
    }
  },

  getByTrackingId: async (trackingId) => {
    try {
      const q = query(
        collection(db, 'deliveries'),
        where('trackingId', '==', trackingId.toUpperCase())
      );
      const snapshot = await getDocs(q);
      const deliveries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return deliveries[0] || null;
    } catch (error) {
      console.error('Error getting delivery by tracking ID:', error);
      return null;
    }
  },

  create: async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'deliveries'), {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: data.status || 'pending'
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Error creating delivery:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      await updateDoc(doc(db, 'deliveries', id), {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return { id, ...data };
    } catch (error) {
      console.error('Error updating delivery:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await deleteDoc(doc(db, 'deliveries', id));
      return true;
    } catch (error) {
      console.error('Error deleting delivery:', error);
      throw error;
    }
  },

  getRecent: async (count = 10) => {
    try {
      const q = query(
        collection(db, 'deliveries'),
        orderBy('createdAt', 'desc'),
        limit(count)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting recent deliveries:', error);
      return [];
    }
  },

  getByStatus: async (status) => {
    try {
      const q = query(
        collection(db, 'deliveries'),
        where('status', '==', status)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting deliveries by status:', error);
      return [];
    }
  },

  listenToAll: (callback) => {
    return onSnapshot(collection(db, 'deliveries'), (snapshot) => {
      const deliveries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(deliveries);
    }, (error) => {
      console.error('Error listening to deliveries:', error);
    });
  },

  listenToOne: (id, callback) => {
    return onSnapshot(doc(db, 'deliveries', id), (snapshot) => {
      if (snapshot.exists()) {
        callback({ id: snapshot.id, ...snapshot.data() });
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error listening to delivery:', error);
    });
  },

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
  }
};

export default deliveryService;