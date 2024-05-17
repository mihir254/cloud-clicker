import { NextRequest } from "next/server";
import { RateLimitData } from "./interfaces/interface";

const rateLimitStore: Record<string, RateLimitData> = {};

const rateLimit = (request: NextRequest): { success: boolean, message?: string } => {
    const ip = (request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]) as string;
    const currentTime = Date.now();

    if (!rateLimitStore[ip]) {
        rateLimitStore[ip] = {
            count: 1,
            lastRequestAt: currentTime,
        };
        return { success: true };
    }

    const timeDifference = currentTime - rateLimitStore[ip].lastRequestAt;
    const timeFrame = 60000; // 1 minutes
    const requestLimit = 150;

    if (timeDifference > timeFrame) {
        rateLimitStore[ip] = {
            count: 1,
            lastRequestAt: currentTime
        };
        return { success: true };
    }

    if (rateLimitStore[ip].count < requestLimit) {
        rateLimitStore[ip].count++;
        return { success: true };
    }

    return { success: false, message: 'Rate Limit Exceeded!' };
}

export default rateLimit;
