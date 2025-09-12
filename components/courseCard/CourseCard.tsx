import { Course } from '@/utils/types/course'

export default function CourseCard({ course, onApply }: { course: Course; onApply: () => void }) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold">{course.title}</h3>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
            Vagas: {course.seats ?? '-'}
          </span>
        </div>
        <p className="text-muted-foreground mt-2 text-sm">{course.subtitle}</p>

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
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          onClick={onApply}
          className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-emerald-700"
        >
          Inscrever-se
        </button>
        <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
          Detalhes
        </button>
      </div>
    </article>
  )
}
