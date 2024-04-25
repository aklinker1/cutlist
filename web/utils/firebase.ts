import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const firebaseApp = initializeApp({
  apiKey: 'AIzaSyBKkmNsLYzz12hNoGMFP3eaHCtxPJCsIi0',
  authDomain: 'cutlist-17450.firebaseapp.com',
  projectId: 'cutlist-17450',
  storageBucket: 'cutlist-17450.appspot.com',
  messagingSenderId: '149400144857',
  appId: '1:149400144857:web:fa6f4a90ec177fd90ce7c8',
});

export const db = getFirestore(firebaseApp);
export const usersRef = collection(db, 'users');

export const firebaseAuth = getAuth(firebaseApp);
