//===============================================================================
// Etape 1 & 2 : récupérer et afficher les travaux depuis L'API du Backend=======
//===============================================================================
async function getWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des travaux");
        } // Vérifier si la réponse est correcte = Bonne pratique a garder pour les appels API
        const works = await response.json();
        console.log("Travaux récupérés :", works);
        return works;
    } catch (error) {
        console.error("Erreur :", error);
    }
}
// Afficher les projets a partir des données recupérées du HTML
function displayWorks(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""; // Vider la galerie avant d'ajouter les nouveaux projets
    works.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}
//=================================================================================
// Etape 3 : Récup et affichage des filtres =======================================
//=================================================================================
async function getCategories() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des catégories");
        }
        const categories = await response.json();
        console.log("Catégories récupérées :", categories);
        displayCategories(categories);
        return categories;
    } catch (error) {
        console.error("Erreur :", error);
    }
}
function displayCategories(categories) {
    const filtersContainer = document.querySelector(".filters-container");
    filtersContainer.innerHTML = ""; // Vider le conteneur avant d'ajouter les nouveaux filtres
const btnAll = document.createElement("button");
    btnAll.textContent = "Tous";
    btnAll.classList.add("filter-btn");
    filtersContainer.appendChild(btnAll);
// Création des boutons des catégories de l'API
    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.textContent = category.name;
        btn.classList.add("filter-btn");
        btn.dataset.id = category.id; // Ajouter l'ID de la catégorie comme attribut de données
        filtersContainer.appendChild(btn);
    });
}
//=================================================================================
// Etape 4 : Filtrage des travaux =================================================
//=================================================================================
function filterWorks(works, categoryId) {
    if (categoryId === "all") {
        displayWorks(works); // Retourner tous les travaux si "Tous" est sélectionné
    }
    else { const filteredWorks = works.filter(work => work.categoryId == categoryId);
        displayWorks(filteredWorks);
    }
}
function addFilterlisteners(works) {
    const filtercontainer = document.querySelector(".filters-container");
    filtercontainer.addEventListener("click", (event) => {
        const clickedButton = event.target.closest("button");
        if (!clickedButton) return; // Si aucun bouton n'est cliqué, ne rien faire
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
        clickedButton.classList.add("active");
        const categoryId = clickedButton.dataset.id || "all";
        filterWorks(works, categoryId);
    });
}
//=================================================================================
// Etape 5 : formulaire de connexion ==============================================
//=================================================================================
const loginForm = document.querySelector("#login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const email = document.querySelector("#email").value;
            const password = document.querySelector("#password").value;
            const userCredentials = { 
                email: email, 
                password: password 
            };
            try {
                const response = await fetch("http://localhost:5678/api/users/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userCredentials)
                });
                if (!response.ok) {
                    const data = await response.json();
                    localStorage.setItem("token", data.token);
                    window.location.href = "index.html"; // Redirection vers la page d'accueil après connexion réussie
                } else {
                    alert("Erreur lors de la connexion. Veuillez vérifier vos identifiants.");
                }
            } catch (error) {
                console.error("Erreur :", error);
            }
        });
    }
//=================================================================================
// Etape 5.3 : Page d'accueil connectée ===========================================
//=================================================================================
function checkUserLogin() {
    const token = localStorage.getItem("token");
    const loginLink = document.querySelector("header nav ul li a[href='login.html']");
    const filtersContainer = document.querySelector(".filters-container");
    if (token) {
        // Lien "Login" remplacé par "Logout"
        if (loginLink) {
            loginLink.textContent = "Logout";
            loginLink.href = "#";
        // Déconnexion au clic sur le lien "Logout"
            loginLink.addEventListener("click", (event) => {
                event.preventDefault();
                localStorage.removeItem("token");
                // Supp le bouton modifier
                window.location.reload(); // Recharger la page pour mettre à jour l'affichage
            });  
        } 
        if (filtersContainer) {
            filtersContainer.style.display = "none"; // Masquer les boutons de filtrage
        }
        const editBanner = document.createElement("aside");
        editBanner.classList.add("edit-banner");
        editBanner.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Mode édition`;
        document.body.insertBefore(editBanner, document.body.firstChild);
    }
    const portfolioTitle = document.querySelector("#portfolio h2");
    if (portfolioTitle) {
        const token = localStorage.getItem("token");
        const exixtingBtn = portfolioTitle.querySelector(".btn-modal-open");
        if (token && !exixtingBtn) {
            const editBtn = document.createElement("button");
            editBtn.classList.add("btn-modal-open");
            editBtn.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Modifier`;
            portfolioTitle.appendChild(editBtn);
        } else if (!token && exixtingBtn) {
            exixtingBtn.remove();
        }
    }
}

//=================================================================================
// Initialisation de la page ======================================================
//=================================================================================

// Appel a Getworks pour recuperer les travaux et les afficher
async function init() {
    const works = await getWorks();
    displayWorks(works);
    //Charges des boutons des categories 
    await getCategories();
    // Ajout des écouteurs d'événements pour le filtrage
    addFilterlisteners(works);
    // Connexion de l'utilisateur et affichage du mode édition si connecté
    checkUserLogin();
}
// initialisation de la page au chargement
init();