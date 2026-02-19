// Supabase Edge Function: File Library operations
// Handles presigned URLs, listing, metadata update, version restore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BUCKET = 'file-library'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  })
}

function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message }, status)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders() })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return errorResponse('Unauthorized', 401)
  }

  const token = authHeader.replace('Bearer ', '')
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? supabaseAnonKey

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  if (userError || !user) {
    return errorResponse('Invalid token', 401)
  }

  const userId = user.id

  try {
    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {}
    const action = body.action ?? 'list'

    switch (action) {
      case 'presigned-url': {
        const { filename } = body
        if (!filename || typeof filename !== 'string') {
          return errorResponse('filename is required')
        }
        const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
        const path = `${userId}/${Date.now()}-${safeName}`

        const { data: signed, error } = await supabaseAdmin.storage
          .from(BUCKET)
          .createSignedUploadUrl(path)

        if (error) {
          return errorResponse(error.message, 500)
        }
        return jsonResponse({
          path,
          token: signed.token,
          signedUrl: signed.signedUrl,
        })
      }

      case 'create-asset': {
        const { path, filename, fileType, fileSize, title, description, tags } = body
        if (!path || !filename || !fileType) {
          return errorResponse('path, filename, fileType are required')
        }

        const { data: asset, error } = await supabase
          .from('file_library_asset')
          .insert({
            user_id: userId,
            title: title ?? filename,
            filename,
            file_path: path,
            file_type: fileType,
            file_size: fileSize ?? 0,
            description: description ?? null,
            tags: Array.isArray(tags) ? tags : [],
            status: 'active',
          })
          .select()
          .single()

        if (error) {
          return errorResponse(error.message, 500)
        }

        const { data: version } = await supabase
          .from('file_library_version')
          .insert({
            asset_id: asset.id,
            version_number: 1,
            file_path: path,
            file_size: asset.file_size,
          })
          .select()
          .single()

        return jsonResponse({ asset, version })
      }

      case 'list': {
        const { search, tags, limit = 50, offset = 0 } = body
        let query = supabase
          .from('file_library_asset')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1)

        if (search && typeof search === 'string') {
          query = query.or(`title.ilike.%${search}%,filename.ilike.%${search}%`)
        }
        if (Array.isArray(tags) && tags.length > 0) {
          query = query.contains('tags', tags)
        }

        const { data, error } = await query
        if (error) {
          return errorResponse(error.message, 500)
        }
        return jsonResponse({ assets: data })
      }

      case 'update-metadata': {
        const { assetId, title, description, tags } = body
        if (!assetId) {
          return errorResponse('assetId is required')
        }

        const updates: Record<string, unknown> = {}
        if (title !== undefined) updates.title = title
        if (description !== undefined) updates.description = description
        if (Array.isArray(tags)) updates.tags = tags

        if (Object.keys(updates).length === 0) {
          return errorResponse('No updates provided')
        }

        const { data, error } = await supabase
          .from('file_library_asset')
          .update(updates)
          .eq('id', assetId)
          .eq('user_id', userId)
          .select()
          .single()

        if (error) {
          return errorResponse(error.message, 500)
        }
        return jsonResponse({ asset: data })
      }

      case 'versions': {
        const { assetId } = body
        if (!assetId) {
          return errorResponse('assetId is required')
        }

        const { data, error } = await supabase
          .from('file_library_version')
          .select('*')
          .eq('asset_id', assetId)
          .order('version_number', { ascending: false })

        if (error) {
          return errorResponse(error.message, 500)
        }

        const asset = await supabase
          .from('file_library_asset')
          .select('*')
          .eq('id', assetId)
          .eq('user_id', userId)
          .single()

        if (asset.error || !asset.data) {
          return errorResponse('Asset not found', 404)
        }

        return jsonResponse({ asset: asset.data, versions: data ?? [] })
      }

      case 'restore': {
        const { assetId, versionId } = body
        if (!assetId || !versionId) {
          return errorResponse('assetId and versionId are required')
        }

        const { data: asset, error: assetErr } = await supabase
          .from('file_library_asset')
          .select('*')
          .eq('id', assetId)
          .eq('user_id', userId)
          .single()

        if (assetErr || !asset) {
          return errorResponse('Asset not found', 404)
        }

        const { data: version, error: verErr } = await supabase
          .from('file_library_version')
          .select('*')
          .eq('id', versionId)
          .eq('asset_id', assetId)
          .single()

        if (verErr || !version) {
          return errorResponse('Version not found', 404)
        }

        const { data: maxVer } = await supabase
          .from('file_library_version')
          .select('version_number')
          .eq('asset_id', assetId)
          .order('version_number', { ascending: false })
          .limit(1)
          .single()

        const newVersionNum = (maxVer?.version_number ?? version.version_number) + 1
        const newPath = `${userId}/${Date.now()}-${asset.filename}`

        const { data: srcFile } = await supabaseAdmin.storage.from(BUCKET).download(version.file_path)
        if (!srcFile) {
          return errorResponse('Source file not found in storage', 404)
        }

        const { error: uploadErr } = await supabaseAdmin.storage
          .from(BUCKET)
          .upload(newPath, srcFile, { upsert: true })

        if (uploadErr) {
          return errorResponse(uploadErr.message, 500)
        }

        const { data: newVersion, error: insertErr } = await supabase
          .from('file_library_version')
          .insert({
            asset_id: assetId,
            version_number: newVersionNum,
            file_path: newPath,
            file_size: version.file_size,
          })
          .select()
          .single()

        if (insertErr) {
          return errorResponse(insertErr.message, 500)
        }

        await supabase
          .from('file_library_asset')
          .update({
            file_path: newPath,
            file_size: version.file_size,
            updated_at: new Date().toISOString(),
          })
          .eq('id', assetId)
          .eq('user_id', userId)

        return jsonResponse({ asset: { ...asset, file_path: newPath, file_size: version.file_size }, version: newVersion })
      }

      case 'delete': {
        const { assetId } = body
        if (!assetId) {
          return errorResponse('assetId is required')
        }

        const { error } = await supabase
          .from('file_library_asset')
          .update({ status: 'archived' })
          .eq('id', assetId)
          .eq('user_id', userId)

        if (error) {
          return errorResponse(error.message, 500)
        }
        return jsonResponse({ success: true })
      }

      case 'signed-download': {
        const { path } = body
        if (!path) {
          return errorResponse('path is required')
        }
        if (!path.startsWith(userId + '/')) {
          return errorResponse('Access denied', 403)
        }

        const { data, error } = await supabaseAdmin.storage
          .from(BUCKET)
          .createSignedUrl(path, 3600)

        if (error) {
          return errorResponse(error.message, 500)
        }
        return jsonResponse({ url: data.signedUrl })
      }

      default:
        return errorResponse(`Unknown action: ${action}`, 400)
    }
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : 'Unknown error',
      500
    )
  }
})
