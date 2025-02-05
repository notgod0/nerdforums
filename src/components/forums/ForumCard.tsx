import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Forum {
  id: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
  likes: number;
  status: string;
}

interface ForumCardProps {
  forum: Forum;
  userLikes: Set<string>;
  onLike: (forumId: string, currentLikes: number) => void;
  onSearch: (tag: string) => void;
}

export const ForumCard = ({ forum, userLikes, onLike, onSearch }: ForumCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="forum-card">
      <div className="flex justify-between items-start mb-4">
        <h3 
          onClick={() => navigate(`/forum/${forum.id}`)}
          className="text-lg font-semibold hover:text-purple-400 transition-colors cursor-pointer"
        >
          {forum.title}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onLike(forum.id, forum.likes || 0);
            }}
            className={`text-purple-400 ${userLikes.has(forum.id) ? 'bg-purple-500/20' : ''}`}
          >
            ❤️ {forum.likes || 0}
          </Button>
          <span className={`forum-status ${
            forum.status === 'solved' ? 'status-solved' : 
            forum.status === 'closed' ? 'status-closed' : 
            'status-open'
          }`}>
            {forum.status}
          </span>
        </div>
      </div>
      <p 
        onClick={() => navigate(`/forum/${forum.id}`)}
        className="text-gray-400 mb-4 line-clamp-2 cursor-pointer"
      >
        {forum.description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {forum.tags?.map((tag) => (
            <span 
              key={tag} 
              className="forum-tag cursor-pointer hover:bg-purple-500/30"
              onClick={(e) => {
                e.stopPropagation();
                onSearch(tag);
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="text-sm text-gray-400">
          {new Date(forum.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};