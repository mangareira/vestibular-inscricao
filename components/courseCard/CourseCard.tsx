import { Course } from '@/utils/types/course'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'

export default function CourseCard({ course, onApply }: { course: Course; onApply: () => void }) {
  return (
    <Card className="border-slate-100 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-4">
          <div className="text-lg font-semibold">{course.title}</div>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
            Vagas: {course.seats ?? '-'}
          </span>
        </CardTitle>
        <CardDescription>{course.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-4 flex items-center gap-3 text-sm text-slate-700">
          <div>
            <div className="text-muted-foreground text-xs">Início</div>
            <div className="font-medium">{course.startDate ?? '—'}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Preço</div>
            <div className="font-medium">
              {course.price === 0 ? 'Gratuito' : `R$ ${course.price?.toFixed(2)}`}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-3">
        <Button
          onClick={onApply}
          className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-emerald-700"
        >
          Inscrever-se
        </Button>
        <Button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
          Detalhes
        </Button>
      </CardFooter>
    </Card>
  )
}
