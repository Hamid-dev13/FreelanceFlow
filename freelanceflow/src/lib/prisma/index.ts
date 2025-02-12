import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'pretty'
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Gestionnaire de déconnexion
process.on('beforeExit', async () => {
    console.log('Déconnexion propre de Prisma')
    await prisma.$disconnect()
})

// Fonction utilitaire pour les opérations avec retry
export async function withRetry<T>(
    operation: () => Promise<T>,
    retries = 3
): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await operation()
        } catch (error: any) {
            console.error(`Tentative ${attempt}/${retries} échouée:`, error.message)

            // Gestion spécifique des erreurs de connexion Prisma
            if (
                error.code === 'P2021' || // Database connection failed
                error.code === 'P2023' || // Inconsistent column data
                error.code === 'P2024' || // Connection timed out
                error.code === 'P2025'    // Record not found
            ) {
                await prisma.$disconnect()

                // Attente exponentielle entre les tentatives
                const delay = Math.min(1000 * Math.pow(2, attempt), 10000)
                await new Promise(resolve => setTimeout(resolve, delay))

                await prisma.$connect()
            }

            // Si c'est la dernière tentative, on propage l'erreur
            if (attempt === retries) {
                throw error
            }
        }
    }
    throw new Error('Opération échouée après plusieurs tentatives')
}

// Fonction helper pour gérer les opérations Prisma
export async function handlePrismaOperation<T>(operation: () => Promise<T>): Promise<T> {
    return withRetry(operation)
}

// Extension du type PrismaClient
interface ExtendedPrismaClient extends PrismaClient {
    mission: any; // Utilisez 'any' si le typage pose problème
}

// Assertion de type
const extendedPrisma = prisma as ExtendedPrismaClient

// Opérations spécifiques aux missions
export class MissionOperations {
    // Créer une nouvelle mission
    static async createMission(data: any) {
        return handlePrismaOperation(async () => {
            return extendedPrisma.mission.create({ data })
        })
    }

    // Obtenir toutes les missions
    static async getAllMissions() {
        return handlePrismaOperation(async () => {
            return extendedPrisma.mission.findMany({
                include: {
                    assignedTo: true,
                    createdBy: true,
                    project: true
                }
            })
        })
    }

    // Obtenir les missions pour un développeur spécifique
    static async getMissionsByDeveloper(developerId: string) {
        return handlePrismaOperation(async () => {
            return extendedPrisma.mission.findMany({
                where: { assignedToId: developerId },
                include: {
                    createdBy: true,
                    project: true
                }
            })
        })
    }

    // Mettre à jour une mission
    static async updateMission(
        id: string,
        data: any
    ) {
        return handlePrismaOperation(async () => {
            return extendedPrisma.mission.update({
                where: { id },
                data
            })
        })
    }

    // Supprimer une mission
    static async deleteMission(id: string) {
        return handlePrismaOperation(async () => {
            return extendedPrisma.mission.delete({
                where: { id }
            })
        })
    }

    // Obtenir une mission par son ID
    static async getMissionById(id: string) {
        return handlePrismaOperation(async () => {
            return extendedPrisma.mission.findUnique({
                where: { id },
                include: {
                    assignedTo: true,
                    createdBy: true,
                    project: true
                }
            })
        })
    }
}