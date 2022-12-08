import { SearchOutlined } from "@ant-design/icons";
import Icon from "./Icon";
import TextInput from "./TextInput";

export default function LeaderboardSearch({ filter, setFilter }) {
  return (
    <div className="flex justify-end w-[80rem] items-center gap-4">
      <TextInput
        placeholder="Type here to search..."
        value={filter}
        onChange={(v) => setFilter(v)}
      />
      <Icon>
        <SearchOutlined style={{ color: "#584BAA", fontSize: "1.5rem" }} />
      </Icon>
    </div>
  );
}