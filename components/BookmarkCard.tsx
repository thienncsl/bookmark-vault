import { type Bookmark } from "@/lib/types";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
}

export function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 line-clamp-1">{bookmark.title}</h3>
        <button
          onClick={() => onDelete(bookmark.id)}
          className="text-gray-400 hover:text-red-600 transition-colors"
          title="Delete bookmark"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:underline line-clamp-1 mb-2 block"
      >
        {bookmark.url}
      </a>

      {bookmark.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{bookmark.description}</p>
      )}

      {bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {bookmark.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
