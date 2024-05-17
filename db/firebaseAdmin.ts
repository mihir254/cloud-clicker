import admin from "firebase-admin";

// import logger from '../logger';

interface FirebaseAdminAppParams {
    projectID: string;
    clientEmail: string;
    storageBucket: string;
    privateKey: string;
}

const formatPrivateKey = (key: string) => {
    return key.replace(/\\n/g, "\n");
}

export function createFirebaseAdminApp (params: FirebaseAdminAppParams) {
    const privateKey = formatPrivateKey(params.privateKey);
    if (admin.apps.length > 0) {
        // logger.info('Using existing Firebase admin app');
        console.log('Using existing Firebase admin app');
        return admin.app();
    }

    const cert = admin.credential.cert({
        projectId: params.projectID,
        clientEmail: params.clientEmail,
        privateKey
    });
    
    // logger.info('Initializing new Firebase admin app...');
    console.log('Initializing new Firebase admin app...');
    return admin.initializeApp({
        credential: cert,
        projectId: params.projectID,
        storageBucket: params.storageBucket,
    });
}

export async function initAdmin () {
    const params = {
        projectID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
        privateKey: process.env.FIREBASE_PRIVATE_KEY as string,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
    };

    return createFirebaseAdminApp(params);
}