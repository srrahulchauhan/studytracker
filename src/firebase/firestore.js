import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './config';

export const saveUserToFirestore = async (user) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    try {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving user to Firestore", error);
    }
  }
};
