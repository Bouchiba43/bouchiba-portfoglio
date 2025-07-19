'use client'

import { motion } from 'framer-motion'
import { ServerIcon, CloudIcon, CodeIcon, DatabaseIcon } from 'lucide-react'
import TerminalAnimation from '../ui/TerminalAnimation'
import Image from 'next/image'
import { useProfile } from '@/app/hooks/useProfile'

const stats = [
    { label: 'Years Experience', value: '3+', icon: CodeIcon },
    { label: 'Cloud Deployments', value: '50+', icon: CloudIcon },
    { label: 'Containers Orchestrated', value: '500+', icon: ServerIcon },
    { label: 'Infrastructure Projects', value: '3+', icon: DatabaseIcon },
]

export default function About() {
    const { avatarUrl } = useProfile()
    
    return (
        <section id="about" className="py-20 bg-gray-900">
            <div className="container mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-center text-white mb-12 font-mono"
                >
                    $ cat about.yaml
                </motion.h2>

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Professional Avatar & Terminal About Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Professional Avatar Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-center mb-8"
                        >
                            <div className="relative mx-auto w-24 h-24 md:w-32 md:h-32 mb-4">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-green-500 p-0.5">
                                    <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                                        <Image
                                            src={avatarUrl || "/uploads/ahmed-avatar.png"}
                                            alt="Ahmed Bouchiba - DevOps Engineer"
                                            width={120}
                                            height={120}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                </div>

                                {/* Online status */}
                                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                            </div>
                            <div className="font-mono text-green-400 text-sm">
                                $ status: online and ready to deploy! 🚀
                            </div>
                        </motion.div>

                        <div className="bg-black border border-green-500 rounded-lg p-6 font-mono">
                            <div className="text-green-400 text-sm">
                                <div className="mb-4">
                                    <span className="text-gray-500">$</span>{' '}
                                    kubectl describe pod/devops-engineer
                                </div>
                                <div className="pl-4 space-y-2">
                                    <div>
                                        <span className="text-blue-400">Name:</span> Passionate
                                        DevOps Engineer
                                    </div>
                                    <div>
                                        <span className="text-blue-400">Status:</span> Running
                                    </div>
                                    <div>
                                        <span className="text-blue-400">Experience:</span> 3+
                                        years
                                    </div>
                                    <div>
                                        <span className="text-blue-400">Specialization:</span>{' '}
                                        Cloud Infrastructure
                                    </div>
                                    <div>
                                        <span className="text-blue-400 text-lg font-semibold">Technologies</span>

                                        <div className="pl-4 mt-2">
                                            <div>
                                                <span className="text-blue-300 font-medium">Backend:</span>
                                                <ul className="list-disc list-inside pl-4">
                                                    <li>FastAPI</li>
                                                    <li>Go (Gin)</li>
                                                    <li>Express.js</li>
                                                </ul>
                                            </div>

                                            <div className="mt-3">
                                                <span className="text-blue-300 font-medium">Frontend:</span>
                                                <ul className="list-disc list-inside pl-4">
                                                    <li>Next.js (React)</li>
                                                </ul>
                                            </div>

                                            <div className="mt-3">
                                                <span className="text-blue-300 font-medium">DevOps & Cloud:</span>
                                                <ul className="list-disc list-inside pl-4">
                                                    <li>Docker, Kubernetes, Helm</li>
                                                    <li>Jenkins, GitHub Actions, ArgoCD</li>
                                                    <li>Terraform, Ansible</li>
                                                    <li>AWS, GCP, Azure</li>
                                                    <li>Monitoring & Observability (Prometheus, Grafana, Kiali, Istio)</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <TerminalAnimation />
                    </motion.div>

                    {/* About Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-gray-300 space-y-4">
                            <p className="text-lg leading-relaxed">
                                Passionate DevOps Engineer with expertise in building scalable,
                                reliable infrastructure using modern cloud-native technologies. I
                                specialize in automating deployment pipelines, orchestrating
                                containerized applications, and implementing Infrastructure as
                                Code.
                            </p>

                            <p className="leading-relaxed">
                                My experience spans across multi-cloud environments, where
                                I&apos;ve successfully designed and implemented CI/CD pipelines
                                that have reduced deployment times by 70% and increased system
                                reliability to 99.9% uptime.
                            </p>

                            <p className="leading-relaxed">
                                I&apos;m passionate about DevOps culture, infrastructure
                                automation, and helping teams achieve faster, more reliable
                                software delivery through modern practices and tooling.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center"
                                >
                                    <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-white">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}