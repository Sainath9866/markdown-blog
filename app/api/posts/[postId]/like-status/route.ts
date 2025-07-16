import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/utils/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ liked: false })
    }

    const { postId } = await params

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: postId,
          userId: user.id,
        },
      },
    })

    return NextResponse.json({ liked: !!existingLike })
  } catch (error) {
    console.error("❌ Internal Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
