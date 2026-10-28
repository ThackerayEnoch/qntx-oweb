/** Terminal Command and Clipboard Helper */

export function initNav(): void {
  if (typeof window === "undefined") {
    return;
  }

  const container = document.getElementById("cmd-container");
  const cmdText = document.getElementById("cmd-text");
  const feedback = document.getElementById("cmd-feedback");

  if (container && cmdText) {
    const handleCopy = () => {
      const text = cmdText.textContent?.trim() || "bun add @quantx/core";
      navigator.clipboard
        .writeText(text)
        .then(() => {
          if (feedback) {
            const original = feedback.textContent;
            feedback.textContent = "[copied]";
            feedback.classList.remove("opacity-0", "text-neutral-400");
            feedback.classList.add("text-emerald-600", "opacity-100");
            setTimeout(() => {
              feedback.textContent = original;
              feedback.classList.remove("text-emerald-600", "opacity-100");
              feedback.classList.add("opacity-0", "text-neutral-400");
            }, 1600);
          }
        })
        .catch(() => {
          // Clipboard fallback or permissions ignored
        });
    };

    container.addEventListener("click", handleCopy);
    container.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCopy();
      }
    });
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    initNav();
  });
}
