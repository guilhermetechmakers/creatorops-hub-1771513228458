import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Upload,
  Search,
  Grid3X3,
  List,
  MoreVertical,
  History,
  Pencil,
  Trash2,
  Link2,
  FileImage,
  FileVideo,
  FileText,
  Music,
  File,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import {
  listAssets,
  createAssetRecord,
  updateAssetMetadata,
  getAssetVersions,
  restoreVersion,
  deleteAsset,
  uploadFileToStorage,
  formatFileSize,
  getFileTypeCategory,
} from '@/services/file-library-service'
import type { FileLibraryAsset, FileLibraryVersion } from '@/types/database'
import { useAuth } from '@/hooks/use-auth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type ViewMode = 'grid' | 'list'

interface UploadProgress {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'done' | 'error'
  error?: string
}

function FileTypeIcon({ fileType, className }: { fileType: string; className?: string }) {
  const category = getFileTypeCategory(fileType)
  switch (category) {
    case 'image':
      return <FileImage className={className} aria-hidden />
    case 'video':
      return <FileVideo className={className} aria-hidden />
    case 'document':
      return <FileText className={className} aria-hidden />
    case 'audio':
      return <Music className={className} aria-hidden />
    default:
      return <File className={className} aria-hidden />
  }
}

function AssetCard({
  asset,
  viewMode,
  onEdit,
  onVersions,
  onDelete,
  onAttach,
}: {
  asset: FileLibraryAsset
  viewMode: ViewMode
  onEdit: (asset: FileLibraryAsset) => void
  onVersions: (asset: FileLibraryAsset) => void
  onDelete: (asset: FileLibraryAsset) => void
  onAttach: (asset: FileLibraryAsset) => void
}) {
  const isImage = getFileTypeCategory(asset.file_type) === 'image'

  return (
    <Card
      className={cn(
        'group overflow-hidden transition-all duration-300',
        'hover:shadow-card-hover hover:scale-[1.02]',
        viewMode === 'grid' ? 'aspect-square' : ''
      )}
    >
      <div className="relative">
        <div
          className={cn(
            'flex items-center justify-center bg-secondary/50',
            viewMode === 'grid' ? 'aspect-square' : 'h-24'
          )}
        >
          {isImage ? (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-secondary/70">
              <FileTypeIcon fileType={asset.file_type} className="h-12 w-12 text-muted-foreground" />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <FileTypeIcon fileType={asset.file_type} className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                aria-label={`Actions for ${asset.title}`}
              >
                <MoreVertical className="h-4 w-4" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onAttach(asset)}>
                <Link2 className="mr-2 h-4 w-4" />
                Quick attach
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onEdit(asset)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit metadata
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onVersions(asset)}>
                <History className="mr-2 h-4 w-4" />
                Version history
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onDelete(asset)} className="text-accent">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className={cn('p-3', viewMode === 'list' && 'flex flex-1 items-center gap-4')}>
        <div className={cn('min-w-0 flex-1', viewMode === 'list' && 'flex items-center gap-3')}>
          <p className="truncate font-medium" title={asset.title}>
            {asset.title}
          </p>
          <p className="text-sm text-muted-foreground">{formatFileSize(asset.file_size)}</p>
          {asset.tags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {asset.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {asset.tags.length > 3 && (
                <Badge variant="outline">+{asset.tags.length - 3}</Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function FileLibrary() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [uploads, setUploads] = useState<UploadProgress[]>([])
  const [editAsset, setEditAsset] = useState<FileLibraryAsset | null>(null)
  const [versionAsset, setVersionAsset] = useState<FileLibraryAsset | null>(null)
  const [deleteAssetState, setDeleteAssetState] = useState<FileLibraryAsset | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editTags, setEditTags] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const { data: assets = [], isLoading, error } = useQuery({
    queryKey: ['file-library', user?.id, search],
    queryFn: async () => {
      if (!user?.id) return []
      const { data, error: err } = await listAssets({
        search: search || undefined,
        limit: 100,
      })
      if (err) throw err
      return data ?? []
    },
    enabled: !!user?.id,
  })

  useEffect(() => {
    if (error) {
      toast.error('Failed to load file library. Please try again.', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    }
  }, [error])

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      if (!user?.id) throw new Error('Not authenticated')
      const results: { asset: FileLibraryAsset }[] = []
      for (const file of files) {
        setUploads((prev) =>
          prev.map((u) =>
            u.file === file ? { ...u, progress: 10, status: 'uploading' as const } : u
          )
        )
        const path = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
        const { error: uploadErr } = await uploadFileToStorage(path, file)
        if (uploadErr) throw uploadErr
        setUploads((prev) =>
          prev.map((u) =>
            u.file === file ? { ...u, progress: 80, status: 'uploading' as const } : u
          )
        )
        const { data, error: createErr } = await createAssetRecord({
          path,
          filename: file.name,
          fileType: file.type,
          fileSize: file.size,
          title: file.name,
        })
        if (createErr) throw createErr
        if (data) results.push(data)
        setUploads((prev) =>
          prev.map((u) =>
            u.file === file ? { ...u, progress: 100, status: 'done' as const } : u
          )
        )
      }
      return results
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file-library', user?.id] })
      toast.success('Files uploaded successfully')
      setUploads([])
    },
    onError: (err: Error) => {
      toast.error(err.message)
      setUploads((prev) =>
        prev.map((u) =>
          u.status === 'uploading' ? { ...u, status: 'error' as const, error: err.message } : u
        )
      )
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ assetId, updates }: { assetId: string; updates: { title?: string; description?: string; tags?: string[] } }) =>
      updateAssetMetadata(assetId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file-library', user?.id] })
      toast.success('Metadata updated')
      setEditAsset(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const restoreMutation = useMutation({
    mutationFn: ({ assetId, versionId }: { assetId: string; versionId: string }) =>
      restoreVersion(assetId, versionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file-library', user?.id] })
      toast.success('Version restored')
      setVersionAsset(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (assetId: string) => deleteAsset(assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file-library', user?.id] })
      toast.success('Asset archived')
      setDeleteAssetState(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      if (fileArray.length === 0) return
      setUploads(fileArray.map((f) => ({ file: f, progress: 0, status: 'pending' as const })))
      uploadMutation.mutate(fileArray)
    },
    [uploadMutation]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const openEditModal = (asset: FileLibraryAsset) => {
    setEditAsset(asset)
    setEditTitle(asset.title)
    setEditDescription(asset.description ?? '')
    setEditTags(asset.tags?.join(', ') ?? '')
  }

  const handleEditSubmit = () => {
    if (!editAsset) return
    updateMutation.mutate({
      assetId: editAsset.id,
      updates: {
        title: editTitle,
        description: editDescription || undefined,
        tags: editTags ? editTags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      },
    })
  }

  const handleAttach = (asset: FileLibraryAsset) => {
    toast.success(`Asset "${asset.title}" ready to attach`)
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5" role="alert">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-12">
          <p className="text-destructive">Failed to load file library. Please try again.</p>
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['file-library', user?.id] })}
            aria-label="Retry loading file library"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 animate-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">File Library</h1>
          <p className="text-muted-foreground">
            Central asset repository with versioning and fast delivery
          </p>
        </div>
      </div>

      <Card
        role="button"
        tabIndex={0}
        aria-label="Upload files by dropping or clicking to browse"
        className={cn(
          'cursor-pointer border-2 border-dashed transition-all duration-300',
          isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border hover:border-primary/50'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            fileInputRef.current?.click()
          }
        }}
      >
        <CardContent
          className="flex flex-col items-center justify-center py-16"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            aria-label="Select files to upload"
            onChange={(e) => {
              const files = e.target.files
              if (files) handleFiles(files)
              e.target.value = ''
            }}
          />
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="mb-2 font-medium">Drag and drop files here</p>
          <p className="mb-4 text-sm text-muted-foreground">
            or click to browse. Resumable uploads supported.
          </p>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
            disabled={uploadMutation.isPending}
            aria-label="Upload files"
          >
            {uploadMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="mr-2 h-4 w-4" aria-hidden />
            )}
            {uploadMutation.isPending ? 'Uploading...' : 'Upload files'}
          </Button>
        </CardContent>
      </Card>

      {uploads.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="mb-3 text-sm font-medium">Upload progress</h3>
            <div className="space-y-3">
              {uploads.map((u, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">{u.file.name}</span>
                    {u.status === 'done' && (
                      <span className="text-success">Done</span>
                    )}
                    {u.status === 'error' && (
                      <span className="text-accent">{u.error ?? 'Failed'}</span>
                    )}
                    {u.status === 'uploading' && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                  <Progress value={u.progress} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            placeholder="Search assets..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search assets"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div
          className={cn(
            'grid gap-4',
            viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'
          )}
          aria-busy="true"
          aria-label="Loading file library"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className={cn(viewMode === 'grid' && 'aspect-square')}>
              <div
                className={cn(
                  'flex items-center justify-center bg-card',
                  viewMode === 'grid' ? 'aspect-square' : 'h-24'
                )}
              >
                <Skeleton className="h-full w-full rounded-none" />
              </div>
              <CardContent className={cn('p-3', viewMode === 'list' && 'flex flex-1 items-center gap-4')}>
                <div className={cn('min-w-0 flex-1', viewMode === 'list' && 'flex items-center gap-3')}>
                  <Skeleton className="mb-2 h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Skeleton className="h-5 w-12 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : assets.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <File className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">No assets yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload your first file to get started. Add tags and manage versions.
              </p>
            </div>
            <Button onClick={() => fileInputRef.current?.click()} aria-label="Upload your first file">
              <Upload className="mr-2 h-4 w-4" aria-hidden />
              Upload files
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div
          className={cn(
            'grid gap-4',
            viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'
          )}
        >
          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              viewMode={viewMode}
              onEdit={openEditModal}
              onVersions={setVersionAsset}
              onDelete={setDeleteAssetState}
              onAttach={handleAttach}
            />
          ))}
        </div>
      )}

      <Dialog open={!!editAsset} onOpenChange={(o) => !o && setEditAsset(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit metadata</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Asset title"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Description</label>
              <Input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Tags (comma-separated)</label>
              <Input
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditAsset(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <VersionHistoryDialog
        asset={versionAsset}
        onClose={() => setVersionAsset(null)}
        onRestore={(versionId) => {
          if (versionAsset) {
            restoreMutation.mutate({ assetId: versionAsset.id, versionId })
          }
        }}
        isRestoring={restoreMutation.isPending}
      />

      <AlertDialog open={!!deleteAssetState} onOpenChange={(o) => !o && setDeleteAssetState(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive asset?</AlertDialogTitle>
            <AlertDialogDescription>
              This will archive the asset. You can restore it later from settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteAssetState && deleteMutation.mutate(deleteAssetState.id)}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function VersionHistoryDialog({
  asset,
  onClose,
  onRestore,
  isRestoring,
}: {
  asset: FileLibraryAsset | null
  onClose: () => void
  onRestore: (versionId: string) => void
  isRestoring: boolean
}) {
  const { data, isLoading } = useQuery({
    queryKey: ['file-library-versions', asset?.id],
    queryFn: async () => {
      if (!asset) return null
      const { data: d, error } = await getAssetVersions(asset.id)
      if (error) throw error
      return d ?? null
    },
    enabled: !!asset,
  })

  if (!asset) return null

  return (
    <Dialog open={!!asset} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Version history</DialogTitle>
          <p className="text-sm text-muted-foreground">{asset.title}</p>
        </DialogHeader>
        {isLoading ? (
          <div className="max-h-64 space-y-2 overflow-y-auto py-4" aria-busy="true" aria-label="Loading version history">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            ))}
          </div>
        ) : (
          <div className="max-h-64 space-y-2 overflow-y-auto py-4">
            {data?.versions?.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">No version history</p>
            ) : (
              data?.versions?.map((v) => (
                <VersionRow
                  key={v.id}
                  version={v}
                  isCurrent={v.file_path === asset.file_path}
                  onRestore={() => onRestore(v.id)}
                  isRestoring={isRestoring}
                />
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function VersionRow({
  version,
  isCurrent,
  onRestore,
  isRestoring,
}: {
  version: FileLibraryVersion
  isCurrent: boolean
  onRestore: () => void
  isRestoring: boolean
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium">v{version.version_number}</span>
          {isCurrent && (
            <Badge variant="success" className="text-xs">
              Current
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {formatFileSize(version.file_size)} •{' '}
          {new Date(version.created_at).toLocaleDateString()}
        </p>
      </div>
      {!isCurrent && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRestore}
          disabled={isRestoring}
          aria-label={`Restore version ${version.version_number}`}
        >
          {isRestoring ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            'Restore'
          )}
        </Button>
      )}
    </div>
  )
}
