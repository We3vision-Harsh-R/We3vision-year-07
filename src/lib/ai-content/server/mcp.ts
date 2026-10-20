import "server-only";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { alertFailure } from "@/lib/alerts";
import { SERVER_INSTRUCTIONS, TOOLS, allowCall, toolJsonSchema, type ToolResult } from "./tools";
import type { McpContext } from "./tokens";

// The MCP server (Streamable HTTP, stateless: every request builds a small server, answers and is gone). The route is src/app/api/mcp/route.ts.

/** Total size of one request body (a picture of 2 MB is about 2.7 MB as base64). */
export const MAX_BODY_BYTES = 3 * 1024 * 1024;

const issueText = (issues: readonly { path: PropertyKey[]; message: string }[]) =>
  issues.map((i) => `- ${i.path.length ? i.path.map(String).join(".") : "(arguments)"}: ${i.message}`).join("\n");

function buildServer(ctx: McpContext) {
  const server = new Server({ name: "we3vision-content", version: "1.0.0" }, { capabilities: { tools: {} }, instructions: SERVER_INSTRUCTIONS });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS.map((t) => ({ name: t.name, title: t.title, description: t.description, inputSchema: toolJsonSchema(t) as { type: "object" }, annotations: t.annotations })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request): Promise<ToolResult> => {
    const tool = TOOLS.find((t) => t.name === request.params.name);
    if (!tool) return { isError: true, content: [{ type: "text", text: `Unknown tool "${request.params.name}".` }] };
    const allowed = tool.scope === "any" ? ctx.scopes.size > 0 : ctx.scopes.has(tool.scope);
    if (!allowed) return { isError: true, content: [{ type: "text", text: `This connection does not have the "${tool.scope}" permission. Create a connection with that permission in Admin > AI Integrations.` }] };
    if (!allowCall(ctx, tool)) return { isError: true, content: [{ type: "text", text: "Too many requests from this connection. Wait a little (up to an hour for sending) and try again." }] };
    const parsed = tool.schema.safeParse(request.params.arguments ?? {});
    if (!parsed.success) return { isError: true, content: [{ type: "text", text: `Invalid arguments:\n${issueText(parsed.error.issues)}` }] };
    try {
      return await tool.run(ctx, parsed.data as never);
    } catch (error) {
      console.error(`mcp tool ${tool.name} failed`, error);
      alertFailure(`AI integration: ${tool.name}`, error, "warning");
      return { isError: true, content: [{ type: "text", text: "Something went wrong on the website. Please try again in a moment." }] };
    }
  });
  return server;
}

/** Answers one MCP request (a POST with a JSON-RPC message) for an authenticated connection. */
export async function handleMcpRequest(request: Request, ctx: McpContext): Promise<Response> {
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true, maxRequestBodySize: MAX_BODY_BYTES });
  const server = buildServer(ctx);
  await server.connect(transport);
  try {
    return await transport.handleRequest(request);
  } finally {
    void transport.close().catch(() => undefined);
    void server.close().catch(() => undefined);
  }
}
