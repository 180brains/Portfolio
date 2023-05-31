document.addEventListener("DOMContentLoaded", function() {
    const toggleHeaders = document.querySelectorAll(".toggle-header");

    toggleHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        const toggleContent = header.nextElementSibling;
        toggleContent.classList.toggle("active");
      });
    });
  });