/** Navigation and Clipboard Helper */

export function initNav(): void {
  if (typeof window === "undefined") {
    return;
  }

  // Copy button
  const copyBtn = document.getElementById("copy-cmd-btn");
  const cmdText = document.getElementById("cmd-text");
  if (copyBtn && cmdText) {
    copyBtn.addEventListener("click", () => {
      const text = cmdText.textContent?.trim() || "bun add @qntx/core";
      navigator.clipboard
        .writeText(text)
        .then(() => {
          const original = copyBtn.textContent;
          copyBtn.textContent = "COPIED";
          copyBtn.classList.add("bg-neutral-950", "text-white");
          setTimeout(() => {
            copyBtn.textContent = original;
            copyBtn.classList.remove("bg-neutral-950", "text-white");
          }, 1600);
        })
        .catch(() => {
          // Ignore clipboard permission errors
        });
    });
  }

  // Page active observer
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          const { id } = entry.target;
          document.querySelectorAll("[data-page-link]").forEach((link) => {
            const target = link.getAttribute("data-page-link");
            link.classList.toggle("text-neutral-950", target === id);
            link.classList.toggle("font-bold", target === id);
            link.classList.toggle("text-neutral-400", target !== id);
          });
        }
      }
    },
    { threshold: [0.4, 0.7] },
  );

  const p1 = document.getElementById("page-1");
  const p2 = document.getElementById("page-2");
  if (p1) {
    observer.observe(p1);
  }
  if (p2) {
    observer.observe(p2);
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    initNav();
  });
}
