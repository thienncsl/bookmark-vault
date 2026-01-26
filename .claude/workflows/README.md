# Workflows

Multi-step automated workflows for common processes.

## Available Workflows

| Workflow | Description |
|----------|-------------|
| `bookmark-maintenance` | Analyze, validate, and clean up bookmarks |

## Usage

Workflows are triggered manually or automatically based on conditions. They execute a series of steps with dependencies and outputs.

## Creating New Workflows

Workflows are defined in `workflow.yaml` files with:
- `steps`: Ordered list of tasks
- `depends_on`: Step dependencies
- `condition`: Conditional step execution
- `outputs`: Pass data between steps

## See Also

- [Commands](../commands/README.md) - Slash commands for common tasks
- [Skills](../skills/README.md) - Specialized workflows and patterns
- [Agents](../agents/README.md) - AI agents for complex tasks
