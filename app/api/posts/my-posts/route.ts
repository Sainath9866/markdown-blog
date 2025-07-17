import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getCurrentUser();
        
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const posts = await prisma.post.findMany({
            where: {
                authorId: user.id,
            },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                authorId: true,
                author: {
                    select: { name: true, image: true },
                },
                _count: {
                    select: { comments: true, likes: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching user posts:", error);
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
} 