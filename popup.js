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
  feedback.textContent = "Select Save to apply the starter list.";
});
document.querySelector("form").addEventListener("submit", async event => {
  event.preventDefault();
  const terms = parseTerms(field("terms").value);
  try {
    await chrome.storage.local.set({
      x: field("x").checked, youtube: field("youtube").checked, terms: terms.join("\n")
    });
    field("terms").value = terms.join("\n");
    feedback.textContent = terms.length + " keywords saved.";
  } catch {
    feedback.textContent = "Could not save settings. Try again.";
  }
});
initialize().catch(() => { feedback.textContent = "Could not load settings."; });
