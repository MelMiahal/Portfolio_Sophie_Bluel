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
    else {
        const filteredWorks = works.filter(work => work.categoryId == categoryId);
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
            if (response.ok) {
                const data = await response.json();
                console.log("réponse de l'API:", data);
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
// Etape 6 : Ajout et gestion de la Modale ========================================
//=================================================================================
const modal = document.getElementById("modal");
const closeModalBtn = document.querySelector(".js-modal-close");
// 1. Fonction pour ouvrir la modale
function openModal(e) {
    e.preventDefault();
    modal.style.display = "flex";
}
// 2. Fonction pour fermer la modale
function closeModal() {
    modal.style.display = "none";
}
//Ouverture au clic sur modifier avec element dynamique
document.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".btn-modal-open");
    if (editBtn) {
        openModal(e);
    }
})
// Événement de fermeture au clic sur la croix
if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
}
// Fermeture au clic sur le fond gris en dehors de la boîte blanche
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});
// --- AFFICHAGE DES PROJETS DANS LA MODALE ---
async function displayModalGallery() {
    const modalGallery = document.querySelector(".modal-gallery");
    if (!modalGallery) return;
    // Vide la galerie pour éviter les doublons
    modalGallery.innerHTML = "";
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();

        works.forEach(work => {
            const figure = document.createElement("figure");

            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;

            const trashIcon = document.createElement("i");
            trashIcon.classList.add("fa-solid", "fa-trash-can");
            // Id poubelle
            trashIcon.dataset.id = work.id;
            // --- Supp projet au click poubelle ---
            trashIcon.addEventListener("click", async () => {
                const workId = trashIcon.dataset.id;
                const token = localStorage.getItem("token");

                try {
                    const deleteResponse = await fetch("http://localhost:5678/api/works/" + workId, {
                        method: "DELETE",
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    });
                    if (deleteResponse.ok) {
                        //Rafraichis la modale et la page pour suppresion
                        displayModalGallery();
                        const works = await getWorks();
                        displayWorks(works);
                        displayModalGallery();
                    } else {
                        console.error("Erreur lors de la suppresion du projet");
                    }
                } catch (error) {
                    console.error("Erreur réseau", error);
                }
            });
            figure.appendChild(img);
            figure.appendChild(trashIcon);
            modalGallery.appendChild(figure);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des projets de la modale", error);
    }
}
// --- Formulaire d'ajout d'image et vu Modale ---
const modalViewGallery = document.querySelector(".modal-view:nth-of-type(1)");
const modalViewForm = document.querySelector(".modal-view:nth-of-type(2)");
const btnOpenAddForm = document.querySelector(".btn-add-photo");
const btnBackToGallery = document.querySelector(".js-modalback");

// 1. Passer de la galerie au formulaire d'ajout
if (btnOpenAddForm) {
    btnOpenAddForm.addEventListener("click", () => {
        modalViewGallery.style.display = "none";
        modalViewForm.style.display = "block";
    });
}

// 2. Revenir du formulaire à la galerie grâce à la flèche de retour
if (btnBackToGallery) {
    btnBackToGallery.addEventListener("click", () => {
        modalViewForm.style.display = "none";
        modalViewGallery.style.display = "block";
    });
}
//3. Ajout catégorie dans le selecteur Modale
async function displayCategoryOptions() {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();

        const selectCategory = document.getElementById("category");

        // Option vide par défaut (pour respecter la maquette)
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.text = "";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectCategory.appendChild(defaultOption);

        // Ajout des catégories de l'API
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.text = category.name;
            selectCategory.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des catégories pour le formulaire", error);
    }
}
// --- GESTION DE L'APERÇU DE L'IMAGE ET DU FORMULAIRE D'AJOUT ---

const fileInput = document.getElementById("file-upload");
const addPhotoContainer = document.querySelector(".add-photo-container");
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("category");
const submitBtn = document.getElementById("submit-btn");

let uploadedFile = null;

// 1. Afficher l'aperçu de l'image choisie
fileInput.addEventListener("change", (e) => {
    uploadedFile = e.target.files[0];
    if (uploadedFile) {
        addPhotoContainer.innerHTML = "";

        const previewImage = document.createElement("img");
        previewImage.src = URL.createObjectURL(uploadedFile);
        previewImage.style.maxHeight = "100%";
        previewImage.style.maxWidth = "100%";
        previewImage.style.objectFit = "contain";

        addPhotoContainer.appendChild(previewImage);

        checkFormValidity();
    }
});

// 2. Vérifier si tous les champs sont remplis pour activer le bouton Valider
function checkFormValidity() {
    if (uploadedFile && titleInput.value.trim() !== "" && categorySelect.value !== "") {
        submitBtn.removeAttribute("disabled");
        submitBtn.style.backgroundColor = "#1D6154"; // Couleur verte de validation
    } else {
        submitBtn.setAttribute("disabled", "true");
        submitBtn.style.backgroundColor = ""; // Réinitialise le style
    }
}

titleInput.addEventListener("input", checkFormValidity);
categorySelect.addEventListener("change", checkFormValidity);

// --- ENVOI DU NOUVEAU PROJET VIA L'API (POST) ---

const addPhotoForm = document.getElementById("add-photo-form");

addPhotoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // Création d'un objet FormData pour envoyer un fichier et des données texte
    const formData = new FormData();
    formData.append("image", uploadedFile);
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
                // Note : Pas de Content-Type "application/json" avec FormData, le navigateur gère le multipart/form-data tout seul
            },
            body: formData
        });

        if (response.ok) {
            const newWork = await response.json();

            // 1. Rafraîchir les galeries (sur la page principale et dans la modale)
            const works = await getWorks();
            displayWorks(works);
            displayModalGallery();

            // 2. Réinitialiser et vider le formulaire
            addPhotoForm.reset();
            uploadedFile = null;

            // Restaurer l'affichage initial du conteneur d'image
            addPhotoContainer.innerHTML = `
                <i class="fa-regular fa-image"></i>
                <label for="file-upload" class="label-file">+ Ajouter photo</label>
                <input type="file" id="file-upload" name="image" accept="image/png, image/jpeg" style="display: none;">
                <p>jpg, png : 4mo max</p>
            `;

            // Ré-écouter le nouvel input file qui vient d'être recréé dynamiquement dans le HTML
            rebindFileInput();

            // Désactiver à nouveau le bouton de validation
            submitBtn.setAttribute("disabled", "true");
            submitBtn.style.backgroundColor = "";

            // 3. Fermer la modale ou revenir à la galerie (ici on ferme ou on revient à la galerie, au choix)
            modalViewForm.style.display = "none";
            modalViewGallery.style.display = "block";
            modal.style.display = "none";

        } else {
            console.error("Erreur lors de l'ajout du projet");
        }
    } catch (error) {
        console.error("Erreur réseau", error);
    }
});

// Petite fonction pour ré-attacher l'événement sur l'input file recréé dynamiquement
function rebindFileInput() {
    const newFileInput = document.getElementById("file-upload");
    newFileInput.addEventListener("change", (e) => {
        uploadedFile = e.target.files[0];
        if (uploadedFile) {
            addPhotoContainer.innerHTML = "";
            const previewImage = document.createElement("img");
            previewImage.src = URL.createObjectURL(uploadedFile);
            previewImage.style.maxHeight = "100%";
            previewImage.style.maxWidth = "100%";
            previewImage.style.objectFit = "contain";
            addPhotoContainer.appendChild(previewImage);
            checkFormValidity();
        }
    });
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
    //Ouverture de la Modale
    displayModalGallery();
    // Appel de la fonction pour charger les catégories au démarrage
    displayCategoryOptions();

}
// initialisation de la page au chargement
if (document.querySelector(".gallery")) {
    init();
}
