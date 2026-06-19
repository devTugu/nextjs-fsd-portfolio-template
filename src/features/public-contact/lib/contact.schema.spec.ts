import { describe, expect, it } from 'vitest';
import { createContactSchema } from '@/features/public-contact/lib/contact.schema';

const messages = {
  nameRequired: 'Name required',
  emailInvalid: 'Invalid email',
  messageMin: 'Message too short',
};

describe('createContactSchema', () => {
  const schema = createContactSchema(messages);

  it('accepts valid contact payload', () => {
    const result = schema.safeParse({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Hello there, this is a test message.',
    });

    expect(result.success).toBe(true);
  });

  it('rejects short message', () => {
    const result = schema.safeParse({
      name: 'Jane',
      email: 'jane@example.com',
      message: 'short',
    });

    expect(result.success).toBe(false);
  });
});
