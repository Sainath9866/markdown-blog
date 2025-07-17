import {prisma} from "@/lib/prisma"
import { getCurrentUser } from "@/lib/utils/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request : NextRequest, { params }: { params: Promise<{ postId: string }> }) {
    try {
        const {postId} = await params
        const comments = await prisma.comment.findMany({
            where : {postId},
            include : {
                author : {
                    select : {name : true, image : true},
                },
            },
            orderBy: { createdAt: "desc" },
        }) 
        return NextResponse.json(comments)
    } catch {
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  const user = await getCurrentUser()
  if(!user) {
    return NextResponse.json({error : "Please sign in to post the comment"})
  }
  try {
    const { postId } = await params
    const { content } = await request.json()

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: postId,
        authorId: user.id,
      },
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    })

    return NextResponse.json(comment)
  } catch {
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}