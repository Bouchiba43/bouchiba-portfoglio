'use client'

import { motion } from 'framer-motion'
import { CalendarIcon, ClockIcon, TagIcon } from 'lucide-react'
import { useBlogPosts } from '@/app/hooks/useBlogPosts'
import Link from 'next/link'

export default function Blog() {
  const { posts, loading } = useBlogPosts()
  
  const publishedPosts = posts.filter(post => post.published)

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">Loading blog posts...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="blog" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center text-white mb-12 font-mono"
        >
          $ cat blog_posts.md
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {publishedPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-black border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <CalendarIcon size={14} />
                    {post.publishedAt.toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon size={14} />
                    {post.readTime} min read
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <TagIcon size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
                
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-blue-400 hover:text-blue-300 font-mono text-sm transition-colors"
                >
                  Read more →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
        
        {publishedPosts.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <div className="bg-black border border-gray-700 rounded-lg p-8 max-w-md mx-auto">
              <div className="font-mono text-green-400 mb-4">$ ls blog/</div>
              <div className="text-gray-500">No posts found... yet!</div>
              <div className="text-sm mt-2">Check back soon for DevOps insights and tutorials.</div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}