import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { verifyJWT } from "@/lib/auth/jwt"
export async function GET(request: NextRequest) {
    // Token verification
    const token = request.headers.get('authorization')?.split('Bearer ')[1]

    if (!token) {
        return NextResponse.json(
            { message: 'Token d\'authentification requis' },
            { status: 401 }
        )
    }

    let decoded;
    try {
        decoded = await verifyJWT(token)
        if (!decoded) {
            return NextResponse.json(
                { message: 'Token invalide' },
                { status: 401 }
            )
        }
    } catch (authError) {
        return NextResponse.json(
            { message: 'Token invalide', error: authError instanceof Error ? authError.message : String(authError) },
            { status: 401 }
        )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const developerId = searchParams.get('developerId')

    try {
        // If user is a DEVELOPER, they can only see their own missions
        if (decoded.role === 'DEVELOPER') {
            if (developerId && developerId !== decoded.userId) {
                return NextResponse.json(
                    { message: 'Accès non autorisé aux missions d\'autres développeurs' },
                    { status: 403 }
                )
            }

            const missions = await prisma.mission.findMany({
                where: { assignedToId: decoded.userId },
                include: {
                    createdBy: true,
                    project: true
                }
            })

            return NextResponse.json(missions, { status: 200 })
        }

        // For PROJECT_MANAGER, they can access everything
        if (id) {
            const mission = await prisma.mission.findUnique({
                where: { id },
                include: {
                    assignedTo: true,
                    createdBy: true,
                    project: true
                }
            })

            return NextResponse.json(mission, { status: 200 })
        }

        if (developerId) {
            const missions = await prisma.mission.findMany({
                where: { assignedToId: developerId },
                include: {
                    createdBy: true,
                    project: true
                }
            })

            return NextResponse.json(missions, { status: 200 })
        }

        // All missions (for PROJECT_MANAGER only)
        const missions = await prisma.mission.findMany({
            include: {
                assignedTo: true,
                createdBy: true,
                project: true
            }
        })

        return NextResponse.json(missions, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { message: 'Erreur lors de la récupération des missions', error },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    // Vérification du token
    const token = request.headers.get('authorization')?.split('Bearer ')[1]

    if (!token) {
        return NextResponse.json(
            { message: 'Token d\'authentification requis' },
            { status: 401 }
        )
    }

    let decoded;
    try {
        decoded = await verifyJWT(token)
        if (!decoded) {
            return NextResponse.json(
                { message: 'Token invalide' },
                { status: 401 }
            )
        }

        if (decoded.role !== 'PROJECT_MANAGER') {
            return NextResponse.json(
                { message: 'Seul un chef de projet peut créer une mission' },
                { status: 403 }
            )
        }
    } catch (authError) {
        return NextResponse.json(
            { message: 'Token invalide', error: authError instanceof Error ? authError.message : String(authError) },
            { status: 401 }
        )
    }

    const body = await request.json()
    console.log("🚀 Données reçues pour création de mission:", body)

    try {
        // Vérification des données obligatoires
        if (!body.title) {
            return NextResponse.json(
                { message: 'Le titre est obligatoire' },
                { status: 400 }
            )
        }

        if (!body.deadline) {
            return NextResponse.json(
                { message: 'La deadline est obligatoire' },
                { status: 400 }
            )
        }

        // Création de la mission
        const newMission = await prisma.mission.create({
            data: {
                title: body.title,
                description: body.description,
                deadline: new Date(body.deadline),
                createdById: decoded.userId,
                status: 'PENDING',
                assignedToId: body.assignedToId || null,  // Optionnel
                projectId: body.projectId || null         // Optionnel
            },
            include: {
                assignedTo: true,
                createdBy: true,
                project: true
            }
        })

        console.log("✅ Mission créée avec succès:", newMission)
        return NextResponse.json(newMission, { status: 201 })
    } catch (error) {
        console.error("❌ Erreur détaillée lors de la création de la mission:", error)
        return NextResponse.json(
            {
                message: 'Erreur lors de la création de la mission',
                error: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    const body = await request.json()

    try {
        if (!body.id) {
            return NextResponse.json(
                { message: 'ID de mission requis' },
                { status: 400 }
            )
        }

        const updatedMission = await prisma.mission.update({
            where: { id: body.id },
            data: {
                ...body,
                deadline: body.deadline ? new Date(body.deadline) : undefined
            },
            include: {
                assignedTo: true,
                createdBy: true,
                project: true
            }
        })

        return NextResponse.json(updatedMission, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { message: 'Erreur lors de la mise à jour de la mission', error },
            { status: 400 }
        )
    }
}

// DELETE - Supprimer une mission
export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    try {
        if (!id) {
            return NextResponse.json(
                { message: 'ID de mission requis' },
                { status: 400 }
            )
        }

        const deletedMission = await prisma.mission.delete({
            where: { id }
        })

        return NextResponse.json(deletedMission, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { message: 'Erreur lors de la suppression de la mission', error },
            { status: 400 }
        )
    }
}