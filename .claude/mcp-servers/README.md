# MCP Servers

Model Context Protocol servers that extend Claude's capabilities.

## Available Servers

| Server | Description |
|--------|-------------|
| `bookmark-mcp` | Provides bookmark management capabilities |

## Configuration

MCP servers are configured in `settings.json`:

```json
{
  "mcpServers": {
    "bookmark-mcp": {
      "command": "node",
      "args": ["~/.claude/mcp-servers/bookmark-mcp/dist/index.js"]
    }
  }
}
```

## See Also

- [Commands](../commands/README.md) - Slash commands for common tasks
- [Skills](../skills/README.md) - Specialized workflows and patterns
