# Bookmark Vault Usage Guide

A user guide for the Bookmark Vault bookmark manager application.

## Getting Started

Bookmark Vault is a simple, local-first bookmark manager that stores all your bookmarks in your browser's local storage. No account required, no data leaves your device.

## Adding Bookmarks

### Basic Steps

1. Click the **"Add Bookmark"** button in the toolbar
2. Fill in the bookmark details:
   - **Title** - A descriptive name for your bookmark (required)
   - **URL** - The web address (required, must be valid)
   - **Description** - Optional notes about the bookmark
   - **Tags** - Comma-separated tags for organization
3. Click **"Add Bookmark"** to save

### Tag Format

Tags are entered as comma-separated values:

```
react, javascript, frontend
```

Spaces around tags are automatically trimmed. Empty tags are ignored.

### Validation

- Title must not be empty
- URL must be a valid format (https://example.com)
- Duplicate URLs are not allowed

## Managing Bookmarks

### Editing a Bookmark

1. Click the **Edit** icon on any bookmark card
2. Modify the desired fields
3. Click **"Update Bookmark"** to save changes

### Deleting a Bookmark

1. Click the **Delete** icon on any bookmark card
2. The bookmark is immediately removed from the list

### Visual States

Bookmarks display different visual states during operations:
- **Pending add** - Highlighted while a new bookmark is being saved
- **Pending delete** - Dimmed while a bookmark is being deleted

## Searching Bookmarks

Use the search input to filter bookmarks by:

- Title
- URL
- Description
- Tags

Search is case-insensitive and supports partial matches. Results update automatically as you type with a 300ms debounce.

### Keyboard Navigation

With search results focused:
- **Arrow Up/Down** - Navigate between bookmarks
- **Arrow Right/Left** - Same as Up/Down for compatibility

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + N` | Focus the title input (when adding) |
| `Ctrl/Cmd + F` | Focus the search input |
| `Escape` | Clear form and unfocus |
| `Arrow Keys` | Navigate between bookmarks |

## Importing Bookmarks

### Supported Format

Import JSON files containing an array of bookmark objects:

```json
[
  {
    "id": "uuid",
    "title": "My Bookmark",
    "url": "https://example.com",
    "description": "Optional description",
    "tags": ["tag1", "tag2"],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Import Process

1. Click the **Import** button
2. Select a `.json` file
3. Review the preview:
   - **Valid** - Bookmarks that will be imported
   - **Duplicates** - URLs that already exist (skipped)
   - **Invalid** - Items with validation errors
4. Choose import mode:
   - **Merge** - Add to existing bookmarks
   - **Replace** - Remove all existing bookmarks
5. Click **Import** to confirm

### Validation During Import

All imported bookmarks are validated against the schema. Invalid bookmarks are rejected with error details.

## Exporting Bookmarks

1. Click the **Export** button
2. A JSON file is downloaded automatically
3. Filename format: `bookmarks-YYYY-MM-DD.json`

The exported file contains all your bookmarks in JSON format, suitable for backup or import into other applications.

## Theme

Toggle between **light** and **dark** modes using the theme button in the header. Your preference is saved locally.

## Data Storage

All data is stored in your browser's local storage under the key `bookmark-vault-data`.

### Backup Recommendations

- Regularly export your bookmarks using the Export feature
- Keep backups of exported JSON files

### Limitations

- Data is only available in the same browser/device
- Clearing browser data will remove all bookmarks
- Bookmarks don't sync between devices

## Error Handling

### Common Issues

**"Failed to save bookmark"**
- Check your browser's local storage availability
- Try refreshing the page

**Import fails**
- Ensure the file is valid JSON
- Check that bookmarks match the required schema

### Error States

Errors are displayed prominently in the UI with red highlights. Failed operations are automatically reverted where possible.
