// =============================================
// SSP Books Backend - Environment Helpers
// =============================================

require('dotenv').config();

const getEnv = (name, fallback) => {
  const value = process.env[name];

  if (value !== undefined && value !== '') {
    return value;
  }

  if (fallback !== undefined) {
    return fallback;
  }

  throw new Error(`Missing required environment variable: ${name}`);
};

const getIntEnv = (name, fallback) => {
  const value = process.env[name];

  if (value !== undefined && value !== '') {
    return parseInt(value, 10);
  }

  if (fallback !== undefined) {
    return fallback;
  }

  throw new Error(`Missing required environment variable: ${name}`);
};

module.exports = {
  getEnv,
  getIntEnv,
};
