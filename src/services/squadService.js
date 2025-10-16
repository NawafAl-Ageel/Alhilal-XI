import { db } from '../firebase/config';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';

// Save a squad for a specific user and match
export async function saveUserSquad(userId, matchId, squadData) {
  if (!userId || !matchId) throw new Error('Missing userId or matchId');
  const ref = doc(db, 'users', userId, 'squads', String(matchId));
  await setDoc(ref, squadData, { merge: true });
}

// Load a single squad for a user and match
export async function loadUserSquad(userId, matchId) {
  if (!userId || !matchId) throw new Error('Missing userId or matchId');
  const ref = doc(db, 'users', userId, 'squads', String(matchId));
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// Fetch existence flags for multiple matches (returns map of matchId -> true)
export async function getUserSavedSquadFlags(userId, matchIds) {
  if (!userId || !Array.isArray(matchIds) || matchIds.length === 0) return {};
  // Firestore has no batch existence check by IDs without querying; fetch all user's squads and map
  const colRef = collection(db, 'users', userId, 'squads');
  const snapshot = await getDocs(colRef);
  const existing = {};
  snapshot.forEach((docSnap) => {
    const id = docSnap.id;
    if (matchIds.includes(id) || matchIds.includes(Number(id))) existing[id] = true;
  });
  return existing;
}


