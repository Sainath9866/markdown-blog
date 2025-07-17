"use client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./components/ThemeToggle";
import AuthButton from "@/components/AuthButton";
import Link from "next/link";
import { useEffect, useState } from "react";
import Postcard from "@/components/post-card";
import { ArrowRight, Pencil, MessageCircle, ThumbsUp, Sparkles, Users, Globe } from "lucide-react";
import ProtectedLink from "@/components/ProtectedLink";
import { motion } from "framer-motion";
import Image from "next/image";

interface FeaturedPost {
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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function LandingPage() {
  const [featuredPosts, setFeaturedPosts] = useState<FeaturedPost[]>([]);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const response = await fetch("/api/posts?limit=3");
        const data = await response.json();
        setFeaturedPosts(data);
      } catch (error) {
        console.error("Failed to fetch featured posts:", error);
      }
    };
    fetchFeaturedPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <motion.header 
        className="shadow-lg dark:shadow-white/20 backdrop-blur-sm bg-background/80 fixed w-full z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container flex justify-between p-4 items-center">
          <div className="text-2xl sm:text-4xl font-bold">
            <span className="text-primary">Markdown</span> Blog
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20">
        <motion.div 
          className="container px-4"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div 
            className="text-center space-y-8 max-w-4xl mx-auto"
            variants={fadeInUp}
          >
            <motion.h1 
              className="text-4xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-600 bg-clip-text text-transparent animate-gradient"
              variants={fadeInUp}
            >
              Share Your Stories with the World
            </motion.h1>
            <motion.p 
              className="text-xl sm:text-2xl text-muted-foreground"
              variants={fadeInUp}
            >
              Create beautiful blog posts with Markdown, engage with readers, and build your audience.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              variants={fadeInUp}
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <Link href="/blog">
                  Get Started <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <ProtectedLink href="/create" size="lg" variant="outline">
                Create Post <Sparkles className="ml-2" />
              </ProtectedLink>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section 
        className="py-16 bg-muted/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="container px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">1000+</div>
              <div className="text-muted-foreground mt-2">Active Writers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">5000+</div>
              <div className="text-muted-foreground mt-2">Blog Posts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">10K+</div>
              <div className="text-muted-foreground mt-2">Monthly Readers</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-20"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="container px-4">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-center mb-16"
            variants={fadeInUp}
          >
            Why Choose Our Platform?
          </motion.h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              className="bg-card p-8 rounded-xl shadow-lg feature-card relative overflow-hidden group"
              variants={fadeInUp}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
              <Globe className="w-12 h-12 text-primary mb-4 animate-float" />
              <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
              <p className="text-muted-foreground">Share your stories with readers from around the world.</p>
            </motion.div>
            <motion.div 
              className="bg-card p-8 rounded-xl shadow-lg feature-card relative overflow-hidden group"
              variants={fadeInUp}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
              <Users className="w-12 h-12 text-primary mb-4 animate-float" />
              <h3 className="text-xl font-semibold mb-2">Active Community</h3>
              <p className="text-muted-foreground">Engage with like-minded writers and readers.</p>
            </motion.div>
            <motion.div 
              className="bg-card p-8 rounded-xl shadow-lg feature-card relative overflow-hidden group"
              variants={fadeInUp}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
              <Sparkles className="w-12 h-12 text-primary mb-4 animate-float" />
              <h3 className="text-xl font-semibold mb-2">Beautiful Writing</h3>
              <p className="text-muted-foreground">Create stunning posts with Markdown formatting.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Posts Section */}
      <motion.section 
        className="py-20 bg-muted/50"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="container px-4">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-center mb-16"
            variants={fadeInUp}
          >
            Featured Posts
          </motion.h2>
          <motion.div 
            className="grid gap-8 max-w-5xl mx-auto"
            variants={fadeInUp}
          >
            {featuredPosts.map((post, index) => (
              <motion.div 
                key={post.id}
                variants={fadeInUp}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Postcard post={post} showfullContent={false} />
              </motion.div>
            ))}
          </motion.div>
          <motion.div 
            className="text-center mt-12"
            variants={fadeInUp}
          >
            <Button size="lg" variant="outline" asChild>
              <Link href="/blog">
                View All Posts <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-primary text-primary-foreground"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container px-4 text-center max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Start Writing?</h2>
          <p className="text-xl mb-8 opacity-90">Join our community of writers and readers today.</p>
          <Button size="lg" variant="secondary" className="hover:bg-secondary/90" asChild>
            <Link href="/blog">
              Start Your Journey <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </motion.section>

    </div>
  );
}
