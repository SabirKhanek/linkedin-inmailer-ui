export function getSummary(text: string, length: number) {
  return text.substring(0, length + 1) + "...";
}

export function GetSummaryComp({
  text,
  length,
}: {
  text: string;
  length: number;
}) {
  return (
    <>
      {text.substring(0, length + 1)}

      <span className="hover:text-primary hover:underline cursor-pointer">
        ...Read More
      </span>
    </>
  );
}
