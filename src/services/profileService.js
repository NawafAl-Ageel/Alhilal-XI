import { storage, db } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function uploadUserAvatar(userId, file) {
  if (!userId || !file) throw new Error('Missing userId or file');
  const avatarRef = ref(storage, `avatars/${userId}.jpg`);
  await uploadBytes(avatarRef, file, { contentType: file.type });
  const url = await getDownloadURL(avatarRef);
  // persist in user profile doc
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, { photoURL: url }, { merge: true });
  return url;
}

export async function loadUserProfile(userId) {
  if (!userId) return null;
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
}

export async function saveUserProfile(userId, data) {
  if (!userId) throw new Error('Missing userId');
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, data, { merge: true });
}


