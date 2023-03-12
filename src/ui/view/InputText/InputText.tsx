import React from "react"
import Theme from "../../theme"
import Style from "./InputText.module.css"
import { SpaceStyleProps, styleSpace } from "../../theme/styles/space"
import Label from "../Label"
import { ViewWithValue } from "../../types"

const $ = Theme.classNames

export type InputTextProps = ViewWithValue<string> & {
    className?: string
    placeholder?: string
    label?: string
    type?: "text" | "email" | "password" | "number"
    autofocus?: boolean
    maxWidth?: string
    validator?: RegExp | ((value: string) => boolean)
    onEnterKeyPressed?(value: string): void
} & SpaceStyleProps

export default function InputText(props: InputTextProps) {
    const {
        className,
        placeholder,
        value,
        label,
        autofocus = false,
        onChange,
        onEnterKeyPressed,
        type = "text",
        maxWidth,
        validator,
    } = props
    const [invalid, setInvalid] = React.useState(false)
    const [text, setText] = React.useState(value)
    const handleKeydown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (invalid) return

        if (evt.key === "Enter") {
            onEnterKeyPressed?.(text)
        }
    }
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value
        setInvalid(false)
        if (validator) {
            if (validator instanceof RegExp) {
                validator.lastIndex = -1
                if (!validator.test(value)) {
                    setInvalid(true)
                    return
                }
            } else if (typeof validator === "function") {
                setInvalid(!validator(value))
            }
        }
        setText(value)
    }
    React.useEffect(() => {
        onChange?.(text)
    }, [text])
    const style: React.CSSProperties = {
        ...styleSpace(props),
    }
    if (maxWidth) style.maxWidth = maxWidth
    const input = (
        <input
            className={$.join(
                className,
                Style.InputText,
                invalid && Style.invalid
            )}
            style={style}
            autoFocus={autofocus}
            placeholder={placeholder}
            type={type}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeydown}
        />
    )
    return label ? <Label value={label}>{input}</Label> : input
}
