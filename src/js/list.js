const categories = [
  { name: "Cold dishes", container: "menuContainerCold" },
  { name: "First courses", container: "menuContainerFirst" },
  { name: "Second courses", container: "menuContainerSecond" },
  { name: "Side dishes", container: "menuContainerSide" },
  { name: "Drinks", container: "menuContainerDrinks" },
  { name: "Bakery", container: "menuContainerBakery" },
  { name: "Bread", container: "menuContainerBread" },
];

let allMenuItems = []; // Store all items for filtering

//List + edit + delete + save

const requests = categories.map(({ name, container }) =>
  fetch(`app/list.php?category=${encodeURIComponent(name)}`)
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

// Render category section
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

    // Function to check changes and show save button
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

    // Handle blur (calls checkChanges)
    element.addEventListener("blur", checkChanges);

    // Handle Enter key press (new addition)
    element.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent line break in contenteditable
        this.blur(); // Trigger blur to run checkChanges and update UI
      }
    });
  });

  // Add click handlers to save buttons
  container.querySelectorAll(".save-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const menuItem = this.closest(".menu-item");
      const id = menuItem.dataset.id;
      saveItem(id);
    });
  });
  // Add click handlers to delete buttons
  container.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const menuItem = this.closest(".menu-item");
      const id = menuItem.dataset.id;
      deleteItem(id, menuItem);
    });
  });

  //Toggle category visibility
  toggleCategoryVisibility(containerId, data.length > 0);
}

function filterMenuItems(searchTerm) {
  // Clear all containers
  categories.forEach((category) => {
    document.getElementById(category.container).innerHTML = "";
  });

  // Filter items
  const filteredItems = allMenuItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.code.toLowerCase().includes(searchTerm)
  );

  // Group filtered items by category
  const itemsByCategory = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Render filtered items
  categories.forEach((category) => {
    const data = itemsByCategory[category.name] || [];
    renderMenu(category.container, data);
  });
}

function toggleCategoryVisibility(containerId, hasItems) {
  const categoryElement = document.querySelector(`#category + #${containerId}`);
  if (categoryElement && categoryElement.previousElementSibling) {
    const categoryHeader = categoryElement.previousElementSibling;
    categoryHeader.style.display = hasItems ? "block" : "none";
  }
}

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

  fetch("app/list.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Update original values and hide save button
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

function deleteItem(id, menuItemElement) {
  if (!confirm("Are you sure you want to delete this item?")) return;

  fetch("app/list.php", {
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
