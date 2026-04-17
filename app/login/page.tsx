'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { BookOpen, Github, Chrome } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'

function LoginContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'
  const error = searchParams.get('error')

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary">
            <BookOpen className="size-8 text-primary-foreground" />
          </div>
          <CardTitle className="font-serif text-2xl">Welcome to Scripture Connect</CardTitle>
          <CardDescription>
            Sign in to join our community of believers exploring Scripture together
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
              {error === 'OAuthSignin' && 'Error starting authentication. Please try again.'}
              {error === 'OAuthCallback' && 'Error during authentication. Please try again.'}
              {error === 'OAuthAccountNotLinked' &&
                'This email is already linked to another account.'}
              {error === 'Default' && 'An error occurred. Please try again.'}
            </div>
          )}

          <Button
            variant="outline"
            className="w-full gap-3 py-6"
            onClick={() => signIn('google', { callbackUrl })}
          >
            <Chrome className="size-5" />
            Continue with Google
          </Button>

          <Button
            variant="outline"
            className="w-full gap-3 py-6"
            onClick={() => signIn('github', { callbackUrl })}
          >
            <Github className="size-5" />
            Continue with GitHub
          </Button>

          <Button
            variant="outline"
            className="w-full gap-3 py-6"
            onClick={() => signIn('apple', { callbackUrl })}
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
            </svg>
            Continue with Apple
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
