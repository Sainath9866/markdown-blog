"use client"
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link';
import { Button } from './ui/button';
import { Heart, MessageCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns'
import MarkdownRenderer from './markdown-renderer';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
export default function Postcard({ post, showfullContent }: { post: Post, showfullContent?: boolean }) {
    const { data: session } = useSession()
    const [liked, setLiked] = useState(false);
    const [likecount, setLikecount] = useState(post._count.likes)
    const [likeloading, setLikeLoading] = useState(false);
    const content = showfullContent? post.content : post.content.slice(0, 200) + (post.content.length > 200 ? "..." : "")
    const router = useRouter()
    useEffect(() => {
        const fetchLikeStatus = async () => {
            if (!session?.user?.id) {
                setLikeLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/posts/${post.id}/like-status`);
                if (response.ok) {
                    const data = await response.json();
                    setLiked(data.liked);
                }
            } catch (error) {
                console.log("Failed to fetch like status:", error);
            } finally {
                setLikeLoading(false);
            }
        };

        fetchLikeStatus();
    }, [post.id, session?.user?.id]);

    const handleLike = async () => {
        if (!session) return;
        try {
            const response = await fetch(`api/posts/${post.id}/like`, {
                method: "POST"
            })
            const data = await response.json();
            setLiked(data.liked);
            setLikecount((prev) => (data.liked ? prev + 1 : prev - 1))
        } catch (error) {
            console.error("Failed to update the likes", error)
        }
    }

    const handleEdit = () => {
        router.push(`/edit/${post.id}`);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        
        try {
            const response = await fetch(`/api/posts/${post.id}`, {
                method: "DELETE"
            });
            
            if (response.ok) {
                // Refresh the page or redirect to home
                window.location.reload();
            } else {
                throw new Error("Failed to delete post");
            }
        } catch (error) {
            console.error("Failed to delete post:", error);
            alert("Failed to delete post. Please try again.");
        }
    };

    const isOwner = session?.user?.id === post.authorId;
    return (
        <div>
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-4'>
                            <Avatar>
                                <AvatarImage src={post.author.image || ""} />
                                <AvatarFallback>{post.author.name?.[0] || "A"}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium">{post.author.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {format(new Date(post.createdAt), "dd MMM yyyy")}
                                </p>
                            </div>
                        </div>
                        
                        {isOwner && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={handleEdit}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleDelete} className="text-red-600 dark:text-red-400">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                    <CardTitle>
                        {
                            showfullContent ? (
                                post.title
                            ) : (
                                <Link href={`post/${post.id}`} className='hover:underline'>
                                    {post.title}
                                </Link>
                            )
                        }
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <MarkdownRenderer content={content} />
                </CardContent>
                <CardFooter className='flex items-center space-x-4'>
                    <Button className='cursor-pointer' onClick={handleLike} variant={"ghost"}>
                        <Heart className={`h-4 w-4 ${likeloading ? "animate-pulse" : liked ? "fill-red-500 text-red-500" : ""}`} />
                        <div>{likecount}</div>
                    </Button>
                    <Button className='cursor-pointer' onClick={() => router.push(`/post/${post.id}`)} variant={"ghost"}>
                        <MessageCircle className='h-4 w-4'></MessageCircle>
                        <div>{post._count.comments}</div>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

