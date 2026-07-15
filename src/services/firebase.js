// src/services/firebase.js
// 🔥 FIREBASE WITH CDN - No npm install needed!

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
    if (window.firebase) {
      resolve(window.firebase);
      return;
    }

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
          const app = window.firebase.initializeApp(firebaseConfig);
          const db = window.firebase.firestore();
          const analytics = window.firebase.analytics();
          resolve({ app, db, analytics, firebase: window.firebase });
        }
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  });
};

let firebaseInstance = null;

export const deliveryService = {
  init: async () => {
    if (!firebaseInstance) {
      firebaseInstance = await loadFirebase();
    }
    return firebaseInstance;
  },

  getAll: async () => {
    try {
      const { db } = await deliveryService.init();
      const snapshot = await db.collection('deliveries').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting deliveries:', error);
      return [];
    }
  },

  getByEmail: async (email) => {
    try {
      const { db } = await deliveryService.init();
      const snapshot = await db
        .collection('deliveries')
        .where('customerEmail', '==', email.toLowerCase())
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting deliveries by email:', error);
      return [];
    }
  },

  getByTrackingId: async (trackingId) => {
    try {
      const { db } = await deliveryService.init();
      const snapshot = await db
        .collection('deliveries')
        .where('trackingId', '==', trackingId.toUpperCase())
        .get();
      const deliveries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return deliveries[0] || null;
    } catch (error) {
      console.error('Error getting delivery by tracking ID:', error);
      return null;
    }
  },

  create: async (data) => {
    try {
      const { db } = await deliveryService.init();
      const docRef = await db.collection('deliveries').add({
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
      const { db } = await deliveryService.init();
      await db.collection('deliveries').doc(id).update({
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
      const { db } = await deliveryService.init();
      await db.collection('deliveries').doc(id).delete();
      return true;
    } catch (error) {
      console.error('Error deleting delivery:', error);
      throw error;
    }
  },

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

  listenToAll: (callback) => {
    deliveryService.init().then(({ db }) => {
      return db.collection('deliveries').onSnapshot((snapshot) => {
        const deliveries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(deliveries);
      }, (error) => {
        console.error('Error listening to deliveries:', error);
      });
    });
  },

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