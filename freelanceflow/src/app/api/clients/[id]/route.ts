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

// PUT /api/clients/[id] - Modifier un client
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
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// DELETE /api/clients/[id] - Supprimer un client
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
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
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}