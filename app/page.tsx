import { AuthenticatedLanding } from '@/components/landing/authenticated-landing'
import { UnauthenticatedLanding } from '@/components/landing/unauthenticated-landing'
import { auth } from '@/lib/auth'

export default async function HomePage() {
  const session = await auth()

  // If user is authenticated, show ChatGPT-style home page
  if (session) {
    return <AuthenticatedLanding session={session} />
  }

  // Otherwise show marketing landing page
  return <UnauthenticatedLanding />
}
