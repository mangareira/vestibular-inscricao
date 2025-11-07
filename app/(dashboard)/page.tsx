'use client'
import CourseList from '@/components/courseList/CourseList'
import Header from '@/components/header/header'
import LoginModal from '@/components/LoginModal/Modal'
import SignupModal from '@/components/SignupModal/Modal'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Course } from '@/utils/types/course'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PaymentCardModal from '@/components/PaymentCard/Modal'
import { Course as TypeCourse } from '../generated/prisma'
import PaymentTypeModal from '@/components/PaymentTypeModal/Modal'
import LoginProfileModal from '@/components/LoginProfileModal/Modal'
import SignUpProfileModal from '@/components/SignupProfileModal/Modal'
import { useUserPayments } from '@/utils/hooks/useUserPayments'
import { sampleCourses } from '@/utils/constants/sampleCourses'

export default function Page() {
  const [query, setQuery] = useState('')
  const [subscribe, setSubscribe] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isLogin, setIsLogin] = useState(false)
  const [loginProfile, setLoginProfile] = useState<boolean>(false)
  const [subscribeProfile, setSubscribeProfile] = useState<boolean>(true)

  const { payments, setPayments } = useUserPayments(isLogin)

  useEffect(() => {
    if (!selectedCourse || !subscribe || !isLogin || !payments || !loginProfile) {
      if (typeof window !== 'undefined') {
        document.body.style.overflowY = 'scroll'
      }
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, loginProfile, JSON.stringify(payments), selectedCourse?.id, subscribe])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (document.cookie.split(';')[0].split('=')[1]) {
        setIsLogin(true)
      }
    }
  }, [])

  const filtered = sampleCourses.filter((c) =>
    (c.title + ' ' + c.subtitle).toLowerCase().includes(query.toLowerCase())
  )
  const MotionCard = motion.create(Card)

  const handleSetPayment = (courseId: string, payment: TypeCourse) => {
    setPayments((prev) => ({
      ...prev,
      [courseId]: payment, // guarda o pagamento desse curso
    }))
  }

  return (
    <>
      <Header setLoginProfile={setLoginProfile} isLogin={isLogin} />

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

        <CourseList
          courses={filtered}
          onApply={(course) => {
            setSelectedCourse(course)
          }}
        />
      </main>
      {loginProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setLoginProfile(false)}
          ></div>
          {subscribeProfile ? (
            <MotionCard
              layout
              className="relative z-10 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl"
              transition={{ duration: 0.35 }}
            >
              <LoginProfileModal
                onClose={() => setLoginProfile(false)}
                setLoginProfile={setLoginProfile}
                setIsLogin={setIsLogin}
                subscribeProfile={() => setSubscribeProfile(false)}
              />
            </MotionCard>
          ) : (
            <MotionCard
              layout
              className="relative z-10 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl"
              transition={{ duration: 0.35 }}
            >
              <SignUpProfileModal
                onClose={() => setLoginProfile(false)}
                subscribeProfile={() => setSubscribeProfile(true)}
              />
            </MotionCard>
          )}
        </div>
      )}
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
                  {payments[selectedCourse.id] != null ? (
                    <PaymentTypeModal
                      payment={payments[selectedCourse.id]}
                      onClose={() => setSelectedCourse(null)}
                      course={selectedCourse}
                      setPayments={setPayments}
                    />
                  ) : (
                    <PaymentCardModal
                      course={selectedCourse}
                      onClose={() => setSelectedCourse(null)}
                      setPayment={(payment) => handleSetPayment(selectedCourse.id, payment)}
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
                        isLogin={() => setIsLogin(true)}
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
