import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, UserCredential } from 'firebase/auth';

import { db } from '@/../db/firebase';
import { UserData } from '@/interfaces/interface';

export const useAuth = () => {
    const auth = getAuth();
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const fetchUserData = useCallback(async (email: string, userCredential: UserCredential) => {
        try {
            const userDoc = await getDoc(doc(db, "Users", userCredential.user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data() as Omit<UserData, 'id'>;
                setUser({ id: userCredential.user.uid, ...userData });
            } else {
                if (userCredential) {
                    const existingUser = userCredential.user;
                    await setDoc(doc(db, "Users", existingUser.uid), {
                        username: existingUser.email || "Returning User",
                        clickCount: 0,
                        email: existingUser.email || email
                    });
                    setUser({
                        id: existingUser.uid,
                        username: existingUser.email || "Returning User",
                        email: existingUser.email || email,
                        clickCount: 0,
                    });
                }
            }
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await fetchUserData(email, userCredential);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (email: string, password: string, additionalData: Omit<UserData, 'id' | 'clickCount'>) => {
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "Users", userCredential.user.uid), { ...additionalData, clickCount: 0 });
            setUser({ id: userCredential.user.uid, ...additionalData, clickCount: 0 });
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await signOut(auth);
            setUser(null);
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const userDocRef = doc(db, "Users", currentUser.uid);
                getDoc(userDocRef).then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const userData = docSnapshot.data() as Omit<UserData, 'id'>;
                        setUser({ id: currentUser.uid, ...userData });
                    }
                });
            } else {
                setUser(null);
            }
        });
        return unsubscribe;
    }, []);

    return { user, login, signup, logout, isLoading, error, setError };
};
