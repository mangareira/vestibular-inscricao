import { Course } from '@/utils/types/course'
import CourseCard from '../courseCard/CourseCard'

export default function CourseList({
  courses,
  onApply,
}: {
  courses: Course[]
  onApply: (c: Course) => void
}) {
  if (courses.length === 0)
    return <div className="text-muted-foreground py-12 text-center">Nenhum curso encontrado.</div>

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((c) => (
        <CourseCard key={c.id} course={c} onApply={() => onApply(c)} />
      ))}
    </div>
  )
}
