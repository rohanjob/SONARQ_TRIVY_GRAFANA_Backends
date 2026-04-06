process.env.NODE_ENV = 'test';

const { getEnv, getIntEnv } = require('../src/config/env');

describe('Environment helpers', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns an existing environment variable', () => {
    process.env.APP_NAME = 'ssp-books';

    expect(getEnv('APP_NAME')).toBe('ssp-books');
  });

  it('returns the fallback when the environment variable is empty', () => {
    process.env.EMPTY_VALUE = '';

    expect(getEnv('EMPTY_VALUE', 'fallback-value')).toBe('fallback-value');
  });

  it('throws when a required environment variable is missing', () => {
    delete process.env.MISSING_ENV;

    expect(() => getEnv('MISSING_ENV')).toThrow('Missing required environment variable: MISSING_ENV');
  });

  it('parses integer environment variables', () => {
    process.env.PORT = '5000';

    expect(getIntEnv('PORT')).toBe(5000);
  });

  it('returns numeric fallback values for integers', () => {
    delete process.env.RATE_LIMIT_MAX;

    expect(getIntEnv('RATE_LIMIT_MAX', 100)).toBe(100);
  });

  it('throws when an integer environment variable is invalid', () => {
    process.env.DB_PORT = 'not-a-number';

    expect(() => getIntEnv('DB_PORT')).toThrow('Environment variable DB_PORT must be an integer.');
  });
});
