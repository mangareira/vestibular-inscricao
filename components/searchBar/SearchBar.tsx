export default function SearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Pesquisar cursos"
        className="rounded-md border border-slate-200 px-3 py-2"
      />
    </div>
  )
}
