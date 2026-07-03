import { Readable } from 'stream';
import { z } from 'zod';
import { Router, type IRouter, type Request, type Response } from 'express';
import { ObjectNotFoundError, ObjectStorageService } from '../lib/objectStorage';
import { requireAdmin } from '../middlewares/adminAuth';

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

const RequestUploadUrlBody = z.object({
  name: z.string(),
  size: z.number(),
  contentType: z.string(),
});

/**
 * POST /storage/uploads/request-url
 * Admin only — generates a presigned GCS upload URL.
 */
router.post('/storage/uploads/request-url', requireAdmin, async (req: Request, res: Response) => {

  const parsed = RequestUploadUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Missing or invalid required fields' });
    return;
  }

  try {
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
    res.json({ uploadURL, objectPath });
  } catch (err) {
    console.error('Upload URL error:', err);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

/**
 * GET /storage/public-objects/*
 * Unconditionally public — serves assets from PUBLIC_OBJECT_SEARCH_PATHS.
 */
router.get('/storage/public-objects/*path', async (req: Request, res: Response) => {
  const filePath = (req.params as Record<string, string>).path;
  try {
    const file = await objectStorageService.searchPublicObject(filePath);
    if (!file) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    const response = await objectStorageService.downloadObject(file);
    const nodeReadable = Readable.fromWeb(response.body as import('stream/web').ReadableStream);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    nodeReadable.pipe(res);
  } catch (err) {
    console.error('Public object error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

/**
 * GET /storage/objects/*
 * Serves uploaded objects — admin only for now.
 */
router.get('/storage/objects/*path', async (req: Request, res: Response) => {
  const objectPath = '/objects/' + (req.params as Record<string, string>).path;
  try {
    const file = await objectStorageService.getObjectEntityFile(objectPath);
    const response = await objectStorageService.downloadObject(file);
    const nodeReadable = Readable.fromWeb(response.body as import('stream/web').ReadableStream);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    nodeReadable.pipe(res);
  } catch (err) {
    if (err instanceof ObjectNotFoundError) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    console.error('Object serve error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

export default router;
