export type FooterBranchInfoSection = {
  title: string
  field: string
  html: string
}

export type FooterBranchItem = {
  id: number
  slug: string
  name: string
  tel: string | null
  footerBg: string | null
  footerColor: string | null
  logo: { src: string; alt: string } | null
  infoSections: FooterBranchInfoSection[]
}

export type FooterContact = {
  email: string | null
  kinnestGroup: string | null
  instagram: string | null
  facebook: string | null
  line: string | null
}
