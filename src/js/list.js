const categories = [
  { name: "Cold dishes", container: "menuContainerCold" },
  { name: "First courses", container: "menuContainerFirst" },
  { name: "Second courses", container: "menuContainerSecond" },
  { name: "Side dishes", container: "menuContainerSide" },
  { name: "Drinks", container: "menuContainerDrinks" },
  { name: "Bakery", container: "menuContainerBakery" },
  { name: "Bread", container: "menuContainerBread" },
];

// Replace with your Railway domain
const BASE_URL = "https://on-screen-food-menu-2-server.railway.app"; // e.g., https://my-php-backend.up.railway.app
//try with up added to url

let allMenuItems = []; // Store all items for filtering

// Fetch data from Railway backend
const requests = categories.map(({ name, container }) =>
  fetch(`${BASE_URL}/list.php?category=${encodeURIComponent(name)}`)
    .then((response) => response.json())
    .then((data) => {
      allMenuItems = allMenuItems.concat(
        data.map((item) => ({ ...item, category: name }))
      );
      return { container, data };
    })
);

Promise.all(requests).then((results) => {
  results.forEach(({ container, data }) => {
    renderMenu(container, data);
  });

  // Search functionality
  const searchBar = document.getElementById("searchBar");
  searchBar.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    filterMenuItems(searchTerm);
  });
});

// Render category section (unchanged)
function renderMenu(containerId, data) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  data.forEach((item) => {
    let menuItem = `
      <div class="menu-item" data-id="${item.id}">
        <div class="menu-weight editable" data-field="code" contenteditable="true" data-original="${item.code}">${item.code}</div>
        <div class="menu-info">
          <div class="menu-title editable" data-field="title" contenteditable="true" data-original="${item.title}">${item.title}</div>
          <div class="menu-description editable" data-field="description" contenteditable="true" data-original="${item.description}">${item.description}</div>
        </div>
        <div class="menu-weight editable" data-field="weight" contenteditable="true" data-original="${item.weight}">${item.weight} g</div>
        <div class="menu-price editable" data-field="price" contenteditable="true" data-original="${item.price}">${item.price} $</div>
        <div class="save-delete-align"><button class="save-btn" style="display: none;">√</button>
        <button class="delete-btn">X</button>
        </div>
      </div>
    `;
    container.innerHTML += menuItem;
  });

  // Add event listeners for real-time updates
  container.querySelectorAll(".editable").forEach((element) => {
    element.addEventListener("focus", function () {
      if (this.dataset.field === "weight")
        this.textContent = this.textContent.replace(" g", "");
      if (this.dataset.field === "price")
        this.textContent = this.textContent.replace(" $", "");
    });

    const checkChanges = function () {
      const original = this.dataset.original;
      let current = this.textContent;

      if (this.dataset.field === "weight" && !current.includes(" g")) {
        current += " g";
        this.textContent = current;
      }
      if (this.dataset.field === "price" && !current.includes(" $")) {
        current += " $";
        this.textContent = current;
      }

      const saveBtn = this.closest(".menu-item").querySelector(".save-btn");
      const strippedCurrent = current.replace(/ g| $/g, "");
      if (strippedCurrent !== original) {
        saveBtn.style.display = "inline-block";
      } else {
        saveBtn.style.display = "none";
      }
    };

    element.addEventListener("blur", checkChanges);

    element.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        this.blur();
      }
    });
  });

  container.querySelectorAll(".save-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const menuItem = this.closest(".menu-item");
      const id = menuItem.dataset.id;
      saveItem(id);
    });
  });

  container.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const menuItem = this.closest(".menu-item");
      const id = menuItem.dataset.id;
      deleteItem(id, menuItem);
    });
  });

  toggleCategoryVisibility(containerId, data.length > 0);
}

// Filter menu items (unchanged)
function filterMenuItems(searchTerm) {
  categories.forEach((category) => {
    document.getElementById(category.container).innerHTML = "";
  });

  const filteredItems = allMenuItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.code.toLowerCase().includes(searchTerm)
  );

  const itemsByCategory = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  categories.forEach((category) => {
    const data = itemsByCategory[category.name] || [];
    renderMenu(category.container, data);
  });
}

// Toggle category visibility (unchanged)
function toggleCategoryVisibility(containerId, hasItems) {
  const categoryElement = document.querySelector(`#category + #${containerId}`);
  if (categoryElement && categoryElement.previousElementSibling) {
    const categoryHeader = categoryElement.previousElementSibling;
    categoryHeader.style.display = hasItems ? "block" : "none";
  }
}

// Save item to Railway backend
function saveItem(id) {
  const menuItem = document.querySelector(`.menu-item[data-id="${id}"]`);
  const updatedData = {
    id: id,
    code: menuItem.querySelector('[data-field="code"]').textContent,
    title: menuItem.querySelector('[data-field="title"]').textContent,
    description: menuItem.querySelector('[data-field="description"]')
      .textContent,
    weight: menuItem
      .querySelector('[data-field="weight"]')
      .textContent.replace(" g", ""),
    price: menuItem
      .querySelector('[data-field="price"]')
      .textContent.replace(" $", ""),
    category: categories.find((cat) =>
      document.getElementById(cat.container).contains(menuItem)
    ).name,
  };

  fetch(`${BASE_URL}/list.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        menuItem.querySelectorAll(".editable").forEach((element) => {
          const newValue = element.textContent.replace(/ g| $/g, "");
          element.dataset.original = newValue;
        });
        menuItem.querySelector(".save-btn").style.display = "none";
        alert("Item updated successfully");
      } else {
        alert("Error updating item: " + data.error);
      }
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

// Delete item from Railway backend
function deleteItem(id, menuItemElement) {
  if (!confirm("Are you sure you want to delete this item?")) return;

  fetch(`${BASE_URL}/list.php`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        menuItemElement.remove();
        alert("Item deleted successfully");
      } else {
        alert("Error deleting item: " + data.error);
      }
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}
