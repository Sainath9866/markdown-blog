import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/utils/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    const user = await getCurrentUser()
    const { postId } = await params
    if(!user) return NextResponse.json({error : "Please sign in"})
    try {
        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId: postId,
                    userId: user.id,
                },
            },
        })

        if (existingLike) {
            // Unlike
            await prisma.like.delete({
                where: { id: existingLike.id },
            })
            return NextResponse.json({ liked: false })
        } else {
            // Like
            await prisma.like.create({
                data: {
                    postId: postId,
                    userId: user.id,
                },
            })
            return NextResponse.json({ liked: true })
        } }
        catch (error) {
            return NextResponse.json({ error: error })

        }
    }