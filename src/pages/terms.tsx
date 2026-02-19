import { Card, CardContent } from '@/components/ui/card'

export function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl space-y-8 px-4 py-16 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold">Terms of Service</h1>
        <p className="text-muted-foreground">
          Legal terms and user obligations
        </p>
      </div>

      <Card>
        <CardContent className="prose prose-invert max-w-none p-6">
          <p>
            By using CreatorOps Hub, you agree to these Terms of Service. Please read them carefully.
          </p>
          <h2 className="mt-6 text-lg font-semibold">Acceptance</h2>
          <p>
            By creating an account or using our services, you acknowledge that you have read, understood, and agree to be bound by these terms.
          </p>
          <h2 className="mt-6 text-lg font-semibold">Use of service</h2>
          <p>
            You agree to use the service only for lawful purposes and in accordance with these terms. You are responsible for maintaining the confidentiality of your account.
          </p>
          <h2 className="mt-6 text-lg font-semibold">Content</h2>
          <p>
            You retain ownership of content you create. By using our platform, you grant us a license to process and store your content as necessary to provide our services.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
