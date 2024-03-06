export type Section = {
  id: string
  title: string
  icon: () => React.JSX.Element
  href: string
}

export type Sections = Section[]
