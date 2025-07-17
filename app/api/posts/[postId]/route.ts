import { NextRequest,NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export async function GET(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { postId } = await params
    const id = postId
    console.log(postId)
    const post = await prisma.post.findUnique({
      where: { id},
      include: {
        author: {
          select: { name: true, image: true },
        },
        _count: {
          select: { comments: true, likes: true },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}