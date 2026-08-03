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
// Appelle la fonction a executer 
getWorks();