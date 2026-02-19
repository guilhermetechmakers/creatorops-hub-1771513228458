import { supabase } from '@/lib/supabase'
import type { FileLibraryAsset, FileLibraryVersion } from '@/types/database'

const BUCKET = 'file-library'

interface PresignedUrlResult {
  path: string
  token: string
  signedUrl: string
}

interface CreateAssetParams {
  path: string
  filename: string
  fileType: string
  fileSize?: number
  title?: string
  description?: string
  tags?: string[]
}

interface ListParams {
  search?: string
  tags?: string[]
  limit?: number
  offset?: number
}

async function invoke<T>(action: string, body: Record<string, unknown> = {}): Promise<{ data: T | null; error: Error | null }> {
  const { data, error } = await supabase.functions.invoke('file-library', {
    body: { action, ...body },
  })

  if (error) {
    return { data: null, error }
  }

  const err = (data as { error?: string })?.error
  if (err) {
    return { data: null, error: new Error(err) }
  }

  return { data: data as T, error: null }
}

export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  fileSize?: number
): Promise<{ data: PresignedUrlResult | null; error: Error | null }> {
  return invoke<PresignedUrlResult>('presigned-url', {
    filename,
    contentType,
    fileSize,
  })
}

export async function createAssetRecord(params: CreateAssetParams): Promise<{
  data: { asset: FileLibraryAsset; version: FileLibraryVersion } | null
  error: Error | null
}> {
  return invoke<{ asset: FileLibraryAsset; version: FileLibraryVersion }>('create-asset', { ...params } as Record<string, unknown>)
}

export async function listAssets(params: ListParams = {}): Promise<{
  data: FileLibraryAsset[] | null
  error: Error | null
}> {
  const result = await invoke<{ assets: FileLibraryAsset[] }>('list', { ...params } as Record<string, unknown>)
  if (result.error) return { data: null, error: result.error }
  return { data: result.data?.assets ?? null, error: null }
}

export async function updateAssetMetadata(
  assetId: string,
  updates: { title?: string; description?: string; tags?: string[] }
): Promise<{ data: FileLibraryAsset | null; error: Error | null }> {
  const result = await invoke<{ asset: FileLibraryAsset }>('update-metadata', {
    assetId,
    ...updates,
  })
  if (result.error) return { data: null, error: result.error }
  return { data: result.data?.asset ?? null, error: null }
}

export async function getAssetVersions(assetId: string): Promise<{
  data: { asset: FileLibraryAsset; versions: FileLibraryVersion[] } | null
  error: Error | null
}> {
  return invoke<{ asset: FileLibraryAsset; versions: FileLibraryVersion[] }>('versions', {
    assetId,
  })
}

export async function restoreVersion(
  assetId: string,
  versionId: string
): Promise<{
  data: { asset: FileLibraryAsset; version: FileLibraryVersion } | null
  error: Error | null
}> {
  return invoke<{ asset: FileLibraryAsset; version: FileLibraryVersion }>('restore', {
    assetId,
    versionId,
  })
}

export async function deleteAsset(assetId: string): Promise<{ error: Error | null }> {
  const result = await invoke<{ success: boolean }>('delete', { assetId })
  return { error: result.error }
}

export async function getSignedDownloadUrl(path: string): Promise<{
  data: string | null
  error: Error | null
}> {
  const result = await invoke<{ url: string }>('signed-download', { path })
  if (result.error) return { data: null, error: result.error }
  return { data: result.data?.url ?? null, error: null }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getFileTypeCategory(mimeType: string): 'image' | 'video' | 'document' | 'audio' | 'other' {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.includes('pdf') || mimeType.startsWith('text/')) return 'document'
  return 'other'
}

export async function uploadFileToStorage(
  path: string,
  file: File
): Promise<{ error: Error | null }> {
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
  })
  return { error: error ?? null }
}
