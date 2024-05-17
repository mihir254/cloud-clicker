import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';

import { useAuth } from './useAuth';
import { db } from '@/../db/firebase';
import { ClickData } from '@/interfaces/interface';

export const useFirestore = () => {
    const { user } = useAuth();
    const [clicks, setClicks] = useState<number>(0);
    const [userClicks, setUserClicks] = useState<number>(0);

    useEffect(() => {
        const unsubscribeClicks = onSnapshot(doc(db, "TotalClicks", "counter"), (doc) => {
            if (doc.exists()) {
                const data = doc.data() as ClickData;
                setClicks(data.total);
            } else {
                console.log("TotalClicks document does not exist!");
            }
        });

        let unsubscribeUserClicks: () => void = () => {};
        if (user) {
            unsubscribeUserClicks = onSnapshot(doc(db, "Users", user.id), (doc) => {
                if (doc.exists()) {
                    const userData = doc.data() as ClickData;
                    setUserClicks(userData.clickCount ?? 0);
                } else {
                    console.log("User document does not exist!");
                }
            });
        }

        return () => {
            unsubscribeClicks();
            unsubscribeUserClicks();
        };
    }, [user]);

    return { clicks, userClicks };
};
