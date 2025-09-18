import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react'
import { Input } from '../ui/input'
import { withMask } from 'use-mask-input'

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, onChange, onBlur, name, value, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    useEffect(() => {
      if (inputRef.current) {
        withMask(mask)(inputRef.current)
      }
    }, [mask])

    useEffect(() => {
      if (inputRef.current && value !== undefined) {
        inputRef.current.value = value as string
      }
    }, [value])

    return (
      <Input
        ref={inputRef}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        {...props}
      />
    )
  }
)

MaskedInput.displayName = 'MaskedInput'
