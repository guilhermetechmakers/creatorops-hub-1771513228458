import { Upload, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const mockAssets = [
  { id: '1', name: 'hero-image.png', type: 'image', size: '2.4 MB' },
  { id: '2', name: 'intro-video.mp4', type: 'video', size: '45 MB' },
  { id: '3', name: 'brand-guide.pdf', type: 'doc', size: '1.2 MB' },
]

export function FileLibraryPage() {
  return (
    <div className="space-y-6 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold">File Library</h1>
        <p className="text-muted-foreground">
          Central asset repository with versioning and fast delivery
        </p>
      </div>

      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="mb-2 font-medium">Drag and drop files here</p>
          <p className="mb-4 text-sm text-muted-foreground">
            or click to browse. Resumable uploads supported.
          </p>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload files
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Input placeholder="Search assets..." className="max-w-sm" />
        <Button variant="outline" size="icon">
          <FolderOpen className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockAssets.map((asset) => (
          <Card key={asset.id} className="overflow-hidden">
            <div className="aspect-video bg-secondary" />
            <CardContent className="p-3">
              <div className="truncate font-medium">{asset.name}</div>
              <div className="text-sm text-muted-foreground">{asset.size}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
