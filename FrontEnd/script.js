// Recup' les travaux depuis L'API du Backend
async function getWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
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
// Appel a Getworks pour recuperer les travaux et les afficher
async function init() {
    const works = await getWorks();
    displayWorks(works);
}
// initialisation de l'application
init();