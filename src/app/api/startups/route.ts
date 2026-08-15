import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startupSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = startupSchema.parse(body);

    let { ownerId } = body;
    if (!ownerId) {
      const defaultOwner = await prisma.user.findFirst({
        where: { role: 'ENTREPRENEUR' }
      });
      if (!defaultOwner) {
        return NextResponse.json({ error: 'No entrepreneur found' }, { status: 400 });
      }
      ownerId = defaultOwner.id;
    }

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
