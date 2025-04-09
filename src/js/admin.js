// Data inject to database

document
  .getElementById("form-wrapper")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const code = document.getElementById("code").value;
    const category = document.getElementById("categories").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const weight = document.getElementById("weight").value;
    const price = document.getElementById("price").value;

    const data = JSON.stringify({
      code: code,
      category: category,
      title: title,
      description: description,
      weight: weight,
      price: price,
    });

    fetch("app/injector.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    // console.log(data);
  });

// Database record deletion

document
  .getElementById("form-wrapper-2")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const code = this.code.value;
    const data = JSON.stringify({ code: code });

    try {
      const response = await fetch("app/wiper.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Dish successfully deleted!");
        this.reset();
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Query error:", error);
    }
  });
