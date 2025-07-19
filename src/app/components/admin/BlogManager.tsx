'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, EditIcon, TrashIcon, SaveIcon, XIcon, EyeIcon, EyeOffIcon, CalendarIcon, ClockIcon, TagIcon } from 'lucide-react'
import { useBlogPosts } from '@/app/hooks/useBlogPosts'
import type { BlogPost } from '@/app/types'
import toast from 'react-hot-toast'

export default function BlogManager() {
  const { posts, loading, addPost, updatePost, deletePost } = useBlogPosts()
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [tagsInput, setTagsInput] = useState('')
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    tags: [],
    published: false,
    readTime: 5
  })

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      slug: '',
      tags: [],
      published: false,
      readTime: 5
    })
    setTagsInput('')
    setIsEditing(null)
    setShowAddForm(false)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({ 
      ...prev, 
      title,
      slug: generateSlug(title)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Parse tags from input string
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean)
    
    try {
      if (isEditing) {
        await updatePost(isEditing, { 
          ...formData, 
          tags,
          publishedAt: formData.published ? new Date() : undefined
        })
        toast.success('Blog post updated successfully!')
      } else {
        await addPost({ 
          ...formData, 
          tags,
          publishedAt: formData.published ? new Date() : new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        } as Omit<BlogPost, 'id'>)
        toast.success('Blog post added successfully!')
      }
      resetForm()
    } catch {
      toast.error('Failed to save blog post')
    }
  }

  const handleEdit = (post: BlogPost) => {
    setFormData(post)
    setTagsInput(post.tags.join(', '))
    setIsEditing(post.id)
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deletePost(id)
        toast.success('Blog post deleted successfully!')
      } catch {
        toast.error('Failed to delete blog post')
      }
    }
  }

  const togglePublish = async (post: BlogPost) => {
    try {
      await updatePost(post.id, {
        published: !post.published,
        publishedAt: !post.published ? new Date() : post.publishedAt
      })
      toast.success(`Blog post ${!post.published ? 'published' : 'unpublished'} successfully!`)
    } catch {
      toast.error('Failed to update blog post status')
    }
  }

  if (loading) {
    return (
      <div className="text-center text-white">
        <div className="font-mono">$ loading blog posts...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white font-mono">$ manage blog posts</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <PlusIcon size={16} />
          Add Post
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border border-gray-600 rounded-lg p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white font-mono">
              {isEditing ? '$ edit post' : '$ add post'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white"
            >
              <XIcon size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="blog-post-slug"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Excerpt</label>
              <textarea
                required
                rows={2}
                value={formData.excerpt || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                placeholder="Brief description of the blog post..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="DevOps, Kubernetes, AWS"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Read Time (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={formData.readTime || 5}
                  onChange={(e) => setFormData(prev => ({ ...prev, readTime: parseInt(e.target.value) }))}
                  className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Content (Markdown)</label>
              <textarea
                required
                rows={12}
                value={formData.content || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:border-blue-500 focus:outline-none font-mono text-sm"
                placeholder="# Your Blog Post Title

Write your blog post content here using Markdown...

## Subheading

- Bullet points
- More content

```bash
# Code blocks
echo 'Hello World'
```"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.published || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="rounded border-gray-600 bg-gray-900 text-blue-600 focus:ring-blue-500"
                />
                <span>Publish immediately</span>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <SaveIcon size={16} />
                {isEditing ? 'Update Post' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Blog Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                  <div className="flex items-center gap-2">
                    {post.published ? (
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <EyeIcon size={12} />
                        Published
                      </span>
                    ) : (
                      <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs flex items-center gap-1">
                        <EyeOffIcon size={12} />
                        Draft
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <CalendarIcon size={12} />
                    {post.publishedAt.toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon size={12} />
                    {post.readTime} min read
                  </div>
                  <div className="flex items-center gap-1">
                    <TagIcon size={12} />
                    {post.tags.length} tags
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-gray-500 text-xs">+{post.tags.length - 3} more</span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(post)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors"
                  title="Edit post"
                >
                  <EditIcon size={16} />
                </button>
                <button
                  onClick={() => togglePublish(post)}
                  className={`p-2 rounded transition-colors ${
                    post.published 
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                  title={post.published ? 'Unpublish post' : 'Publish post'}
                >
                  {post.published ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                  title="Delete post"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          <div className="font-mono">$ ls blog/</div>
          <div className="mt-2">No blog posts found. Create your first post!</div>
        </div>
      )}
    </div>
  )
} 