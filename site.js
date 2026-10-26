// Search, filter and language picker for the statically rendered edition cards.
(function () {
  const grid = document.getElementById("edition-grid");
  const cards = Array.from(grid.querySelectorAll(".edition-card"));
  const search = document.getElementById("search");
  const select = document.getElementById("language-select");
  const summary = document.getElementById("catalogue-summary");
  const empty = document.getElementById("empty-state");
  const buttons = Array.from(document.querySelectorAll(".filter"));
  let active = "all";

  function render() {
    const q = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    for (const card of cards) {
      const okFilter = active === "all" || card.dataset.state === active;
      const okSearch = !q || card.dataset.search.includes(q);
      card.hidden = !(okFilter && okSearch);
      if (!card.hidden) visible += 1;
    }
    summary.textContent = visible === cards.length ? `${cards.length} editions` : `${visible} of ${cards.length} editions`;
    empty.hidden = visible !== 0;
  }

  function setFilter(name) {
    active = name;
    for (const b of buttons) {
      const on = b.dataset.filter === name;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    }
    render();
  }

  function focusCard(id) {
    if (!id) return;
    search.value = "";
    setFilter("all");
    const card = document.getElementById(id);
    if (!card) return;
    for (const c of cards) c.classList.remove("focused");
    card.classList.add("focused");
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    history.replaceState(null, "", "#" + id);
  }

  buttons.forEach(b => b.addEventListener("click", () => setFilter(b.dataset.filter)));
  search.addEventListener("input", render);
  select.addEventListener("change", e => focusCard(e.target.value));
  document.getElementById("clear-filters").addEventListener("click", () => { search.value = ""; setFilter("all"); search.focus(); });
  if (location.hash) {
    const id = decodeURIComponent(location.hash.slice(1));
    if (document.getElementById(id)) { select.value = id; focusCard(id); }
  }
  render();
})();
