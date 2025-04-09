// Simultaneous data request

const categories = [
  { name: "Cold dishes", container: "menuContainerCold" },
  { name: "First courses", container: "menuContainerFirst" },
  // { name: "Second courses", container: "menuContainerSecond" },
  // { name: "Side dishes", container: "menuContainerSide" },
  // { name: "Drinks", container: "menuContainerDrinks" },
  // { name: "Bakery", container: "menuContainerBakery" },
];

const requests = categories.map(({ name, container }) =>
  fetch(`app/extractor.php?category=${encodeURIComponent(name)}`)
    .then((response) => response.json())
    .then((data) => ({ container, data }))
);

Promise.all(requests).then((results) => {
  results.forEach(({ container, data }) => {
    renderMenu(container, data);
  });
});

function renderMenu(containerId, data) {
  const container = document.getElementById(containerId);

  data.forEach((item) => {
    let menuItem = `
            <div class="menu-item">
                <div class="menu-weight">${item.weight} g</div>
                <div class="menu-info">
                    <div class="menu-title">${item.title}</div>
                    <div class="menu-description">${item.description}</div>
                </div>
                <div class="menu-price">${item.price} $</div>
            </div>
        `;

    container.innerHTML += menuItem;
  });
}
