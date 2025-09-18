import Image from 'next/image'
import { Button } from '../ui/button'

export default function Header() {
  return (
    <header className="bg-[#0574ac] text-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-40 items-center justify-center rounded-lg bg-white font-bold">
            <Image alt="logo" src={'/logo.png'} width={200} height={100} />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Portal de Inscrições</h1>
            <p className="text-sm opacity-80">Processos seletivos e inscrições</p>
          </div>
        </div>
        <nav>
          <Button className="bg-white/10 px-6 py-5 hover:bg-white/20">Entrar</Button>
        </nav>
      </div>
    </header>
  )
}
