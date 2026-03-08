// lib/api/validateConfig.ts
/**
 * Validates API configuration and provides helpful debug information
 */
export function validateApiConfig() {
  const issues: string[] = [];
  const warnings: string[] = [];
  const info: string[] = [];

  // Check API_BASE_URL
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;

  if (!apiBaseUrl && !apiUrl) {
    issues.push(
      '❌ Neither NEXT_PUBLIC_API_BASE_URL nor NEXT_PUBLIC_API_URL is set'
    );
  } else if (apiBaseUrl) {
    info.push(`✅ API_BASE_URL: ${apiBaseUrl}`);
  } else if (apiUrl) {
    info.push(`✅ API_URL: ${apiUrl}`);
  }

  if (!apiVersion) {
    warnings.push('⚠️ NEXT_PUBLIC_API_VERSION not set, using default "v1"');
  } else {
    info.push(`✅ API_VERSION: ${apiVersion}`);
  }

  // Check for localhost vs production
  if (apiBaseUrl?.includes('localhost') || apiUrl?.includes('localhost')) {
    info.push('ℹ️ Using local backend (development)');
  } else if (
    apiBaseUrl?.includes('http://') ||
    apiUrl?.includes('http://')
  ) {
    warnings.push(
      '⚠️ Using insecure HTTP connection. Consider using HTTPS for production'
    );
  } else if (
    apiBaseUrl?.includes('https://') ||
    apiUrl?.includes('https://')
  ) {
    info.push('✅ Using secure HTTPS connection');
  }

  // Check if backend URL ends with /api
  if (apiBaseUrl?.endsWith('/api')) {
    info.push('✅ API_BASE_URL includes /api path');
  } else if (apiBaseUrl && !apiBaseUrl.endsWith('/api')) {
    info.push(
      'ℹ️ API_BASE_URL does not include /api, it will be added automatically'
    );
  }

  // Log results
  console.group('🔍 API Configuration Validation');

  if (info.length > 0) {
    console.log(info.join('\n'));
  }

  if (warnings.length > 0) {
    console.warn(warnings.join('\n'));
  }

  if (issues.length > 0) {
    console.error(issues.join('\n'));
  }

  console.groupEnd();

  return { issues, warnings, info };
}

// Run validation in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
    validateApiConfig();
  }
}
