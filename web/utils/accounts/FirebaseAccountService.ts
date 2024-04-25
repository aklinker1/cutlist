import {
  getDoc,
  setDoc,
  getDocs,
  query,
  deleteDoc,
  collection,
  doc,
} from 'firebase/firestore';
import { db, firebaseAuth, usersRef } from '../firebase';
import { DEFAULT_SETTINGS } from './AccountService';

export function createFirebaseAccountService(): AccountService {
  const getUid = () => {
    if (firebaseAuth.currentUser == null) throw Error('Not logged in');
    return firebaseAuth.currentUser.uid;
  };

  const settingsDoc = () => doc(usersRef, getUid(), 'settings', 'default');
  const projectsRef = () => collection(usersRef, getUid(), 'projects');
  const projectDoc = (id: string) => doc(usersRef, getUid(), 'projects', id);

  return {
    id: 'firebase',
    async getSettings() {
      const res = await getDoc(settingsDoc());
      return {
        ...DEFAULT_SETTINGS,
        ...(res.exists() ? res.data() : {}),
      };
    },
    async setSettings(changes) {
      await setDoc(settingsDoc(), changes, { merge: true });
    },
    async listProjects() {
      const q = query(projectsRef());
      const res = await getDocs(q);
      return res.docs.map((doc) => doc.data()) as Project[];
    },
    async saveProject(project) {
      await setDoc(projectDoc(project.id), project);
    },
    async removeProject(projectId) {
      await deleteDoc(projectDoc(projectId));
    },
  };
}
