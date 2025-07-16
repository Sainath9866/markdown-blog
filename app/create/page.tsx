"use client"
import React, { FormEvent, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from "next/navigation";
import { Eye } from 'lucide-react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import Loader from '@/components/ui/Loader';
import MarkdownRenderer from '@/components/markdown-renderer';
function page() {
  const router = useRouter()
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handlesubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, content })
      })
      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to create the posts", error)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen bg-background'>
      <header className='shadow-md'>
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
            <h1 className='text-3xl font-bold'>Create a new Post</h1>
            <Button className='cursor-pointer' variant={"outline"} onClick={() => setPreview(!preview)}>
              <Eye />
              {preview ? "Edit" : "Preview"}
            </Button>
          </div>
          <div className={`grid grid-cols-1 ${preview && "lg:grid-cols-2 gap-8"}`}>
            <Card >
              <CardHeader>
                <CardTitle>Write Post</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlesubmit} className='space-y-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='title'>Title</Label>
                    <Input
                      id='title'
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
                      required placeholder='Write the Content here...'
                      onChange={(e) => setContent(e.target.value)} />
                  </div>
                  {loading ? (
                    <div>
                      <div className='flex items-center'>
                        <Loader />
                      </div>
                      <div className='text-center mt-1'>
                        Creating...
                      </div>
                    </div>
                  ) : (
                    <Button type="submit" className="w-full my-4">
                      Create Post
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

export default page
