export default function Header() {
  return (
    <header className="bg-emerald-800 text-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 font-bold">
            U
          </div>
          <div>
            <h1 className="text-lg font-semibold">Portal de Inscrições</h1>
            <p className="text-sm opacity-80">Processos seletivos e inscrições</p>
          </div>
        </div>
        <nav>
          <button className="rounded-md bg-white/10 px-3 py-2 hover:bg-white/20">Entrar</button>
        </nav>
      </div>
    </header>
  )
}
