import { FC, ReactElement } from 'react'
import cn from 'classnames'


interface InputGroupProps {
    className?: string
    value: string
    placeholder: string
    error: string | undefined
    type: string

    onChange: (e: any) => void
}

export const InputGroup: FC<InputGroupProps> = ({
    value,
    placeholder,
    error,
    type,
    className,
    onChange,
}): ReactElement => {
    return (
        <div className={className}>
            <input
                type={type}
                className={cn(
                    'w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white',
                    { 'border-red-500': error }
                )}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            <small className="font-medium text-red-600">{error}</small>
        </div>
    )
}
