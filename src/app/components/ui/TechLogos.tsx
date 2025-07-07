'use client'

import Image from 'next/image'

interface LogoProps {
  className?: string;
  color?: string;
}

export function DockerLogo({ className = "w-12 h-12" }: LogoProps) {
  return (
    <Image
      src="/logos/docker.svg"
      alt="Docker Logo"
      width={48}
      height={48}
      className={className}
    />
  );
}

export function KubernetesLogo({ className = "w-12 h-12" }: LogoProps) {
  return (
    <Image
      src="/logos/kubernetes.svg"
      alt="Kubernetes Logo"
      width={48}
      height={48}
      className={className}
    />
  );
}

export function AWSLogo({ className = "w-12 h-12" }: LogoProps) {
  return (
    <Image
      src="/logos/aws.svg"
      alt="AWS Logo"
      width={48}
      height={48}
      className={className}
    />
  );
}

export function JenkinsLogo({ className = "w-12 h-12" }: LogoProps) {
  return (
    <Image
      src="/logos/jenkins.svg"
      alt="Jenkins Logo"
      width={48}
      height={48}
      className={className}
    />
  );
}

export function HelmLogo({ className = "w-12 h-12" }: LogoProps) {
  return (
    <Image
      src="/logos/helm.svg"
      alt="Helm Logo"
      width={48}
      height={48}
      className={className}
    />
  );
}

export function GoLogo({ className = "w-12 h-12" }: LogoProps) {
  return (
    <Image
      src="/logos/go.svg"
      alt="Go Logo"
      width={48}
      height={48}
      className={className}
    />
  );
}

export function FastAPILogo({ className = "w-12 h-12" }: LogoProps) {
  return (
    <Image
      src="/logos/fastapi.svg"
      alt="FastAPI Logo"
      width={48}
      height={48}
      className={className}
    />
  );
}

export function LinuxLogo({ className = "w-12 h-12" }: LogoProps) {
  return (
    <Image
      src="/logos/linux.svg"
      alt="Linux Logo"
      width={48}
      height={48}
      className={className}
    />
  );
}

export function NextJSLogo({ className = "w-12 h-12" }: LogoProps) {
  return (
    <Image
      src="/logos/nextjs.svg"
      alt="Next.js Logo"
      width={48}
      height={48}
      className={className}
    />
  );
}