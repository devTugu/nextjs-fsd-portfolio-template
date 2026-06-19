import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { fetchInternal, parseInternalJson } from '@/shared/lib/internal-api';
import { assertCsrf } from '@/shared/lib/bff-csrf';
import { PUBLIC_API_PATHS } from '@/shared/api/public.config';

const contactBodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional(),
});

export async function POST(request: NextRequest) {
  const csrfError = assertCsrf(request);
  if (csrfError) {
    return csrfError;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: 'Invalid JSON' } },
      { status: 400 },
    );
  }

  const parsed = contactBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION', message: parsed.error.flatten() } },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ success: true, data: null }, { status: 201 });
  }

  const response = await fetchInternal(PUBLIC_API_PATHS.CONTACT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    }),
  });

  const payload = await parseInternalJson<unknown>(response);
  return NextResponse.json(payload, { status: response.status });
}
