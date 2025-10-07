import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { CheckCircle2 } from 'lucide-react'

interface PaymentTypeCardProps {
  title: string
  description: string
  selected: boolean
  onSelect: () => void
  price: number
}

export function PaymentTypeCard({
  title,
  description,
  selected,
  onSelect,
  price,
}: PaymentTypeCardProps) {
  return (
    <Card
      onClick={onSelect}
      className={`w-full cursor-pointer border-2 transition-all ${
        selected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
      }`}
    >
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          {selected && <CheckCircle2 className="text-emerald-500" />}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-end">
        <div className="text-lg font-medium">
          {price === 0 ? 'Gratuito' : `R$ ${price?.toFixed(2)}`}
        </div>
      </CardContent>
    </Card>
  )
}
