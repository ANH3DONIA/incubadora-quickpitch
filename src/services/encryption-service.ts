import fs from 'fs/promises'
import path from 'path'
import { encryptBuffer, decryptBuffer } from '@/lib/crypto'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'decks')

/**
 * Cifra y almacena un Pitch Deck (PDF) de forma segura
 */
export async function encryptAndStoreDeck(
  startupId: string,
  fileBuffer: Buffer,
  originalFileName: string
): Promise<string> {
  // Generar un ID único para la clave de cifrado
  const encryptionKeyId = crypto.randomUUID()

  // Cifrar el archivo
  const encrypted = encryptBuffer(fileBuffer)

  // Crear directorio si no existe
  await fs.mkdir(UPLOAD_DIR, { recursive: true })

  // Guardar archivo cifrado en disco
  const fileName = `${encryptionKeyId}.enc`
  const filePath = path.join(UPLOAD_DIR, fileName)
  
  // Guardar los datos cifrados junto con IV y authTag como JSON
  await fs.writeFile(filePath, JSON.stringify(encrypted))

  // Obtener la versión más alta actual del deck
  const latestDeck = await prisma.pitchDeck.findFirst({
    where: { startupId },
    orderBy: { version: 'desc' },
  })

  // Desactivar decks anteriores
  await prisma.pitchDeck.updateMany({
    where: { startupId, isActive: true },
    data: { isActive: false },
  })

  // Registrar en la base de datos
  const deck = await prisma.pitchDeck.create({
    data: {
      startupId,
      filePath: fileName,
      encryptionKeyId,
      version: (latestDeck?.version || 0) + 1,
      isActive: true,
    },
  })

  return deck.id
}

/**
 * Descifra y retorna un Pitch Deck almacenado
 */
export async function decryptDeck(deckId: string): Promise<Buffer> {
  const deck = await prisma.pitchDeck.findUnique({
    where: { id: deckId },
  })

  if (!deck) throw new Error('Pitch Deck no encontrado')

  const filePath = path.join(UPLOAD_DIR, deck.filePath)
  const encryptedJson = await fs.readFile(filePath, 'utf-8')
  const encrypted = JSON.parse(encryptedJson)

  return decryptBuffer(encrypted)
}
