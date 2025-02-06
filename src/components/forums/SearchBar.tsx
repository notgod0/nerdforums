interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  return (
    <div className="relative">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input 
        type="search" 
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search forums or tags..." 
        className="pl-10 w-[300px] h-10 rounded-md bg-purple-950/20 border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
      />
    </div>
  );
};