import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startupSchema } from '@/lib/validations';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = startupSchema.parse(body);

    const sessionData = await auth();
    if (!sessionData?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const ownerId = sessionData.user.id;

    const startup = await prisma.startup.create({
      data: {
        name: parsed.name,
        description: parsed.description,
        sector: parsed.sector,
        valuationTarget: parsed.valuationTarget,
        ownerId,
      }
    });

    return NextResponse.json(startup, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const startups = await prisma.startup.findMany({
      include: {
        pitchDecks: true
      }
    });
    return NextResponse.json(startups);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
