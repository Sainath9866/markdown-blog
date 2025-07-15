"use client"
import React from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link';
import { Button } from './ui/button';
import { Heart, MessageCircle } from 'lucide-react';

interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: {
        name: string | null;
        image: string | null;
    };
    _count: {
        comments: number;
        likes: number;
    };
}
export default function Postcard({ post, showfullContent = false }: { post: Post, showfullContent?: boolean }) {
    const liked = true;
    const likeloading = false;
    return (
        <div>
            <Card>
                <CardHeader>
                    <div className='flex items-center space-x-4'>
                        <Avatar>
                            <AvatarImage src={post.author.image || ""} />
                            <AvatarFallback>{post.author.name?.[0] || "A"}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">{post.author.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <CardTitle>
                        {
                            showfullContent ? (
                                post.title
                            ) : (
                                <Link href={`posts/${post.id}`} className='hover:underline'>
                                    {post.title}
                                </Link>
                            )
                        }
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{post.content}</p>
                </CardContent>
                <CardFooter className='flex items-center space-x-4'>
                    <Button variant={"ghost"}>
                        <Heart className={`h-4 w-4 ${likeloading ? "animate-pulse" : liked ? "fill-red-500 text-red-500" : ""}`}/>
                        <div>10</div>
                    </Button>
                    <Button variant={"ghost"}>
                        <MessageCircle className='h-4 w-4'></MessageCircle>
                        <div>20</div>
                    </Button>

                </CardFooter>
            </Card>
        </div>
    )
}

