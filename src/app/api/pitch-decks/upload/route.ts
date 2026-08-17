import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { encryptAndStoreDeck } from '@/services/encryption-service'

/**
 * Endpoint para subir Pitch Decks cifrados.
 * Solo accesible por emprendedores autenticados.
 */
export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ENTREPRENEUR') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const startupId = formData.get('startupId') as string | null

  if (!file || !startupId) {
    return NextResponse.json(
      { error: 'Archivo y startupId son requeridos' },
      { status: 400 }
    )
  }

  // Validar tipo de archivo
  if (file.type !== 'application/pdf') {
    return NextResponse.json(
      { error: 'Solo se aceptan archivos PDF' },
      { status: 400 }
    )
  }

  // Convertir a Buffer y cifrar
  const buffer = Buffer.from(await file.arrayBuffer())
  const deckId = await encryptAndStoreDeck(startupId, buffer, file.name)

  return NextResponse.json({ deckId, message: 'Pitch Deck subido y cifrado exitosamente' })
}
