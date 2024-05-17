import { NextRequest, NextResponse } from "next/server";

import rateLimit from "./rate-limit";

export function middleware (request: NextRequest) {
    const origin = request.headers.get('origin');
    const method = request.method;
    const url = request.nextUrl.pathname;
    console.log(`[Request] ${method} ${url} from ${origin}`);
    
    const rateLimitStatus = rateLimit(request);
    if (!rateLimitStatus.success) {
        console.warn(`[Rate Limit Exceeded] ${method} ${url} from ${origin}`);
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Rate limit exceeded' }),
            { status: 429, headers: { 'content-type': 'application/json' } }
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/clicks/update',
}