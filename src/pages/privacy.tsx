import { Card, CardContent } from '@/components/ui/card'

export function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl space-y-8 px-4 py-16 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Legal data handling disclosure
        </p>
      </div>

      <Card>
        <CardContent className="prose prose-invert max-w-none p-6">
          <p>
            This Privacy Policy describes how CreatorOps Hub collects, uses, and shares your personal information when you use our services.
          </p>
          <h2 className="mt-6 text-lg font-semibold">Information we collect</h2>
          <p>
            We collect information you provide directly, including account details, content you create, and integration data (e.g., Google OAuth).
          </p>
          <h2 className="mt-6 text-lg font-semibold">How we use your information</h2>
          <p>
            We use your information to provide, maintain, and improve our services, to process transactions, and to communicate with you.
          </p>
          <h2 className="mt-6 text-lg font-semibold">Data sharing</h2>
          <p>
            We do not sell your personal information. We may share data with service providers who assist in operating our platform.
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            For privacy requests, contact us at privacy@creatorops.com
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
