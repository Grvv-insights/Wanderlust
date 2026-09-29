  document.addEventListener("DOMContentLoaded", function () {
    const filters = document.getElementById("filters");
    const leftArrow = document.getElementById("filters-left");
    const rightArrow = document.getElementById("filters-right");
    const scrollAmount = 200; // px moved per click

    function updateArrows() {
      leftArrow.classList.toggle("disabled", filters.scrollLeft <= 0);
      rightArrow.classList.toggle(
        "disabled",
        filters.scrollLeft + filters.clientWidth >= filters.scrollWidth - 1
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
    updateArrows(); // set initial state
  });
const taxToggle = document.getElementById("taxToggle");
let showTotalPrice = localStorage.getItem("showTotalPrice") === "true";

function updateAllPrices() {
  document.querySelectorAll(".price-display").forEach((el) => {
    const basePrice = parseFloat(el.dataset.basePrice);
    if (showTotalPrice) {
      const gst = Math.round(basePrice * 0.18);
      const total = basePrice + gst;
      el.textContent = `₹${basePrice.toLocaleString()} + 18% GST = ₹${total.toLocaleString()}/night`;
    } else {
      el.textContent = `₹${basePrice.toLocaleString()}/night`;
    }
  });
  taxToggle.classList.toggle("active", showTotalPrice);
}

taxToggle.addEventListener("click", () => {
  showTotalPrice = !showTotalPrice;
  localStorage.setItem("showTotalPrice", showTotalPrice);
  updateAllPrices();
});

updateAllPrices();