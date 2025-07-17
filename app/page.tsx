"use client";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/AuthButton";
import Loader from "@/components/ui/Loader";
import { ThemeToggle } from "./components/ThemeToggle";
import { useEffect, useState } from "react";

import Postcard from "@/components/post-card";

interface post {
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

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="shadow-lg dark:shadow-white/20">
        <div className="container flex justify-between p-4 items-center">
          <div className="text-2xl sm:text-4xl font-bold ml-2 sm:ml-[100px]">
            Simple Blog
          </div>
          <div className="flex items-center mr-2 sm:mr-[100px] space-x-2">
            <ThemeToggle />
            <Button className="cursor-pointer">
              <Link href="/create" className="flex items-center">
                <PlusCircle className="h-4 w-4 mt-0.5" />
                <span className="pl-1 hidden sm:inline">New Post</span>
              </Link>
            </Button>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="container px-4 py-12 sm:py-16">
        <div className="text-center">
          <h1 className="font-bold text-2xl sm:text-4xl mb-4">
            Welcome to Simple Blog
          </h1>
          <p className="text-md sm:text-2xl text-muted-foreground">
            A clean, functional blog focused on great content.
          </p>
        </div>

        {isLoading ? (
          <div>
            <div className="flex justify-center mt-24">
              <Loader />
            </div>
            <div className="text-center mt-3">Fetching posts...</div>
          </div>
        ) : (
          <div className="mt-10 flex flex-col gap-8 items-center">
            {posts.map((post) => (
              <div
                key={post.id}
                className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%]"
              >
                <Postcard post={post} showfullContent={false} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
