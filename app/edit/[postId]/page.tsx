"use client"
import React, { FormEvent, useState, useEffect, use } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from "next/navigation";
import { Eye } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import Loader from '@/components/ui/Loader';
import MarkdownRenderer from '@/components/markdown-renderer';
import { useSession } from 'next-auth/react';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

function EditPostPage({ params }: { params: Promise<{ postId: string }> }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [post, setPost] = useState<Post | null>(null);
  
  const { postId } = use(params);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        if (response.ok) {
          const postData = await response.json();
          setPost(postData);
          setTitle(postData.title);
          setContent(postData.content);
          
          // Check if user is the author
          if (session?.user?.id !== postData.authorId) {
            router.push('/');
            return;
          }
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
        router.push('/');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchPost();
  }, [postId, session?.user?.id, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, content })
      })
      if (response.ok) {
        router.push(`/post/${postId}`);
      }
    } catch (error) {
      console.error("Failed to update the post", error)
    } finally {
      setLoading(false);
    }
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className='min-h-screen bg-background'>
      <header className='shadow-md dark:shadow-white/20'>
        <div className='flex p-5 ml-5'>
          <ArrowLeft className='mt-1 mr-2' />
          <Button className='cursor-pointer' onClick={() => { router.push("/") }}>
            Back to Home
          </Button>
        </div>
      </header>
      <main className='container mx-auto px-4 py-8'>
        <div className='max-w-3xl mx-auto'>
          <div className='flex items-center justify-between mb-4'>
            <h1 className='text-3xl font-bold'>Edit Post</h1>
            <Button className='cursor-pointer' variant={"outline"} onClick={() => setPreview(!preview)}>
              <Eye />
              {preview ? "Edit" : "Preview"}
            </Button>
          </div>
          <div className={`grid grid-cols-1 ${preview && "lg:grid-cols-2 gap-8"}`}>
            <Card >
              <CardHeader>
                <CardTitle>Edit Post</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='title'>Title</Label>
                    <Input
                      id='title'
                      value={title}
                      placeholder='Enter the title...'
                      onChange={(e) => setTitle(e.target.value)}
                      required />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='content'>Content(Markdown)</Label>
                    <Textarea
                      rows={20}
                      id='content'
                      className='min-h-60'
                      value={content}
                      required placeholder='Write the Content here...'
                      onChange={(e) => setContent(e.target.value)} />
                  </div>
                  {loading ? (
                    <div>
                      <div className='flex items-center justify-center'>
                        <Loader />
                      </div>
                      <div className='text-center mt-1'>
                        Updating...
                      </div>
                    </div>
                  ) : (
                    <Button type="submit" className="w-full my-4">
                      Update Post
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
            {
              preview && (
                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold">
                        {title || "Post Title"}
                      </h2>
                      <MarkdownRenderer
                        content={content || "Your content will appear here..."}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            }
          </div>
        </div>
      </main>
    </div>
  )
}

export default EditPostPage 