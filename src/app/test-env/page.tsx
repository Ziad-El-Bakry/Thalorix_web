// app/test-env/page.tsx
export default function TestEnvPage() {
  return (
    <div className="p-8 space-y-2">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      
      <div className="space-y-1 font-mono text-sm">
        <p>API URL: <strong>{process.env.NEXT_PUBLIC_API_URL}</strong></p>
        <p>API Base: <strong>{process.env.NEXT_PUBLIC_API_BASE_URL}</strong></p>
        <p>API Version: <strong>{process.env.NEXT_PUBLIC_API_VERSION}</strong></p>
        <p>Socket URL: <strong>{process.env.NEXT_PUBLIC_SOCKET_URL}</strong></p>
        <p>App Name: <strong>{process.env.NEXT_PUBLIC_APP_NAME}</strong></p>
        <p>Platform: <strong>{process.env.NEXT_PUBLIC_PLATFORM}</strong></p>
        <p>Debug Mode: <strong>{process.env.NEXT_PUBLIC_DEBUG_MODE}</strong></p>
        <p>AI Enabled: <strong>{process.env.NEXT_PUBLIC_ENABLE_AI_GENERATOR}</strong></p>
        <p>Generation Cost: <strong>{process.env.NEXT_PUBLIC_GENERATION_COST} credits</strong></p>
      </div>
    </div>
  );
}