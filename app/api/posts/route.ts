import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/utils/auth";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: { name: true, image: true },
                },
                _count: {
                    select: { comments: true, likes: true },
                },
            },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json(posts)
    } catch {
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
    }
}
export async function POST(request: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { title, content } = await request.json();
        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: user.id,
            },
            include: {
                author: {
                    select: { name: true, image: true },
                },
            },
        })
        return NextResponse.json(post)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
    }

}