import Link from 'next/link'
import { AlertCircle, Home, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription className="mt-2">
            Something went wrong during the sign-in process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We encountered an error while processing your authentication. This might be due to:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>An expired or invalid authentication code</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>A network connectivity issue</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Third-party OAuth provider configuration</span>
            </li>
          </ul>

          <div className="space-y-2 pt-4">
            <Link href="/login" className="block">
              <Button className="w-full gap-2">
                <RotateCcw className="size-4" />
                Try Again
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full gap-2">
                <Home className="size-4" />
                Go Home
              </Button>
            </Link>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            If the problem persists, please contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
