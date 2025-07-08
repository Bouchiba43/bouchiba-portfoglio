'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MenuIcon, XIcon } from 'lucide-react'

const navItems = [
	{ label: 'Home', href: '#home' },
	{ label: 'About', href: '#about' },
	{ label: 'Skills', href: '#skills' },
	{ label: 'Experience', href: '#experience' },
	{ label: 'Projects', href: '#projects' },
	{ label: 'Blog', href: '#blog' },
	{ label: 'Contact', href: '#contact' }
]

export default function MobileNavigation() {
	const [isOpen, setIsOpen] = useState(false)

	const scrollToSection = (href: string) => {
		const element = document.querySelector(href)
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' })
		}
		setIsOpen(false)
	}

	return (
		<>
			{/* Menu Button */}
			<button
				onClick={() => setIsOpen(true)}
				className="fixed top-4 left-4 z-50 md:hidden bg-gray-900/90 backdrop-blur-sm border border-green-500/30 p-3 rounded-lg shadow-lg hover:bg-gray-800/90 transition-all duration-300"
				aria-label="Open navigation menu"
			>
				<MenuIcon className="w-6 h-6 text-green-400" />
			</button>

			{/* Mobile Menu Overlay */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 md:hidden"
						onClick={() => setIsOpen(false)}
					>
						<motion.div
							initial={{ x: '-100%' }}
							animate={{ x: 0 }}
							exit={{ x: '-100%' }}
							transition={{ type: 'spring', stiffness: 300, damping: 30 }}
							className="flex flex-col h-full w-full max-w-sm bg-gray-900/95 backdrop-blur-lg border-r border-green-500/30 shadow-2xl"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Header */}
							<div className="flex justify-between items-center p-6 border-b border-green-500/30">
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
										<span className="text-white font-bold text-sm">BA</span>
									</div>
									<div>
										<h2 className="text-green-400 font-mono text-lg font-bold">
											Navigation
										</h2>
										<p className="text-gray-400 text-xs">DevOps Portfolio</p>
									</div>
								</div>
								<button
									onClick={() => setIsOpen(false)}
									className="text-green-400 p-2 hover:bg-white/10 rounded-lg transition-colors"
									aria-label="Close navigation menu"
								>
									<XIcon className="w-6 h-6" />
								</button>
							</div>

							{/* Navigation Items */}
							<nav className="flex-1 p-6 overflow-y-auto">
								<motion.ul
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 }}
									className="space-y-4"
								>
									{navItems.map((item, index) => (
										<motion.li
											key={item.label}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.1 + index * 0.1 }}
										>
											<button
												onClick={() => scrollToSection(item.href)}
												className="block w-full text-left text-white text-lg font-mono hover:text-green-400 transition-colors py-3 px-4 rounded-lg hover:bg-white/5 group"
											>
												<div className="flex items-center gap-3">
													<span className="text-green-400 group-hover:text-green-300 transition-colors">
														{String(index + 1).padStart(2, '0')}.
													</span>
													<span className="group-hover:translate-x-1 transition-transform">
														{item.label.toLowerCase()}
													</span>
												</div>
											</button>
										</motion.li>
									))}
								</motion.ul>
							</nav>

							{/* Footer */}
							<div className="p-6 border-t border-green-500/30">
								<div className="flex items-center justify-between">
									<div className="flex gap-3">
										<a
											href="https://github.com/Bouchiba43"
											target="_blank"
											rel="noopener noreferrer"
											className="glass-card p-2 hover:bg-white/10 text-gray-400 hover:text-white transition-colors rounded-lg"
										>
											<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
												<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
											</svg>
										</a>
										<a
											href="https://linkedin.com/in/bouchiba43"
											target="_blank"
											rel="noopener noreferrer"
											className="glass-card p-2 hover:bg-white/10 text-gray-400 hover:text-white transition-colors rounded-lg"
										>
											<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
												<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
											</svg>
										</a>
									</div>
									<p className="text-gray-400 font-mono text-xs">
										<span className="text-green-400">$</span> exit
									</p>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}