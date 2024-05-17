import { Timestamp } from "firebase/firestore";

export interface AuthData {
    email: string;
    password: string;
    username?: string;
}

export interface ChartData {
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        fill: boolean;
        backgroundColor: string;
        borderColor: string;
    }>;
}

export interface ClickData {
    total: number;
    clickCount?: number;
}

export interface ClickInfo {
    timestamp: Timestamp;
    userId: string;
}

export interface RateLimitData {
    count: number;
    lastRequestAt: number;
}

export interface UserData {
    id: string;
    username: string;
    email: string;
    clickCount: number;
}