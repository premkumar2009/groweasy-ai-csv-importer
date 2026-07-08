import { RequestHandler } from 'express';

interface BucketState {
  count: number;
  resetAt: number;
}

const windowMs = 15 * 60 * 1000;
const maxRequests = 10;
const buckets = new Map<string, BucketState>();

function getClientKey(ip: string | undefined): string {
  return ip?.trim() || 'anonymous';
}

export const importRateLimiter: RequestHandler = (req, res, next) => {
  const key = getClientKey(req.ip);
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    next();
    return;
  }

  if (bucket.count >= maxRequests) {
    res.setHeader('Retry-After', String(Math.ceil((bucket.resetAt - now) / 1000)));
    res.status(429).json({
      success: false,
      message: 'Too many import requests. Please retry later.',
    });
    return;
  }

  bucket.count += 1;
  next();
};