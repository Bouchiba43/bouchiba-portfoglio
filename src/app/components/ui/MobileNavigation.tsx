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

// components/ui/MobileNavigation.tsx

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
				className="fixed top-4 left-4 z-50 md:hidden bg-gray-900/80 backdrop-blur-sm border border-green-500/30 p-3 rounded-lg"
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
						className="fixed inset-0 bg-black/90 z-50 md:hidden"
					>
						<div className="flex flex-col h-full">
							{/* Header */}
							<div className="flex justify-between items-center p-4 border-b border-green-500/30">
								<h2 className="text-green-400 font-mono text-lg">
									$ navigation
								</h2>
								<button
									onClick={() => setIsOpen(false)}
									className="text-green-400 p-2"
								>
									<XIcon className="w-6 h-6" />
								</button>
							</div>

							{/* Navigation Items */}
							<nav className="flex-1 p-6">
								<motion.ul
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 }}
									className="space-y-6"
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
												className="block w-full text-left text-white text-xl font-mono hover:text-green-400 transition-colors py-2"
											>
												<span className="text-green-400">$ </span>
												{item.label.toLowerCase()}
											</button>
										</motion.li>
									))}
								</motion.ul>
							</nav>

							{/* Footer */}
							<div className="p-6 border-t border-green-500/30">
								<p className="text-gray-400 font-mono text-sm">
									<span className="text-green-400">user@portfolio:~$</span> exit
								</p>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}