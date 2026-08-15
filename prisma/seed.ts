import 'dotenv/config'
import { PrismaClient, Role } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando la siembra de datos (seed)...')

  // Generar hashes de contraseñas con bcryptjs
  const adminPasswordHash = await bcrypt.hash('admin123', 10)
  const entrepreneurPasswordHash = await bcrypt.hash('emp123', 10)
  const investorPasswordHash = await bcrypt.hash('inv123', 10)

  // 1. Crear o actualizar Usuario Administrador
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@quickpitch.com' },
    update: {
      name: 'Administrador QuickPitch',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
    create: {
      name: 'Administrador QuickPitch',
      email: 'admin@quickpitch.com',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  })
  console.log(`✅ Usuario Administrador creado/actualizado: ${adminUser.email}`)

  // 2. Crear o actualizar Usuario Emprendedor
  const entrepreneurUser = await prisma.user.upsert({
    where: { email: 'emprendedor@quickpitch.com' },
    update: {
      name: 'Carlos Emprendedor',
      passwordHash: entrepreneurPasswordHash,
      role: Role.ENTREPRENEUR,
    },
    create: {
      name: 'Carlos Emprendedor',
      email: 'emprendedor@quickpitch.com',
      passwordHash: entrepreneurPasswordHash,
      role: Role.ENTREPRENEUR,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  })
  console.log(`✅ Usuario Emprendedor creado/actualizado: ${entrepreneurUser.email}`)

  // 3. Crear o actualizar Usuario Inversionista
  const investorUser = await prisma.user.upsert({
    where: { email: 'inversionista@quickpitch.com' },
    update: {
      name: 'Sofía Inversionista',
      passwordHash: investorPasswordHash,
      role: Role.INVESTOR,
    },
    create: {
      name: 'Sofía Inversionista',
      email: 'inversionista@quickpitch.com',
      passwordHash: investorPasswordHash,
      role: Role.INVESTOR,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
  })
  console.log(`✅ Usuario Inversionista creado/actualizado: ${investorUser.email}`)

  // 4. Crear Startups de prueba para el Emprendedor
  // Buscamos si ya existen startups para el emprendedor
  const existingStartups = await prisma.startup.findMany({
    where: { ownerId: entrepreneurUser.id },
  })

  if (existingStartups.length === 0) {
    const startup1 = await prisma.startup.create({
      data: {
        name: 'EcoTech Solutions',
        description: 'Plataforma SaaS para la optimización de residuos y reciclaje empresarial inteligente con trazabilidad IoT.',
        sector: 'CleanTech',
        valuationTarget: 500000.00,
        logoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150',
        isApproved: true,
        ownerId: entrepreneurUser.id,
      },
    })
    console.log(`🚀 Startup creada: ${startup1.name} (Aprobada)`)

    const startup2 = await prisma.startup.create({
      data: {
        name: 'HealthAI Diagnostics',
        description: 'Sistema de diagnóstico médico preventivo asistido por modelos de inteligencia artificial y visión por computadora.',
        sector: 'HealthTech',
        valuationTarget: 1200000.00,
        logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150',
        isApproved: false,
        ownerId: entrepreneurUser.id,
      },
    })
    console.log(`🚀 Startup creada: ${startup2.name} (Pendiente de aprobación)`)
  } else {
    console.log(`ℹ️ Startups de prueba ya existentes (${existingStartups.length} encontradas).`)
  }

  console.log('✨ Siembra de datos completada exitosamente.')
}

main()
  .catch((e) => {
    console.error('❌ Error durante la ejecución del seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
