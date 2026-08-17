import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { decryptDeck } from '@/services/encryption-service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Require authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const userId = session.user.id;
    const userRole = (session.user as any).role as string;

    const { id } = await params;

    // 2. Fetch the deck with its startup owner
    const deck = await prisma.pitchDeck.findUnique({
      where: { id },
      include: { startup: { select: { ownerId: true } } },
    });

    if (!deck) {
      return NextResponse.json({ error: 'Pitch Deck no encontrado' }, { status: 404 });
    }

    // 3. Check access permissions
    const isOwner = deck.startup.ownerId === userId;
    const isAdmin = userRole === 'ADMIN';

    let hasAccess = isOwner || isAdmin;

    // Investors with a booking on any session of this startup also get access
    if (!hasAccess && userRole === 'INVESTOR') {
      const booking = await prisma.booking.findFirst({
        where: {
          userId,
          pitchSession: { startupId: deck.startupId },
        },
      });
      hasAccess = booking !== null;
    }

    if (!hasAccess) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // 4. Decrypt and return the PDF
    const buffer = await decryptDeck(id);

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    console.error('Error al obtener pitch deck:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
