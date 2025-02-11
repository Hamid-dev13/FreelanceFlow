import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

// Type pour le rôle si nécessaire
type Role = 'DEVELOPER' | 'PROJECT_MANAGER'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const role = searchParams.get('role') as Role | null

        const users = await prisma.user.findMany({
            where: role ? { role } : {},
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        })

        return NextResponse.json(users)
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error)
        return NextResponse.json(
            {
                message: 'Erreur lors de la récupération des utilisateurs',
                error: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        )
    }
}