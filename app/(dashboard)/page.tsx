'use client'
import CourseList from '@/components/courseList/CourseList'
import Header from '@/components/header/header'
import SignupModal from '@/components/SignupModal/Modal'
import { Input } from '@/components/ui/input'
import { Course } from '@/utils/types/course'
import React, { useState } from 'react'

const sampleCourses: Course[] = [
  {
    id: 'c1',
    title: 'Técnico em Informática',
    subtitle: 'Presencial - 700 horas',
    seats: 120,
    price: 40,
    startDate: '2025-10-03',
  },
  {
    id: 'c2',
    title: 'Administração',
    subtitle: 'EAD - 1800 horas',
    seats: 80,
    price: 0,
    startDate: '2025-11-01',
  },
  {
    id: 'c3',
    title: 'Engenharia Civil',
    subtitle: 'Presencial - Bacharelado',
    seats: 40,
    price: 0,
    startDate: '2026-03-15',
  },
  {
    id: 'c4',
    title: 'Técnico em Informática',
    subtitle: 'Presencial - 700 horas',
    seats: 120,
    price: 40,
    startDate: '2025-10-03',
  },
  {
    id: 'c5',
    title: 'Administração',
    subtitle: 'EAD - 1800 horas',
    seats: 80,
    price: 0,
    startDate: '2025-11-01',
  },
  {
    id: 'c6',
    title: 'Engenharia Civil',
    subtitle: 'Presencial - Bacharelado',
    seats: 40,
    price: 0,
    startDate: '2026-03-15',
  },
]

export default function Page() {
  const [query, setQuery] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const filtered = sampleCourses.filter((c) =>
    (c.title + ' ' + c.subtitle).toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Cursos Disponíveis</h2>
            <p className="text-muted-foreground text-sm">Escolha um curso e faça sua inscrição.</p>
          </div>

          <div className="flex items-center gap-3">
            <Input
              aria-label="Pesquisar cursos"
              placeholder="Pesquisar curso..."
              className="border-slate-200 shadow-sm focus:ring-2 focus:ring-slate-300 focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <CourseList courses={filtered} onApply={(course) => setSelectedCourse(course)} />
      </main>

      <SignupModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </>
  )
}
