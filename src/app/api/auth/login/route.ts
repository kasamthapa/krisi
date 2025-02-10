import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Demo authentication - replace with real auth logic later
    if (email === 'demo@example.com' && password === 'demo123') {
      const user = {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        role: 'ADMIN' as const,
      };
      
      return NextResponse.json(user);
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 