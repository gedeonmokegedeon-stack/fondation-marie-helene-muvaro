import { createHash, randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { getPrisma } from '@/lib/db'
import { getServerEnv } from '@/lib/env'
import { ApiError } from '@/lib/security'
import type { SafeUser } from '@/lib/auth'

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function storageRoot(): string {
  return path.resolve(getServerEnv().STORAGE_DIR)
}

export function resolveStoragePath(relative: string): string {
  if (!/^[a-f0-9-]+\.(webp|pdf)$/.test(relative))
    throw new ApiError('Chemin de fichier invalide.', 400)
  const root = storageRoot()
  const target = path.resolve(root, relative)
  if (!target.startsWith(root + path.sep)) throw new ApiError('Chemin de fichier invalide.', 400)
  return target
}

export async function saveUpload(file: File, user: SafeUser, alt = '', caption = '') {
  const maxBytes = getServerEnv().MAX_UPLOAD_MB * 1024 * 1024
  if (file.size <= 0 || file.size > maxBytes)
    throw new ApiError(`Fichier vide ou supérieur à ${getServerEnv().MAX_UPLOAD_MB} Mo.`, 413)
  if (file.size > 25 * 1024 * 1024) throw new ApiError('Fichier trop volumineux.', 413)

  const input = Buffer.from(await file.arrayBuffer())
  const isImage = IMAGE_TYPES.has(file.type)
  const isPdf = file.type === 'application/pdf'
  if (!isImage && !isPdf) throw new ApiError('Formats acceptés : JPEG, PNG, WebP, PDF.', 415)

  let output: Buffer
  let mimeType: string
  let extension: string
  if (isImage) {
    const signature = input.subarray(0, 12)
    const jpeg = signature[0] === 0xff && signature[1] === 0xd8
    const png = signature
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    const webp =
      signature.subarray(0, 4).toString('ascii') === 'RIFF' &&
      signature.subarray(8, 12).toString('ascii') === 'WEBP'
    if (!jpeg && !png && !webp) throw new ApiError('Signature d’image invalide.', 415)
    try {
      output = await sharp(input, { limitInputPixels: 40_000_000 })
        .rotate()
        .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 86 })
        .toBuffer()
    } catch {
      throw new ApiError('Image illisible ou corrompue.', 415)
    }
    mimeType = 'image/webp'
    extension = 'webp'
  } else {
    if (input.subarray(0, 5).toString('ascii') !== '%PDF-')
      throw new ApiError('Signature PDF invalide.', 415)
    output = input
    mimeType = 'application/pdf'
    extension = 'pdf'
  }

  const relative = `${randomUUID()}.${extension}`
  const target = resolveStoragePath(relative)
  await mkdir(storageRoot(), { recursive: true, mode: 0o750 })
  await writeFile(target, output, { flag: 'wx', mode: 0o640 })

  const originalName = file.name.replace(/[\\/\u0000-\u001f]/g, '_').slice(0, 180) || 'document'
  return getPrisma().mediaAsset.create({
    data: {
      kind: isImage ? 'IMAGE' : 'DOCUMENT',
      originalName,
      storagePath: relative,
      mimeType,
      sizeBytes: output.length,
      sha256: createHash('sha256').update(output).digest('hex'),
      alt: alt.slice(0, 300),
      caption: caption.slice(0, 500),
      uploadedById: user.id,
    },
  })
}

export async function readMediaFile(storagePath: string): Promise<Buffer> {
  return readFile(resolveStoragePath(storagePath))
}
