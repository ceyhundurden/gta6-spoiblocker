const field = id => document.getElementById(id);
const feedback = field("status");
async function initialize() {
  const saved = await chrome.storage.local.get(defaults);
  field("x").checked = saved.x;
  field("youtube").checked = saved.youtube;
  field("terms").value = saved.terms;
}
field("reset").addEventListener("click", () => {
  field("terms").value = defaults.terms;
  feedback.textContent = "Uygulamak için Kaydet’e bas.";
});
document.querySelector("form").addEventListener("submit", async event => {
  event.preventDefault();
  const terms = parseTerms(field("terms").value);
  try {
    await chrome.storage.local.set({
      x: field("x").checked, youtube: field("youtube").checked, terms: terms.join("\n")
    });
    field("terms").value = terms.join("\n");
    feedback.textContent = terms.length + " ifade kaydedildi.";
  } catch {
    feedback.textContent = "Kaydedilemedi. Tekrar dene.";
  }
});
initialize().catch(() => { feedback.textContent = "Ayarlar yüklenemedi."; });
