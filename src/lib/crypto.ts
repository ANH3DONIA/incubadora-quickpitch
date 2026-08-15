import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'

/**
 * Obtiene la clave de cifrado de las variables de entorno
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_SECRET_KEY
  if (!key) throw new Error('ENCRYPTION_SECRET_KEY no está definida')
  return Buffer.from(key, 'hex')
}

export interface EncryptedData {
  iv: string        // Vector de inicialización (hex)
  authTag: string   // Tag de autenticación GCM (hex)
  data: string      // Datos cifrados (hex)
}

/**
 * Cifra un buffer de datos (ej. archivo PDF) con AES-256-GCM
 */
export function encryptBuffer(buffer: Buffer): EncryptedData {
  const key = getEncryptionKey()
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()])
  const authTag = cipher.getAuthTag()

  return {
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    data: encrypted.toString('hex'),
  }
}

/**
 * Descifra datos previamente cifrados con AES-256-GCM
 */
export function decryptBuffer(encrypted: EncryptedData): Buffer {
  const key = getEncryptionKey()
  const iv = Buffer.from(encrypted.iv, 'hex')
  const authTag = Buffer.from(encrypted.authTag, 'hex')
  const data = Buffer.from(encrypted.data, 'hex')

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  return Buffer.concat([decipher.update(data), decipher.final()])
}
