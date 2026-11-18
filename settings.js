const defaults = {
  x: true, youtube: true,
  terms: "GTA 6\nGTA VI\nGTA6\nGTAVI\nGrand Theft Auto 6\nGrand Theft Auto VI\nVice City\nLeonida\nLucia Caminos\nJason Duval"
};
function normalize(value) {
  return value.normalize("NFKC").toLowerCase().replace(/i\u0307/g, "i")
    .replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}
function parseTerms(value) {
  const unique = new Map();
  for (const part of value.split(/[\n,]+/)) {
    const term = part.trim();
    const key = normalize(term);
    if (key && !unique.has(key)) unique.set(key, term);
  }
  return [...unique.values()];
}
