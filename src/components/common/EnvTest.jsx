"use client";

export default function EnvTest() {
  const envId = process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID;
  
  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
      <h3 className="font-bold text-yellow-800">Environment Variable Test</h3>
      <p className="text-sm text-yellow-700">
        NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID: {envId || "NOT SET"}
      </p>
      <p className="text-xs text-yellow-600 mt-1">
        If this shows "NOT SET", restart your dev server after adding the env variable.
      </p>
    </div>
  );
} 