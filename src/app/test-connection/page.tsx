// app/test-connection/page.tsx
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/axios";
import { Button } from "@/components/ui/button";

export default function TestConnectionPage() {
  const [status, setStatus] = useState<
    "idle" | "testing" | "success" | "error"
  >("idle");
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setStatus("testing");
    setDetails(null);
    setError(null);

    try {
      console.log("🧪 Testing connection...");
      console.log("📍 Testing URL:", `${api.defaults.baseURL}`);

      // Try to ping the backend with a health check endpoint
      const response = await api.get("/users");

      console.log("✅ Connection successful!");
      setStatus("success");
      setDetails(response.data);
    } catch (err: any) {
      console.error("❌ Connection failed:", err);

      setStatus("error");
      setError(err.message);
      setDetails({
        message: err.message,
        code: err.code,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        isNetworkError: err.message === "Network Error" || !err.response,
        config: {
          url: err.config?.url,
          baseURL: err.config?.baseURL,
          fullUrl: err.config
            ? `${err.config.baseURL}${err.config.url}`
            : "Unknown",
        },
        troubleshooting: {
          checkBackendRunning:
            "Verify the backend server is running and accessible",
          checkURL: "Verify NEXT_PUBLIC_API_BASE_URL is correct in .env.local",
          checkCORS:
            "If backend requires CORS, ensure it accepts requests from localhost",
          checkNetwork: "Check browser network tab for more details",
        },
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>

      {/* Environment Info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="font-semibold mb-2">Environment Configuration:</h2>
        <div className="space-y-1 text-sm font-mono">
          <p>API_URL: {process.env.NEXT_PUBLIC_API_URL || "not set"}</p>
          <p>
            API_BASE_URL: {process.env.NEXT_PUBLIC_API_BASE_URL || "not set"}
          </p>
          <p>API_VERSION: {process.env.NEXT_PUBLIC_API_VERSION || "not set"}</p>
          <p className="mt-2 font-bold">Testing: {api.defaults.baseURL}</p>
        </div>
      </div>

      {/* Test Button */}
      <Button
        onClick={testConnection}
        className="mb-6"
        aria-disabled={status === "testing"}
      >
        {status === "testing" ? "Testing..." : "Test Connection"}
      </Button>

      {/* Status */}
      {status !== "idle" && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            status === "success"
              ? "bg-green-50 border-green-200"
              : status === "error"
                ? "bg-red-50 border-red-200"
                : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {status === "success" && <span className="text-2xl">✅</span>}
            {status === "error" && <span className="text-2xl">❌</span>}
            {status === "testing" && <span className="text-2xl">⏳</span>}

            <span className="font-semibold">
              {status === "success" && "Connected Successfully!"}
              {status === "error" && "Connection Failed"}
              {status === "testing" && "Testing Connection..."}
            </span>
          </div>

          {error && <p className="mt-2 text-red-600 font-semibold">{error}</p>}
        </div>
      )}

      {/* Response Details */}
      {details && (
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">
          <p className="text-sm text-gray-400 mb-2">Response:</p>
          <pre className="text-xs">{JSON.stringify(details, null, 2)}</pre>
        </div>
      )}

      {/* Troubleshooting */}
      {status === "error" && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold mb-3">🔧 Troubleshooting:</h3>

          {details?.isNetworkError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-800 text-sm">
              <p className="font-semibold">Network Error Detected:</p>
              <p className="mt-1">
                Backend server is unreachable. Try these steps:
              </p>
            </div>
          )}

          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <strong>Check Backend:</strong> Ensure backend is running at
              <code className="bg-yellow-100 px-2 py-1 mx-1 rounded">
                {process.env.NEXT_PUBLIC_API_BASE_URL}
              </code>
            </li>
            <li>
              <strong>Local Development:</strong> To use local backend, edit
              .env.local:
              <pre className="bg-yellow-100 text-xs p-2 mt-1 rounded">
                NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
                NEXT_PUBLIC_API_VERSION=v1
              </pre>
            </li>
            <li>
              <strong>CORS Configuration:</strong> Ensure backend allows
              requests from:{" "}
              <code className="bg-yellow-100 px-1">http://localhost:3000</code>
            </li>
            <li>
              <strong>Network Check:</strong> Open DevTools → Network tab and
              check the failed request
            </li>
            <li>
              <strong>Restart Dev Server:</strong> After changing .env.local,
              restart: <code className="bg-yellow-100 px-1">npm run dev</code>
            </li>
          </ul>

          {details?.config && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs font-mono">
              <p className="text-gray-700">
                Request URL: {details.config.fullUrl}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
