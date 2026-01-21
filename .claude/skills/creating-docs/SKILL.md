---
name: creating-docs
description: Create documentation or guidance files for the repository
parameters:
  type: object
  properties:
    topic:
      type: string
      description: Documentation topic (e.g., "api-usage", "architecture", "setup")
    type:
      type: string
      description: Type of documentation
      enum:
        - guide
        - api-reference
        - architecture
        - troubleshooting
    output:
      type: string
      description: Output file path (optional)
  required:
    - topic
    - type
---

# Create Documentation Skill

This skill creates documentation and guidance files for the repository.

## Checklist

- [ ] Identify the documentation scope and audience
- [ ] Research existing documentation
- [ ] Create the documentation file
- [ ] Add to relevant index if applicable
- [ ] Verify clarity and completeness

## Documentation Types

### Guide
Step-by-step instructions for completing a task. Include:
- Prerequisites
- Step-by-step instructions
- Examples
- Troubleshooting tips

### API Reference
Technical documentation for APIs. Include:
- Function signatures
- Parameters and return types
- Usage cases examples
- Error

### Architecture
High-level system design documentation. Include:
- Component overview
- Data flow
- Key patterns
- Design decisions

### Troubleshooting
Problem-solution documentation. Include:
- Common issues
- Symptoms
- Solutions
- Prevention tips

## File Location

| Type | Location |
|------|----------|
| Guide | `docs/` or `.claude/` |
| API Reference | `docs/api/` or `lib/` |
| Architecture | `docs/` or `ARCHITECTURE.md` |
| Troubleshooting | `docs/troubleshooting.md` |

## Quality Standards

- Clear, concise language
- Working code examples
- Cross-references to related docs
- Update existing docs when needed
