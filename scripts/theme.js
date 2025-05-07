function initializeTheme() {
  const toggleBtn = document.getElementById("theme-toggle");

  if(!toggleBtn) return;

  // Determines if the system prefers dark mode
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Get the user's saved them, if exists in localStorage
  const savedTheme = localStorage.getItem("theme");

  // If user's preference is available set that as initial. otherwise set system preference as initial
  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

  // Apply the initial theme to the document
  document.body.classList.remove("light-mode", "dark-mode");
  document.body.classList.add(`${initialTheme}-mode`);
  toggleBtn.innerText = savedTheme === "dark" ? "Light Mode" : "Dark Mode";

  // Handle user-initiated theme toggle
  toggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-mode");
    const newTheme = isDark ? "light" : "dark";

    // Update the theme and persist the choice
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(`${newTheme}-mode`);
    localStorage.setItem("theme", newTheme);
    toggleBtn.innerText = newTheme === "dark" ? "Light Mode" : "Dark Mode";
  });


  // If no user preference is saved, listen for system theme changes
  if(!savedTheme){
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      const systemTheme = e.matches ? "dark" : "light";

      // Apply the new system theme dynamically
      document.body.classList.remove("light-mode", "dark-mode");
      document.body.classList.add(`${systemTheme}-mode`);
      toggleBtn.innerText = systemTheme === "dark" ? "Light Mode" : "Dark Mode";
    })
  }

}

export { initializeTheme };
