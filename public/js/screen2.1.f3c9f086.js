(()=>{const n=[{name:"Cold dishes",container:"menuContainerCold"},{name:"First courses",container:"menuContainerFirst"},{name:"Second courses",container:"menuContainerSecond"}].map((({name:n,container:e})=>fetch(`app/extractor.php?category=${encodeURIComponent(n)}`).then((n=>n.json())).then((n=>({container:e,data:n})))));Promise.all(n).then((n=>{n.forEach((({container:n,data:e})=>{!function(n,e){const i=document.getElementById(n);e.forEach((n=>{let e=`\n            <div class="menu-item">\n\n            <div class="menu-info">\n            <div class="menu-title">${n.title}</div>\n            <div class="menu-description">${n.description}</div>\n            </div>\n            <div class="menu-weight">${n.weight} g</div\n                <div class="menu-price">${n.price} $</div>\n            </div>\n        `;i.innerHTML+=e}))}(n,e)}))}))})();