// =============================================
// SSP Books Backend - Environment Helpers
// =============================================

require('dotenv').config();

const hasValue = (value) => value !== undefined && value !== '';

const resolveEnvValue = (name, fallback) => {
  const value = process.env[name];

  if (hasValue(value)) {
    return value;
  }

  if (fallback !== undefined) {
    return fallback;
  }

  throw new Error(`Missing required environment variable: ${name}`);
};

const getEnv = (name, fallback) => resolveEnvValue(name, fallback);

const getIntEnv = (name, fallback) => {
  const value = resolveEnvValue(name, fallback);
  const parsedValue = typeof value === 'number' ? value : parseInt(value, 10);

  if (Number.isNaN(parsedValue)) {
    throw new Error(`Environment variable ${name} must be an integer.`);
  }

  return parsedValue;
};

module.exports = {
  getEnv,
  getIntEnv,
};
