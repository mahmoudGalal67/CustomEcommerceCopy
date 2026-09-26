import { useCMS } from "../store";
export default function Text({
  id,
  text = "Text",
}: {
  id: string;
  text: string;
}) {
  const { selectedId, updateProp } = useCMS();
  return selectedId === id ? (
    <textarea
      value={text}
      onChange={(e) => updateProp(id, "text", e.target.value)}
    />
  ) : (
    <p>{text}</p>
  );
}
