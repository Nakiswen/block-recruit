import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoints: ['/api/ai/generate'],
    version: '1.0'
  });
} 