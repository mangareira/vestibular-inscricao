import Image from 'next/image'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

export default function Header({
  setLoginProfile,
  isLogin,
}: {
  setLoginProfile: (open: boolean) => void
  isLogin: boolean
}) {
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
          {isLogin ? (
            <DropdownMenu>
              <DropdownMenuTrigger>Open</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              className="bg-white/10 px-6 py-5 hover:bg-white/20"
              onClick={() => setLoginProfile(true)}
            >
              Entrar
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
