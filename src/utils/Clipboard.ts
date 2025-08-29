export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    alert(`Copied ID: ${text}`);
  } catch (err) {
    console.error("Failed to copy:", err);
    alert("Failed to copy ID");
  }
};
