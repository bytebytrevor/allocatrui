import type { Project } from "./project"

export type AllocatProfile = {
    id: string,
    fullName: string,
    IdNumber: string,
    email: string,
    bio: string,
    headline: string,
    title: string
    skills: string[],
    rating: number,
    ratingCount: number,
    completedProjects: number,
    availability: boolean,
    verified: boolean,
    location: string,
    hourlyRate: number,
    currency: string,
    responseTime: number,
    level: number,
    yearsExperience: number,
    professionalScore: number,
    joinedAt: string
    projects: Project[]
}