export type FooterBranchInfoSection = {
  title: string
  field: string
  html: string
}

export type FooterSocial = {
  instagram: string | null
  facebook: string | null
  line: string | null
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
  social: FooterSocial | null
}

export type FooterContact = FooterSocial & {
  email: string | null
  kinnestGroup: string | null
}
