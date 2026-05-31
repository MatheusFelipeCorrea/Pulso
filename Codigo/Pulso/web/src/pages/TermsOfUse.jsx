import { LegalDocumentLayout } from './LegalDocumentLayout'
import { termsOfUseMeta, termsOfUseSections } from '@/content/legal/termsOfUse'

export default function TermsOfUse() {
  return <LegalDocumentLayout meta={termsOfUseMeta} sections={termsOfUseSections} />
}
