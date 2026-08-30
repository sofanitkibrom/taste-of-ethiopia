
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) toggle.addEventListener("click", () => links.classList.toggle("open"));

  document.querySelectorAll("[data-lightbox]").forEach(img => {
    img.addEventListener("click", () => {
      const box = document.getElementById("lightbox");
      const preview = document.getElementById("lightbox-img");
      if (!box || !preview) return;
      preview.src = img.src;
      preview.alt = img.alt;
      box.classList.add("show");
    });
  });
  const box = document.getElementById("lightbox");
  if (box) box.addEventListener("click", () => box.classList.remove("show"));

  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll("[data-category]");
  const empty = document.querySelector(".empty");
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      let shown = 0;
      cards.forEach(card => {
        const categories = card.dataset.category.split(" ");
        const show = filter === "all" || categories.includes(filter);
        card.style.display = show ? "" : "none";
        if (show) shown++;
      });
      if (empty) empty.style.display = shown ? "none" : "block";
    });
  });
});
/* ==========================================================
   FAVORITES SYSTEM
   Taste of Ethiopia
   ========================================================== */


/*
   Get the favorites saved in the browser.
   If there aren't any yet, use an empty array.
*/

function getFavorites() {

    return JSON.parse(
        localStorage.getItem("tasteOfEthiopiaFavorites")
    ) || [];

}


/*
   Save favorites to the browser.
*/

function saveFavorites(favorites) {

    localStorage.setItem(
        "tasteOfEthiopiaFavorites",
        JSON.stringify(favorites)
    );

}


/*
   Add or remove a favorite.
*/

function toggleFavorite(button) {

    const food = {

        name: button.dataset.name,

        image: button.dataset.image,

        description:
            button.dataset.description || "",

        link:
            button.dataset.link || ""

    };


    let favorites = getFavorites();


    /*
       Check whether this food is already saved.
    */

    const existingIndex =
        favorites.findIndex(
            item => item.name === food.name
        );


    if (existingIndex === -1) {

        /*
           Add favorite
        */

        favorites.push(food);

        button.classList.add("favorited");

        button.innerHTML = "♥";

    } else {

        /*
           Remove favorite
        */

        favorites.splice(existingIndex, 1);

        button.classList.remove("favorited");

        button.innerHTML = "♡";

    }


    saveFavorites(favorites);

}


/*
   Set the correct heart when a page loads.
*/

function updateFavoriteButtons() {

    const favorites = getFavorites();


    document
        .querySelectorAll(".favorite-btn")
        .forEach(button => {

            const name =
                button.dataset.name;

            const isFavorite =
                favorites.some(
                    item => item.name === name
                );


            if (isFavorite) {

                button.classList.add("favorited");

                button.innerHTML = "♥";

            } else {

                button.classList.remove("favorited");

                button.innerHTML = "♡";

            }

        });

}


/*
   Add click events to all favorite buttons.
*/

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(".favorite-btn");


        if (!button) return;


        event.preventDefault();

        event.stopPropagation();


        toggleFavorite(button);

    }
);


/* ==========================================================
   DISPLAY FAVORITES PAGE
   ========================================================== */

function displayFavorites() {

    const grid =
        document.getElementById("favorites-grid");

    const empty =
        document.getElementById("no-favorites");


    /*
       If this isn't the Favorites page,
       stop here.
    */

    if (!grid) return;


    const favorites =
        getFavorites();


    /*
       No favorites
    */

    if (favorites.length === 0) {

        grid.innerHTML = "";

        if (empty) {
            empty.style.display = "block";
        }

        return;

    }


    /*
       We have favorites
    */

    if (empty) {
        empty.style.display = "none";
    }


    grid.innerHTML =
        favorites.map(food => `

            <div class="gallery-item">

                <img
                    src="${food.image}"
                    alt="${food.name}"
                >

                <div class="gallery-caption">

                    <h3>
                        ${food.name}
                    </h3>

                    <p>
                        ${food.description}
                    </p>

                    <br>

                    ${
                        food.link
                        ? `
                        <a
                            href="${food.link}"
                            class="text-link"
                        >
                            View Recipe →
                        </a>
                        `
                        : ""
                    }

                    <br><br>

                    <button
                        class="favorite-btn favorited"
                        data-name="${food.name}"
                        data-image="${food.image}"
                        data-description="${food.description}"
                        data-link="${food.link}"
                    >
                        ♥
                    </button>

                </div>

            </div>

        `).join("");

}


/*
   Run everything when the page loads.
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateFavoriteButtons();

        displayFavorites();

    }
);