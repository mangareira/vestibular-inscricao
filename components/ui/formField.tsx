import { HTMLInputTypeAttribute, ReactNode, forwardRef } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

type FormFieldProps = {
  label: string
  required?: boolean
  type?: HTMLInputTypeAttribute
  name?: string
  children?: ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, type = 'text', name, children, required = false, ...props }, ref) => {
    return (
      <div className="grid gap-3">
        <Label htmlFor={name} className="text-muted-foreground">
          {label} {required ? <span className="text-red-600">*</span> : null}
        </Label>
        {children ? children : <Input id={name} name={name} type={type} ref={ref} {...props} />}
      </div>
    )
  }
)

FormField.displayName = 'FormField'
