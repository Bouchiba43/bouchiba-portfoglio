'use client'

import { motion } from 'framer-motion'
import { CalendarIcon, ClockIcon, TagIcon, ArrowRightIcon } from 'lucide-react'
import { useBlogPosts } from '@/app/hooks/useBlogPosts'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { SectionTransition } from '../ui/PageTransition'
import ParticleSystem from '../ui/ParticleSystem'
import MorphingShapes from '../ui/MorphingShapes'
import { GlassCard } from '../ui/InteractiveHover'

export default function Blog() {
  const { posts, loading } = useBlogPosts()
  
  const publishedPosts = posts.filter(post => post.published)

  if (loading) {
    return (
      <section id="blog" className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="space-y-4"
            >
              <div className="h-8 bg-gray-700 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-96 mx-auto"></div>
            </motion.div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="blog" className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent)] pointer-events-none"></div>
      
      {/* Particle System */}
      <ParticleSystem 
        theme="cyber"
        density={30}
        interactive={true}
        showConnections={false}
      />

      {/* Morphing Shapes */}
      <MorphingShapes 
        size={100} 
        color="#8b5cf6" 
        duration={6}
        position="absolute"
        className="top-20 right-20 opacity-20"
      />
      <MorphingShapes 
        size={80} 
        color="#f59e0b" 
        duration={5}
        position="absolute"
        className="bottom-32 left-16 opacity-20"
      />
      
      <div className="container mx-auto px-4">
        <SectionTransition delay={0} direction="up">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              <span className="section-title">Latest Insights</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Exploring DevOps practices, cloud technologies, and modern development workflows
            </p>
            <div className="mt-4 font-mono text-sm text-green-400 hidden md:block">
              <span className="text-gray-500">$</span> cat blog_posts.md | head -10
            </div>
          </div>
        </SectionTransition>
        
        {/* Blog Posts Carousel */}
        <div className="relative max-w-7xl mx-auto">
          <style jsx global>{`
            .blog-swiper .swiper-button-next,
            .blog-swiper .swiper-button-prev {
              color: rgb(59 130 246);
              background: rgba(17, 24, 39, 0.8);
              backdrop-filter: blur(12px);
              border: 1px solid rgba(59, 130, 246, 0.3);
              width: 50px;
              height: 50px;
              border-radius: 50%;
              margin-top: -25px;
              transition: all 0.3s ease;
            }
            
            .blog-swiper .swiper-button-next:hover,
            .blog-swiper .swiper-button-prev:hover {
              background: rgba(59, 130, 246, 0.2);
              transform: scale(1.1);
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
            }
            
            .blog-swiper .swiper-button-next:after,
            .blog-swiper .swiper-button-prev:after {
              font-size: 20px;
              font-weight: bold;
            }
            
            .blog-swiper .swiper-pagination-bullet {
              background: rgba(156, 163, 175, 0.5);
              opacity: 1;
              width: 12px;
              height: 12px;
              margin: 0 6px;
              transition: all 0.3s ease;
            }
            
            .blog-swiper .swiper-pagination-bullet-active {
              background: rgb(59 130 246);
              transform: scale(1.2);
              box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
            }
            
            .blog-swiper .swiper-pagination {
              bottom: -50px;
            }
            
            @media (max-width: 768px) {
              .blog-swiper .swiper-button-next,
              .blog-swiper .swiper-button-prev {
                width: 40px;
                height: 40px;
                margin-top: -20px;
              }
              
              .blog-swiper .swiper-button-next:after,
              .blog-swiper .swiper-button-prev:after {
                font-size: 16px;
              }
            }
          `}</style>
          
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={publishedPosts.length > 1}
            speed={800}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            className="blog-swiper pb-16"
          >
            {publishedPosts.map((post) => (
              <SwiperSlide key={post.id}>
                <motion.article
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="h-full"
                >
                  <GlassCard className="h-full">
                    <div className=" p-6 lg:p-8 h-[500px] text-white cursor-pointer transition-all duration-800 ease-in-out hover:border-blue-500/50  rounded-xl flex flex-col">
                      {/* Post Header */}
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <CalendarIcon size={14} />
                          {post.publishedAt.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon size={14} />
                          {post.readTime} min read
                        </div>
                      </div>
                      
                      {/* Post Title */}
                      <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 line-clamp-3 flex-grow">
                        {post.title}
                      </h3>
                      
                      {/* Post Excerpt */}
                      <p className="text-gray-300 mb-6 line-clamp-4 flex-grow">
                        {post.excerpt}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-blue-500/30 hover:bg-blue-600/30 transition-colors"
                          >
                            <TagIcon size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Read More Link */}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-mono text-sm transition-colors group mt-auto"
                      >
                        <span>Read more</span>
                        <ArrowRightIcon 
                          size={16} 
                          className="group-hover:translate-x-1 transition-transform duration-200" 
                        />
                      </Link>
                    </div>
                  </GlassCard>
                </motion.article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        {publishedPosts.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <div className="glass-card-strong p-8 max-w-md mx-auto">
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