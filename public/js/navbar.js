// public/js/navbar.js

document.addEventListener("DOMContentLoaded", function () {
  // Arrow Scroll Logic
  const filters = document.getElementById("filters");
  const leftArrow = document.getElementById("filters-left");
  const rightArrow = document.getElementById("filters-right");
  const scrollAmount = 200;

  if (filters && leftArrow && rightArrow) {
    function updateArrows() {
      leftArrow.classList.toggle("disabled", filters.scrollLeft <= 0);
      rightArrow.classList.toggle(
        "disabled",
        filters.scrollLeft + filters.clientWidth >= filters.scrollWidth - 1,
      );
    }

    leftArrow.addEventListener("click", () => {
      filters.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    rightArrow.addEventListener("click", () => {
      filters.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    filters.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    updateArrows();
  }

  // Tax Toggle Switch Logic
  const taxSwitch = document.getElementById("taxSwitch");
  if (taxSwitch) {
    let showTotalPrice = localStorage.getItem("showTotalPrice") === "true";
    taxSwitch.checked = showTotalPrice;

    function updateAllPrices() {
      document.querySelectorAll(".price-display").forEach((el) => {
        const basePrice = parseFloat(el.dataset.basePrice);
        if (isNaN(basePrice)) return;

        if (showTotalPrice) {
          const gst = Math.round(basePrice * 0.18);
          const total = basePrice + gst;
          el.textContent = `₹${basePrice.toLocaleString("en-IN")} + 18% GST = ₹${total.toLocaleString("en-IN")}/night`;
        } else {
          el.textContent = `₹${basePrice.toLocaleString("en-IN")}/night`;
        }
      });
    }

    taxSwitch.addEventListener("change", () => {
      showTotalPrice = taxSwitch.checked;
      localStorage.setItem("showTotalPrice", showTotalPrice);
      updateAllPrices();
    });

    updateAllPrices();
  }
});
