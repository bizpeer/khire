import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/login
 * Server-side admin authentication — credentials are NEVER exposed to the client.
 */
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Server-only env vars (no NEXT_PUBLIC_ prefix)
    const envUsername = process.env.ADMIN_USERNAME || 'admin@khire.net';
    const envPassword = process.env.ADMIN_PASSWORD || 'khire2026!admin';

    const isValid =
      (username?.trim() === envUsername || username?.trim() === 'admin') &&
      password?.trim() === envPassword;

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: '관리자 ID 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // Generate a simple session token (in production, use JWT with proper signing)
    const sessionToken = Buffer.from(`${envUsername}:${Date.now()}`).toString('base64');

    const response = NextResponse.json({ success: true, token: sessionToken });

    // Set HTTP-only cookie for session (not accessible via JS)
    response.cookies.set('khire_admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 4, // 4 hours
      path: '/admin',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
