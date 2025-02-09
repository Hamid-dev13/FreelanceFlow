import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// GET /api/clients/[id] - Détail d'un client
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const headersList = await headers();
        const userId = headersList.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const client = await prisma.client.findUnique({
            where: {
                id: params.id,
                userId
            }
        });

        if (!client) {
            return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
        }

        return NextResponse.json(client);
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// PUT /api/clients/[id]
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const headersList = await headers();
        const userId = headersList.get("x-user-id");

        if (!userId) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { name, email, phone } = await req.json();

        // Validation des champs obligatoires
        if (!name || !email) {
            return NextResponse.json(
                { error: "Nom et email requis" },
                { status: 400 }
            );
        }

        // Vérifier si l'email existe déjà pour un autre client
        const existingClientEmail = await prisma.client.findFirst({
            where: {
                email,
                userId,
                NOT: {
                    id: params.id // Exclure le client actuel de la vérification
                }
            }
        });

        if (existingClientEmail) {
            return NextResponse.json(
                { error: "Cette adresse email est déjà attribuée à un autre client" },
                { status: 400 }
            );
        }

        // Vérifier si le téléphone existe déjà pour un autre client
        if (phone) {
            const existingClientPhone = await prisma.client.findFirst({
                where: {
                    phone,
                    userId,
                    NOT: {
                        id: params.id // Exclure le client actuel de la vérification
                    }
                }
            });

            if (existingClientPhone) {
                return NextResponse.json(
                    { error: "Ce numéro de téléphone est déjà attribué à un autre client" },
                    { status: 400 }
                );
            }
        }

        // Mise à jour du client
        const client = await prisma.client.update({
            where: {
                id: params.id,
                userId
            },
            data: {
                name,
                email,
                phone
            }
        });

        return NextResponse.json(client);
    } catch (error) {
        console.error("Erreur lors de la modification du client:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const headersList = await headers();
    const userId = headersList.get("x-user-id");

    if (!userId) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await prisma.client.delete({
        where: {
            id: params.id,
            userId
        }
    });

    return NextResponse.json({ success: true });
}