const youtube = location.hostname.endsWith(".youtube.com");
const cards = youtube
  ? "ytd-rich-item-renderer,ytd-video-renderer,ytd-compact-video-renderer,ytd-grid-video-renderer,ytd-reel-item-renderer,yt-lockup-view-model,ytm-video-with-context-renderer,ytm-compact-video-renderer,ytm-shorts-lockup-view-model"
  : 'article[data-testid="tweet"],article[role="article"]';
const titles = '#video-title,#video-title-link,.yt-lockup-metadata-view-model__title,.shortsLockupViewModelHostMetadataTitle,h3,[role="heading"]';
const revealed = new WeakMap();
let terms = [];
let scheduled = false;

function scan() {
  scheduled = false;
  for (const card of document.querySelectorAll(cards)) {
    if (card.parentElement?.closest(cards)) continue;
    let button = card.querySelector(":scope > .gta-reveal");
    const raw = youtube
      ? [...card.querySelectorAll(titles)].map(node => node.title || node.textContent).join(" ")
      : card.textContent.replace(button?.textContent || /$^/, "") + " " +
        [...card.querySelectorAll("img[alt]")].map(img => img.alt).join(" ");
    const value = " " + normalize(raw) + " ";
    const link = youtube ? card.querySelector('a[href*="/watch?"],a[href*="/shorts/"]') : card.querySelector("time")?.closest("a");
    const key = (link?.getAttribute("href") || "") + "|" + value;
    const hide = revealed.get(card) !== key && terms.some(term => value.includes(term));
    card.classList.toggle("gta-spoiler", hide);
    if (!hide) {
      button?.remove();
      continue;
    }
    if (!button) {
      button = document.createElement("button");
      button.className = "gta-reveal";
      button.type = "button";
      button.textContent = "Spoilerı göster";
      card.append(button);
    }
    button.onclick = event => {
      event.preventDefault();
      event.stopPropagation();
      revealed.set(card, key);
      card.classList.remove("gta-spoiler");
      button.remove();
    };
  }
}
function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(scan);
}
async function refresh() {
  const settings = await chrome.storage.local.get(defaults);
  terms = (youtube ? settings.youtube : settings.x)
    ? parseTerms(settings.terms).map(term => " " + normalize(term) + " ") : [];
  schedule();
}
new MutationObserver(records => {
  if (records.some(record => record.type !== "childList" ||
    [...record.addedNodes, ...record.removedNodes].some(node => !node.classList?.contains("gta-reveal")))) schedule();
}).observe(document, {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["alt", "title", "href"]});
chrome.storage.onChanged.addListener(refresh);
refresh();
