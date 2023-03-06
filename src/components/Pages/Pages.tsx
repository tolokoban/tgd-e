import Theme from "../../ui/theme"
import Styles from "./Pages.module.css"
import State from "../../state"

const $ = Theme.classNames

export interface PagesProps {
    className?: string
    children: JSX.Element[]
}

export default function Pages({ className, children }: PagesProps) {
    const page = State.page.useValue()
    const component = children.find(child => child.key === page) ?? children[0]
    return <div className={$.join(Styles.Pages, className)}>{component}</div>
}
