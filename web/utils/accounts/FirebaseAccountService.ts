import {
  getDoc,
  setDoc,
  getDocs,
  query,
  deleteDoc,
  collection,
  doc,
} from 'firebase/firestore';
import { firebaseAuth, usersRef } from '../firebase';
import { DEFAULT_SETTINGS } from './AccountService';

export function createFirebaseAccountService(): AccountService {
  const getUid = () => {
    if (firebaseAuth.currentUser == null) throw Error('Not logged in');
    return firebaseAuth.currentUser.uid;
  };

  const settingsDoc = (projectId: string | undefined) =>
    doc(usersRef, getUid(), 'settings', projectId ?? 'default');
  const projectsRef = () => collection(usersRef, getUid(), 'projects');
  const projectDoc = (id: string) => doc(usersRef, getUid(), 'projects', id);

  return {
    id: 'firebase',
    async getSettings(projectId) {
      const res = await getDoc(settingsDoc(projectId));
      return {
        ...DEFAULT_SETTINGS,
        ...(res.exists() ? res.data() : {}),
      };
    },
    async setSettings(projectId, changes) {
      await setDoc(settingsDoc(projectId), changes, { merge: true });
    },
    async deleteSettings(projectId) {
      await deleteDoc(settingsDoc(projectId));
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
