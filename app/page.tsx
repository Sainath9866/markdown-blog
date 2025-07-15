"use client"
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/AuthButton";
import Loader from "@/components/ui/Loader";
import { useState } from "react";
import { dummyPosts } from "@/dummpy-posts";
import Postcard from "@/components/post-card";

interface post {
  id: string,
  title: string,
  content: string,
  createdAt: string,
  author: {
    name: string | null,
    image: string | null
  }
  _count: {
    comments: number,
    likes: number
  }
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const posts = dummyPosts;
  //const [posts, setPosts] = useState<post[]>([]);
  return (
    <div className=" min-h-screen ">
      <header className="border-1 shadow-lg ">
        <div className="container flex justify-between p-4 items-center">
          <div className="text-4xl font-bold ml-[100px]">
            Simple Blog
          </div>
          <div className="flex items-center mr-[100px]">
            <Button className="cursor-pointer ml-4">
              <Link href="/create" className="flex">
                <PlusCircle className="h-4 w-4 mt-0.5 " />
                <div className="pl-1"> New Post</div>
              </Link>
            </Button>
            <AuthButton />
          </div>
        </div>
      </header>
      <main className="container px-4 py-16">
        <div className="text-center items-center">
          <h1 className="font-bold text-4xl mb-4">Welcome to Simple Blog</h1>
          <p className="text-2xl text-muted-foreground ">A clean, functional blog focused on great content.</p>
        </div>
        {
          isLoading ? (
            <Loader />
          ) : (
            <div>
              {
                posts.map((post) => (
                  <div className="mx-[250px] my-[30px]">
                    <Postcard key={post.id} post={post}/>
                  </div>
                ))
              }
            </div>
          )
        }
      </main>
    </div>
  );
}
