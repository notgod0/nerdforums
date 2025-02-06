import { ForumCard } from "./ForumCard";

interface Forum {
  id: string;
  title: string;
  description: string;
  tags: string[];
  created_at: string;
  likes: number;
  status: string;
}

interface ForumListProps {
  forums: Forum[];
  userLikes: Set<string>;
  onLike: (forumId: string, currentLikes: number) => Promise<void>;
  onSearch: (term: string) => void;
}

export const ForumList = ({ forums, userLikes, onLike, onSearch }: ForumListProps) => {
  return (
    <div className="space-y-4">
      {forums.map((forum) => (
        <ForumCard
          key={forum.id}
          forum={forum}
          userLikes={userLikes}
          onLike={onLike}
          onSearch={onSearch}
        />
      ))}
    </div>
  );
};