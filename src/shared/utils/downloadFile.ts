export const downloadFile = (
  content: string,
  filename: string,
  contentType: string
): void => {
  const file: Blob = new Blob([content], { type: contentType });

  const a: HTMLAnchorElement = document.createElement("a");
  const url: string = URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
};
