"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import Postcard from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorId: string;
  author: {
    name: string | null;
    image: string | null;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

export default function MyPostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/");
      return;
    }

    fetchMyPosts();
  }, [session, status, router]);

  const fetchMyPosts = async () => {
    try {
      const response = await fetch("/api/posts/my-posts");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <header className="shadow-lg dark:shadow-white/20">
        <div className="container flex items-center p-4">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">My Posts</h1>
        </div>
      </header>

      <main className="container px-4 py-12">
        {isLoading ? (
          <div>
            <div className="flex justify-center mt-24">
              <Loader />
            </div>
            <div className="text-center mt-3">Loading your posts...</div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-4">No posts yet</h2>
                <p className="text-muted-foreground mb-6">
                  You have not created any posts yet. Start sharing your thoughts!
                </p>
                <Button asChild>
                  <Link href="/create">Create Your First Post</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    {posts.length} post{posts.length !== 1 ? "s" : ""} found
                  </p>
                </div>
                <div className="space-y-8">
                  {posts.map((post) => (
                    <Postcard key={post.id} post={post} showfullContent={false} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
} 