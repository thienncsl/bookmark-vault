## Anti-Patterns to Avoid

### 1. Direct localStorage in Component Body

```tsx
// BAD - Will crash on SSR
export function Component() {
  const data = localStorage.getItem("key"); // Error: localStorage not defined
  return <div>{data}</div>;
}

// GOOD - Use useEffect for client-only access
export function Component() {
  const [data, setData] = useState<string | null>(null);
  useEffect(() => {
    setData(localStorage.getItem("key"));
  }, []);
  return <div>{data}</div>;
}
```

### 2. Missing "use client" Directive

```tsx
// BAD - Server component trying to use hooks
import { useState } from "react";

export function Component() {
  const [count, setCount] = useState(0); // Error: useState not available
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// GOOD - Client component
"use client";

import { useState } from "react";

export function Component() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### 3. Inline Handlers Breaking Memo

```tsx
// BAD - New function on every render
{filteredBookmarks.map((bookmark) => (
  <BookmarkCard
    key={bookmark.id}
    bookmark={bookmark}
    onDelete={(id) => deleteBookmark(id)} // New function each render
  />
))}

// GOOD - Memoized handler
const handleDelete = useCallback(
  (id: string) => deleteBookmark(id),
  [deleteBookmark]
);

{filteredBookmarks.map((bookmark) => (
  <BookmarkCard
    key={bookmark.id}
    bookmark={bookmark}
    onDelete={handleDelete} // Stable reference
  />
))}
```

### 4. Missing Error Boundaries

```tsx
// BAD - No error handling
export function Component() {
  const data = getBookmarks(); // Could throw
  return <div>{data.map(/* ... */)}</div>;
}

// GOOD - ErrorBoundary wraps potentially failing component
<ErrorBoundary fallback={<ErrorFallback />}>
  <Component />
</ErrorBoundary>
```

### 5. Missing Type Annotations

```tsx
// BAD - Implicit any
const [data, setData] = useState(null);

// GOOD - Explicit types
const [data, setData] = useState<Bookmark[]>([]);
```

### 6. Skipping Zod Validation

```tsx
// BAD - Direct save without validation
const handleSubmit = () => {
  const bookmark = { title: formData.title, url: formData.url };
  addBookmark(bookmark as CreateBookmarkInput); // No validation
};

// GOOD - Validate with Zod first
const result = bookmarkInputSchema.safeParse({
  title: formData.title,
  url: formData.url,
});

if (!result.success) {
  setErrors(mapErrors(result.error));
  return;
}

await addBookmark(result.data);
```

### 7. Using Index as Key

```tsx
// BAD - Index as key causes bugs with reordering
{items.map((item, index) => (
  <div key={index}>{item.name}</div>
))}

// GOOD - Stable ID as key
{items.map((item) => (
  <div key={item.id}>{item.name}</div>
))}
```

### 8. Not Cleaning Up Effects

```tsx
// BAD - Memory leak
useEffect(() => {
  const timer = setInterval(() => {
    setCount(c => c + 1);
  }, 1000);
  // Missing: return () => clearInterval(timer);
}, []);

// GOOD - Cleanup
useEffect(() => {
  const timer = setInterval(() => {
    setCount(c => c + 1);
  }, 1000);
  return () => clearInterval(timer);
}, []);
```

### 9. Not Checking for Context Existence

```tsx
// BAD - Could throw
const context = useContext(SomeContext);
context.doSomething(); // Error if provider missing

// GOOD - Guard clause
const context = useContext(SomeContext);
if (!context) {
  throw new Error("Component must be used within Provider");
}
```

### 10. Missing SSR Checks

```tsx
// BAD - Accessing window on server
const width = window.innerWidth;

// GOOD - SSR check
const [width, setWidth] = useState(0);
useEffect(() => {
  setWidth(window.innerWidth);
}, []);
```

### 11. Not Using Proper ARIA Attributes

```tsx
// BAD - Unaccessible
<button onClick={toggle}>{isOpen ? "Close" : "Open"}</button>

// GOOD - Accessible
<button
  onClick={toggle}
  aria-expanded={isOpen}
  aria-controls="panel"
>
  {isOpen ? "Close" : "Open"}
</button>
<div id="panel" role="region" aria-hidden={!isOpen}>
  {/* content */}
</div>
```

### 12. Mutating State Directly

```tsx
// BAD - Mutation
const addBookmark = (bookmark) => {
  state.bookmarks.push(bookmark); // Direct mutation
};

// GOOD - Immutable update
const addBookmark = (bookmark) => {
  dispatch({
    type: "ADD_BOOKMARK",
    payload: { ...bookmark, id: uuidv4(), createdAt: new Date().toISOString() },
  });
};
```
