import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/lib/validations';

/**
 * Endpoint para registrar nuevos usuarios con validación estricta (Zod).
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();

    // 1. Validación estricta con Zod
    const validationResult = registerSchema.safeParse(rawBody);

    if (!validationResult.success) {
      const errorDetails = validationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return NextResponse.json(
        {
          error: errorDetails[0]?.message || 'Datos de registro inválidos',
          details: errorDetails,
        },
        { status: 400 }
      );
    }

    const { name, email, password, role } = validationResult.data;

    // 2. Verificar duplicados de correo
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este correo electrónico ya está registrado' },
        { status: 409 }
      );
    }

    // 3. Hashear la contraseña con 12 salt rounds
    const passwordHash = await bcrypt.hash(password, 12);

    // 4. Crear usuario en PostgreSQL
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Usuario creado exitosamente',
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
