import { useMemo } from "react";

const highlightJSON = (jsonString: string) => {
  return jsonString.replace(
    /("(?:[^"\\]|\\.)*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|[{}])/g,
    (match) => {
      let cls = "text-yellow-300"; // Default color for strings, change as needed

      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "text-blue-400"; // Key
        } else {
          cls = "text-green-400"; // String value
        }
      } else if (/true|false/.test(match)) {
        cls = "text-blue-400"; // Boolean
      } else if (/null/.test(match)) {
        cls = "text-gray-400"; // Null
      } else if (!isNaN(parseFloat(match))) {
        cls = "text-pink-400"; // Number
      } else if (match === "{" || match === "}") {
        cls = "text-yellow-300"; // Curly braces
      }

      return `<span class="${cls} break-all">${match}</span>`;
    }
  );
};

export function JSONBlock({ json }: { json: object }) {
  const highlightedJSON = useMemo(() => {
    return highlightJSON(JSON.stringify(json, undefined, 2));
  }, [json]);

  return (
    <pre
      className="font-mono p-3 bg-[rgb(35_44_50)] text-white rounded-xl"
      dangerouslySetInnerHTML={{
        __html: highlightedJSON,
      }}
    ></pre>
  );
}
