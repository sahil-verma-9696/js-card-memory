function initializeTheme() {
  const toggleBtn = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme") || "light";

  document.body.classList.add(`${savedTheme}-mode`);
  toggleBtn.innerText = savedTheme === "dark" ? "Light Mode" : "Dark Mode";

  toggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-mode");

    document.body.classList.toggle("dark-mode", !isDark);
    document.body.classList.toggle("light-mode", isDark);

    const newTheme = isDark ? "light" : "dark";
    localStorage.setItem("theme", newTheme);

    toggleBtn.innerText = newTheme === "dark" ? "Light Mode" : "Dark Mode";
  });
}

export { initializeTheme };
