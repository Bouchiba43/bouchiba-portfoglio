'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CalendarIcon, ClockIcon, TagIcon, ArrowLeftIcon } from 'lucide-react'
import { useBlogPosts } from '@/app/hooks/useBlogPosts'
import Link from 'next/link'
import type { BlogPost } from '@/app/types'

export default function BlogPostPage() {
  const params = useParams()
  const { posts, loading } = useBlogPosts()
  const [post, setPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    if (posts.length > 0 && params.slug) {
      const foundPost = posts.find(p => p.slug === params.slug)
      setPost(foundPost || null)
    }
  }, [posts, params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white font-mono">$ loading blog post...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="font-mono text-2xl mb-4">$ cat blog_post.md</div>
          <div className="text-gray-400">Blog post not found</div>
          <Link 
            href="/#blog" 
            className="text-blue-400 hover:text-blue-300 mt-4 inline-block"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="container mx-auto">
          <Link 
            href="/#blog" 
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeftIcon size={16} />
            Back to Blog
          </Link>
        </div>
      </header>

      {/* Blog Post Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-700 rounded-lg p-8 shadow-xl"
        >
          {/* Post Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-mono bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
              <div className="flex items-center gap-1">
                <CalendarIcon size={14} />
                {post.publishedAt.toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon size={14} />
                {post.readTime} min read
              </div>
            </div>

            <p className="text-lg text-gray-300 mb-6">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-blue-500/30 hover:bg-blue-600/30 transition-colors"
                >
                  <TagIcon size={12} />
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Post Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div 
              className="text-gray-300 leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              dangerouslySetInnerHTML={{ 
                __html: formatMarkdown(post.content) 
              }}
            />
          </div>

          {/* Post Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-700">
            <div className="text-center text-gray-400">
              <p className="mb-4">Written by Ahmed Seddik Bouchiba</p>
              <Link 
                href="/#blog" 
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                ← Back to Blog
              </Link>
            </div>
          </footer>
        </motion.article>
      </main>
    </div>
  )
}

// Enhanced markdown formatter with better code highlighting
function formatMarkdown(content: string): string {
  // First, protect code blocks from other transformations
  const codeBlocks: Array<{ id: string; lang: string; code: string }> = []
  content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const id = `CODE_BLOCK_${codeBlocks.length}`
    codeBlocks.push({ id, lang: lang || '', code })
    return id
  })

  // Process the content
  let formatted = content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-2"><span class="text-blue-400">#</span>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mt-10 mb-6 flex items-center gap-2"><span class="text-green-400">##</span>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mt-10 mb-6 flex items-center gap-2"><span class="text-purple-400">#</span>$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-gray-300 italic">$1</em>')
    
    // Inline code
    .replace(/`(.*?)`/g, '<code class="bg-gray-800 text-blue-300 px-2 py-1 rounded text-sm font-mono border border-gray-700 hover:bg-gray-700 transition-colors">$1</code>')
    
    // Lists
    .replace(/^- (.*$)/gim, '<li class="ml-6 mb-2 flex items-start gap-2"><span class="text-blue-400 mt-2">•</span><span>$1</span></li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 mb-2 flex items-start gap-2"><span class="text-green-400 mt-2">$&</span></li>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
    
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="mb-6 leading-relaxed">')
    .replace(/^(.+)$/gm, '<p class="mb-6 leading-relaxed">$1</p>')

  // Group list items
  formatted = formatted
    .replace(/(<li.*<\/li>)/gs, '<ul class="list-none space-y-2 my-6">$1</ul>')
    .replace(/(<li.*<\/li>)/gs, '<ol class="list-none space-y-2 my-6">$1</ol>')

  // Restore code blocks with enhanced formatting
  codeBlocks.forEach(({ id, lang, code }) => {
    const language = lang || 'text'
    const highlightedCode = highlightCode(code, language)
         const placeholder = `<div class="my-8 group">
       <div class="bg-gray-800 border border-gray-700 rounded-t-lg px-4 py-2 flex items-center justify-between">
         <div class="flex items-center gap-2">
           <div class="w-3 h-3 bg-red-500 rounded-full"></div>
           <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
           <div class="w-3 h-3 bg-green-500 rounded-full"></div>
         </div>
         <span class="text-gray-400 text-sm font-mono">${language}</span>
       </div>
       <pre class="bg-gray-900 border border-gray-700 rounded-b-lg p-6 overflow-x-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300 group-hover:border-blue-500/50 transition-colors"><code class="text-sm font-mono leading-relaxed">${highlightedCode}</code></pre>
     </div>`
    formatted = formatted.replace(id, placeholder)
  })

  return formatted
}

// Simple syntax highlighting
// Fixed syntax highlighting function
function highlightCode(code: string, language: string): string {
  const lines = code.split('\n')
  
  return lines.map(line => {
    let highlighted = line
    
    if (language === 'go') {
      // Step 1: Protect strings and comments from further processing
      const tokens: Array<{type: string, content: string, placeholder: string}> = []
      let tokenCounter = 0
      
      // Extract comments first
      highlighted = highlighted.replace(/\/\/.*/g, (match) => {
        const placeholder = `__COMMENT_${tokenCounter}__`
        tokens.push({type: 'comment', content: match, placeholder})
        tokenCounter++
        return placeholder
      })
      
      // Extract strings
      highlighted = highlighted.replace(/"[^"]*"/g, (match) => {
        const placeholder = `__STRING_${tokenCounter}__`
        tokens.push({type: 'string', content: match, placeholder})
        tokenCounter++
        return placeholder
      })
      
      highlighted = highlighted.replace(/'[^']*'/g, (match) => {
        const placeholder = `__STRING_${tokenCounter}__`
        tokens.push({type: 'string', content: match, placeholder})
        tokenCounter++
        return placeholder
      })
      
      highlighted = highlighted.replace(/`[^`]*`/g, (match) => {
        const placeholder = `__STRING_${tokenCounter}__`
        tokens.push({type: 'string', content: match, placeholder})
        tokenCounter++
        return placeholder
      })
      
      // Step 2: Apply syntax highlighting to remaining code
      // Numbers
      highlighted = highlighted.replace(/\b\d+(?:\.\d+)?\b/g, '<span class="text-orange-400">$&</span>')
      
      // Keywords
      highlighted = highlighted.replace(/\b(func|package|import|var|const|type|struct|interface|map|chan|go|defer|return|if|else|for|range|switch|case|default|select|break|continue|fallthrough)\b/g, '<span class="text-purple-400">$&</span>')
      
      // Types
      highlighted = highlighted.replace(/\b(string|int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|float32|float64|bool|error|nil|true|false|byte|rune)\b/g, '<span class="text-blue-400">$&</span>')
      
      // Built-in functions and packages
      highlighted = highlighted.replace(/\b(fmt|http|os|io|time|json|encoding|net|url|strings|strconv|bytes|bufio|log|flag|path|filepath|crypto|hash|compress|archive|context|sync|atomic|reflect|unsafe|runtime|debug|pprof|trace|testing|benchmark|example|main)\b/g, '<span class="text-green-400">$&</span>')
      
      // Function calls (word followed by opening parenthesis)
      highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="text-cyan-400">$1</span>')
      
      // Step 3: Restore protected tokens with styling
      tokens.forEach(token => {
        let styledContent = token.content
        if (token.type === 'comment') {
          styledContent = `<span class="text-gray-500">${token.content}</span>`
        } else if (token.type === 'string') {
          styledContent = `<span class="text-yellow-400">${token.content}</span>`
        }
        highlighted = highlighted.replace(token.placeholder, styledContent)
      })
      
    } else if (language === 'yaml') {
      const tokens: Array<{type: string, content: string, placeholder: string}> = []
      let tokenCounter = 0
      
      // Extract comments
      highlighted = highlighted.replace(/#.*/g, (match) => {
        const placeholder = `__COMMENT_${tokenCounter}__`
        tokens.push({type: 'comment', content: match, placeholder})
        tokenCounter++
        return placeholder
      })
      
      // Extract strings
      highlighted = highlighted.replace(/"[^"]*"/g, (match) => {
        const placeholder = `__STRING_${tokenCounter}__`
        tokens.push({type: 'string', content: match, placeholder})
        tokenCounter++
        return placeholder
      })
      
      highlighted = highlighted.replace(/'[^']*'/g, (match) => {
        const placeholder = `__STRING_${tokenCounter}__`
        tokens.push({type: 'string', content: match, placeholder})
        tokenCounter++
        return placeholder
      })
      
      // Numbers
      highlighted = highlighted.replace(/\b\d+(?:\.\d+)?\b/g, '<span class="text-orange-400">$&</span>')
      
      // Boolean values
      highlighted = highlighted.replace(/\b(true|false|yes|no|on|off)\b/g, '<span class="text-blue-400">$&</span>')
      
      // Kubernetes resources and fields
      highlighted = highlighted.replace(/\b(apiVersion|kind|metadata|spec|name|type|data|rules|match|allow|read|write|create|update|delete|resources|requests|limits|memory|cpu|containers|ports|env|volumeMounts|volumes|configMap|secret|service|deployment|pod|replicaSet|daemonSet|statefulSet|job|cronJob|ingress|networkPolicy|role|clusterRole|serviceAccount|namespace|node|persistentVolume|persistentVolumeClaim|storageClass|priorityClass|horizontalPodAutoscaler|verticalPodAutoscaler|podDisruptionBudget|resourceQuota|limitRange|endpoints|event|componentStatus|lease|runtimeClass|mutatingWebhookConfiguration|validatingWebhookConfiguration|customResourceDefinition|apiService|tokenReview|selfSubjectAccessReview|selfSubjectRulesReview|subjectAccessReview|localSubjectAccessReview|certificateSigningRequest|flowSchema|priorityLevelConfiguration)\b/g, '<span class="text-blue-400">$&</span>')
      
      // API versions
      highlighted = highlighted.replace(/\b(v1|apps\/v1|networking\.k8s\.io\/v1|rbac\.authorization\.k8s\.io\/v1|apiextensions\.k8s\.io\/v1|autoscaling\/v2|batch\/v1|scheduling\.k8s\.io\/v1|policy\/v1|admissionregistration\.k8s\.io\/v1|apiregistration\.k8s\.io\/v1|coordination\.k8s\.io\/v1|discovery\.k8s\.io\/v1|events\.k8s\.io\/v1)\b/g, '<span class="text-green-400">$&</span>')
      
      // Status values
      highlighted = highlighted.replace(/\b(Running|Pending|Succeeded|Failed|Unknown|Ready|NotReady|True|False)\b/g, '<span class="text-cyan-400">$&</span>')
      
      // Restore tokens
      tokens.forEach(token => {
        let styledContent = token.content
        if (token.type === 'comment') {
          styledContent = `<span class="text-gray-500">${token.content}</span>`
        } else if (token.type === 'string') {
          styledContent = `<span class="text-yellow-400">${token.content}</span>`
        }
        highlighted = highlighted.replace(token.placeholder, styledContent)
      })
      
    } else if (language === 'bash') {
      const tokens: Array<{type: string, content: string, placeholder: string}> = []
      let tokenCounter = 0
      
      // Extract comments
      highlighted = highlighted.replace(/#.*/g, (match) => {
        const placeholder = `__COMMENT_${tokenCounter}__`
        tokens.push({type: 'comment', content: match, placeholder})
        tokenCounter++
        return placeholder
      })
      
      // Extract strings
      highlighted = highlighted.replace(/"[^"]*"/g, (match) => {
        const placeholder = `__STRING_${tokenCounter}__`
        tokens.push({type: 'string', content: match, placeholder})
        tokenCounter++
        return placeholder
      })
      
      highlighted = highlighted.replace(/'[^']*'/g, (match) => {
        const placeholder = `__STRING_${tokenCounter}__`
        tokens.push({type: 'string', content: match, placeholder})
        tokenCounter++
        return placeholder
      })
      
      // Numbers
      highlighted = highlighted.replace(/\b\d+\b/g, '<span class="text-orange-400">$&</span>')
      
      // Common commands
      highlighted = highlighted.replace(/\b(kubectl|docker|helm|terraform|aws|gcloud|az|git|npm|yarn|go|python|node|curl|wget|ssh|scp|rsync|tar|gzip|gunzip|zip|unzip|chmod|chown|sudo|su|apt|apt-get|yum|dnf|brew|snap|systemctl|service|journalctl|ps|top|htop|free|df|du|ls|cd|pwd|mkdir|rmdir|cp|mv|rm|cat|less|more|head|tail|grep|sed|awk|find|xargs|sort|uniq|wc|cut|paste|join|split|tr|tee|echo|printf|read|export|unset|alias|unalias)\b/g, '<span class="text-purple-400">$&</span>')
      
      // kubectl subcommands
      highlighted = highlighted.replace(/\b(get|apply|create|delete|describe|logs|exec|port-forward|proxy|config|cluster-info|top|scale|rollout|patch|edit|expose|run|set|label|annotate|taint|cordon|uncordon|drain)\b/g, '<span class="text-green-400">$&</span>')
      
      // Kubernetes resources
      highlighted = highlighted.replace(/\b(pods?|services?|deployments?|replicasets?|daemonsets?|statefulsets?|jobs?|cronjobs?|configmaps?|secrets?|persistentvolumes?|persistentvolumeclaims?|storageclasses?|namespaces?|nodes?|serviceaccounts?)\b/g, '<span class="text-blue-400">$&</span>')
      
      // Restore tokens
      tokens.forEach(token => {
        let styledContent = token.content
        if (token.type === 'comment') {
          styledContent = `<span class="text-gray-500">${token.content}</span>`
        } else if (token.type === 'string') {
          styledContent = `<span class="text-yellow-400">${token.content}</span>`
        }
        highlighted = highlighted.replace(token.placeholder, styledContent)
      })
      
    } else {
      // Generic highlighting for other languages
      const tokens: Array<{type: string, content: string, placeholder: string}> = []
      let tokenCounter = 0
      
      // Extract strings
      highlighted = highlighted.replace(/"[^"]*"/g, (match) => {
        const placeholder = `__STRING_${tokenCounter}__`
        tokens.push({type: 'string', content: match, placeholder})
        tokenCounter++
        return placeholder
      })
      
      highlighted = highlighted.replace(/'[^']*'/g, (match) => {
        const placeholder = `__STRING_${tokenCounter}__`
        tokens.push({type: 'string', content: match, placeholder})
        tokenCounter++
        return placeholder
      })
      
      // Numbers
      highlighted = highlighted.replace(/\b\d+(?:\.\d+)?\b/g, '<span class="text-orange-400">$&</span>')
      
      // Restore strings
      tokens.forEach(token => {
        highlighted = highlighted.replace(token.placeholder, `<span class="text-yellow-400">${token.content}</span>`)
      })
    }

    return highlighted
  }).join('\n')
}