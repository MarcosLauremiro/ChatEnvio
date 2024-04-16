import { Input } from "antd";

interface SearchInputProps {
  searchText: string;
  setSearchText: (searchText: string) => void;
}

export const SearchInput = ({
  searchText,
  setSearchText,
}: SearchInputProps) => (
  <Input
    type="text"
    placeholder="Search messages"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
  />
);
