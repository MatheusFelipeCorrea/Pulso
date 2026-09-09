import { LegalDocumentLayout } from './LegalDocumentLayout'
import { privacyPolicyMeta, privacyPolicySections } from '@/content/legal/privacyPolicy'

export default function PrivacyPolicy() {
  return <LegalDocumentLayout meta={privacyPolicyMeta} sections={privacyPolicySections} />
}
