'use client'

import { motion } from 'framer-motion'
import { BriefcaseIcon, CalendarIcon, MapPinIcon, ExternalLinkIcon } from 'lucide-react'
import { useExperiences } from '@/app/hooks/useExperiences'
import Image from 'next/image'

export default function Experience() {
    const { experiences, loading } = useExperiences()

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
        })
    }

    const calculateDuration = (startDate: Date, endDate?: Date | null) => {
        const start = new Date(startDate)
        const end = endDate ? new Date(endDate) : new Date()
        
        const diffTime = Math.abs(end.getTime() - start.getTime())
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
        
        if (diffMonths < 12) {
            return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`
        }
        
        const years = Math.floor(diffMonths / 12)
        const remainingMonths = diffMonths % 12
        
        if (remainingMonths === 0) {
            return `${years} year${years !== 1 ? 's' : ''}`
        }
        
        return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
    }

    if (loading) {
        return (
            <section id="experience" className="py-20 bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center text-white">
                        <div className="font-mono">$ loading experience...</div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section id="experience" className="py-20 bg-gray-800">
            <div className="container mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-center text-white mb-12 font-mono"
                >
                    $ cat experience.log
                </motion.h2>

                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-500"></div>

                        {experiences.map((experience, index) => (
                            <motion.div
                                key={experience.id}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative pl-20 pb-12 last:pb-0"
                            >
                                {/* Timeline dot */}
                                <div className="absolute left-6 top-4 w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-800"></div>

                                {/* Experience card */}
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            {experience.logoUrl && (
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white p-1">
                                                    <Image
                                                        src={experience.logoUrl}
                                                        alt={`${experience.company} logo`}
                                                        width={48}
                                                        height={48}
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-xl font-bold text-white">
                                                    {experience.position}
                                                </h3>
                                                <div className="flex items-center gap-2 text-blue-400">
                                                    <BriefcaseIcon size={16} />
                                                    {experience.companyUrl ? (
                                                        <a
                                                            href={experience.companyUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:text-blue-300 flex items-center gap-1"
                                                        >
                                                            {experience.company}
                                                            <ExternalLinkIcon size={14} />
                                                        </a>
                                                    ) : (
                                                        experience.company
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {experience.isCurrentRole && (
                                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                Current
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-6 text-gray-400 text-sm mb-4">
                                        <div className="flex items-center gap-1">
                                            <CalendarIcon size={14} />
                                            <span>
                                                {formatDate(experience.startDate)} - {' '}
                                                {experience.isCurrentRole ? 'Present' : formatDate(experience.endDate!)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>•</span>
                                            <span>{calculateDuration(experience.startDate, experience.endDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPinIcon size={14} />
                                            <span>{experience.location}</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-300 mb-4 leading-relaxed">
                                        {experience.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {experience.technologies.map((tech) => (
                                            <span
                                                key={tech}
                                                className="bg-gray-800 border border-gray-600 text-blue-400 px-3 py-1 rounded-full text-sm"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {experiences.length === 0 && (
                        <div className="text-center text-gray-400 py-8">
                            <div className="font-mono">$ find /career -name &quot;*.experience&quot;</div>
                            <div className="mt-2">No experience records found.</div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}