import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_FILE = join(__dirname, "..", "bookmarks.json");

interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

function readBookmarks(): Bookmark[] {
  try {
    if (!existsSync(DATA_FILE)) {
      return [];
    }
    const data = readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeBookmarks(bookmarks: Bookmark[]): void {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(bookmarks, null, 2));
  } catch (error) {
    throw new Error(`Failed to write bookmarks: ${error}`);
  }
}

const server = new McpServer({
  name: "bookmark-mcp",
  version: "1.0.0",
});

// Count bookmarks
server.registerTool(
  "count_bookmarks",
  {
    title: "Count Bookmarks",
    description: "Count total bookmarks",
  },
  async () => {
    const bookmarks = readBookmarks();
    return {
      content: [{ type: "text", text: `Total bookmarks: ${bookmarks.length}` }],
    };
  }
);

// Search bookmarks
server.registerTool(
  "search_bookmarks",
  {
    title: "Search Bookmarks",
    description: "Search bookmarks by title, URL, description, or tags",
    inputSchema: z.object({
      query: z.string().describe("Search term"),
    }),
  },
  async ({ query }) => {
    const lowerQuery = query.toLowerCase();
    const bookmarks = readBookmarks();
    const results = bookmarks.filter(
      (b) =>
        b.title.toLowerCase().includes(lowerQuery) ||
        b.url.toLowerCase().includes(lowerQuery) ||
        b.description?.toLowerCase().includes(lowerQuery) ||
        b.tags.some((t) => t.toLowerCase().includes(lowerQuery))
    );
    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
    };
  }
);

// List bookmarks
server.registerTool(
  "list_bookmarks",
  {
    title: "List Bookmarks",
    description: "List all bookmarks with optional limit",
    inputSchema: z.object({
      limit: z.number().optional().default(50).describe("Maximum number of bookmarks to return"),
    }),
  },
  async ({ limit }) => {
    const bookmarks = readBookmarks();
    const limited = bookmarks.slice(0, limit);
    return {
      content: [{ type: "text", text: JSON.stringify(limited, null, 2) }],
    };
  }
);

// Get bookmark by ID
server.registerTool(
  "get_bookmark",
  {
    title: "Get Bookmark",
    description: "Get a specific bookmark by ID",
    inputSchema: z.object({
      id: z.string().describe("Bookmark ID"),
    }),
  },
  async ({ id }) => {
    const bookmarks = readBookmarks();
    const bookmark = bookmarks.find((b) => b.id === id);
    if (!bookmark) {
      return {
        content: [{ type: "text", text: `Bookmark with ID "${id}" not found` }],
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(bookmark, null, 2) }],
    };
  }
);

// Add bookmark
server.registerTool(
  "add_bookmark",
  {
    title: "Add Bookmark",
    description: "Add a new bookmark",
    inputSchema: z.object({
      title: z.string().describe("Bookmark title"),
      url: z.string().url().describe("Bookmark URL"),
      description: z.string().optional().describe("Optional description"),
      tags: z.array(z.string()).optional().default([]).describe("Optional tags"),
    }),
  },
  async ({ title, url, description, tags }) => {
    const bookmarks = readBookmarks();
    const newBookmark: Bookmark = {
      id: crypto.randomUUID(),
      title,
      url,
      description,
      tags,
      createdAt: new Date().toISOString(),
    };
    bookmarks.unshift(newBookmark);
    writeBookmarks(bookmarks);
    return {
      content: [{ type: "text", text: `Added bookmark: ${title} (${url})` }],
    };
  }
);

// Delete bookmark
server.registerTool(
  "delete_bookmark",
  {
    title: "Delete Bookmark",
    description: "Delete a bookmark by ID",
    inputSchema: z.object({
      id: z.string().describe("Bookmark ID to delete"),
    }),
  },
  async ({ id }) => {
    const bookmarks = readBookmarks();
    const index = bookmarks.findIndex((b) => b.id === id);
    if (index === -1) {
      return {
        content: [{ type: "text", text: `Bookmark with ID "${id}" not found` }],
      };
    }
    const deleted = bookmarks.splice(index, 1)[0];
    writeBookmarks(bookmarks);
    return {
      content: [{ type: "text", text: `Deleted bookmark: ${deleted.title}` }],
    };
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
