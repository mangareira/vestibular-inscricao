'use client'
import CourseList from '@/components/courseList/CourseList'
import Header from '@/components/header/header'
import LoginModal from '@/components/LoginModal/Modal'
import SignupModal from '@/components/SignupModal/Modal'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Course } from '@/utils/types/course'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PaymentCardModal from '@/components/PaymentCard/Modal'
import { Course as TypeCourse } from '../generated/prisma'
import PaymentTypeModal from '@/components/PaymentTypeModal/Modal'

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
  const [subscribe, setSubscribe] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isLogin, SetIsLogin] = useState(false)
  const [payment, setPayment] = useState<TypeCourse | null>(null)

  const filtered = sampleCourses.filter((c) =>
    (c.title + ' ' + c.subtitle).toLowerCase().includes(query.toLowerCase())
  )
  const MotionCard = motion.create(Card)

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
      {selectedCourse ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedCourse(null)}
          ></div>
          <MotionCard
            layout
            className="relative z-10 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <AnimatePresence mode="wait">
              {isLogin ? (
                <>
                  {payment != null ? (
                    <PaymentTypeModal
                      payment={payment}
                      onClose={() => setSelectedCourse(null)}
                      course={selectedCourse}
                    />
                  ) : (
                    <PaymentCardModal
                      course={selectedCourse}
                      onClose={() => setSelectedCourse(null)}
                      setPayment={setPayment}
                    />
                  )}
                </>
              ) : (
                <>
                  {subscribe ? (
                    <motion.div
                      key="login-modal"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <LoginModal
                        isSubscribe={() => setSubscribe(false)}
                        course={selectedCourse}
                        onClose={() => setSelectedCourse(null)}
                        isLogin={() => SetIsLogin(true)}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signup-modal"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <SignupModal
                        isSubscribe={() => setSubscribe(true)}
                        course={selectedCourse}
                        onClose={() => setSelectedCourse(null)}
                      />
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
          </MotionCard>
        </div>
      ) : null}
    </>
  )
}
