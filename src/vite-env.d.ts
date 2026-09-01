/// <reference types="vite/client" />

type WebMCPTool<TInput = any> = {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean }
  execute: (input: TInput) => Promise<unknown>
}

declare global {
  interface Document {
    modelContext?: {
      registerTool: <TInput = any>(tool: WebMCPTool<TInput>, options?: { signal?: AbortSignal }) => Promise<void>
    }
  }
}

export {}
