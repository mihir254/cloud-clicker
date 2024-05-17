import { FieldValue } from "firebase-admin/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

import * as Sentry from '@sentry/nextjs';

// import logger from '../../../../logger';
import { initAdmin } from "../../../../db/firebaseAdmin";

type Data = {
  message: string;
};

const AUTH_ERROR_MESSAGE = 'Authentication token required';
const UNAUTHORIZED_MESSAGE = 'Unauthorized!';
const SUCCESS_MESSAGE = 'Clicks updated successfully!';
const FAIL_MESSAGE = 'Failed to update clicks';
const METHOD_NOT_ALLOWED_MESSAGE = 'Method Not Allowed!';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method === 'POST') {
    try {
      const token = req.headers.authorization?.split('Bearer ')[1];
      if (!token) {
        console.error(AUTH_ERROR_MESSAGE);
        // logger.error(AUTH_ERROR_MESSAGE);
        // Sentry.captureException(new Error(AUTH_ERROR_MESSAGE));
        return res.status(401).json({ message: AUTH_ERROR_MESSAGE });
      }
      const adminApp = await initAdmin();
      const decodedToken = await adminApp.auth().verifyIdToken(token);
      const uid = decodedToken.uid;
      const db = adminApp.firestore();

      if (uid) {
        const usersDocRef = db.doc(`Users/${uid}`);
        const totalClicksDocRef = db.doc('TotalClicks/counter');
        const clicksCollectionRef = db.collection('Clicks');
  
        await db.runTransaction(async (transaction) => {
          transaction.update(usersDocRef, { clickCount: FieldValue.increment(1) });
          transaction.update(totalClicksDocRef, { total: FieldValue.increment(1) });
          transaction.set(clicksCollectionRef.doc(), {
            userId: uid,
            timestamp: FieldValue.serverTimestamp(),
          })
        });
        console.log(`user (uid: ${uid}) clicked the button!`);
        // Sentry.captureMessage(`user (uid: ${uid}) clicked the button!`, 'info');
        // logger.info(`user (uid: ${uid}) clicked the button!`);
        res.status(200).json({ message: SUCCESS_MESSAGE });
      } else {
        console.log(UNAUTHORIZED_MESSAGE);
        // Sentry.captureException(new Error(UNAUTHORIZED_MESSAGE));
        // logger.error(UNAUTHORIZED_MESSAGE);
        res.status(401).json({ message: UNAUTHORIZED_MESSAGE });
      }
    } catch (error: any) {
      const errorMessage = error.message || FAIL_MESSAGE;
      // Sentry.captureException(error);
      // logger.logFullError('error', `${FAIL_MESSAGE}: ${errorMessage}`, error);
      // logger.error(`${FAIL_MESSAGE}: ${errorMessage}`);
      console.error(`${FAIL_MESSAGE}: ${errorMessage}`);
      res.status(500).json({ message: FAIL_MESSAGE });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`${METHOD_NOT_ALLOWED_MESSAGE} ${req.method}`);
  }
}