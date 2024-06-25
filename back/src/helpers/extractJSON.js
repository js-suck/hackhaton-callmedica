const extractJSON = (chaine) => {
const pattern = /{.*?}/; // Cela correspond à tout ce qui est entre des accolades {}
const match = chaine.match(pattern);

if (match) {
    const jsonStr = match[0];
    try {
        const jsonObj = JSON.parse(jsonStr);
        return jsonObj;
    } catch (error) {
        console.error("Erreur lors de l'analyse JSON :", error);
    }
} else {
    return false
    console.log("Aucun JSON trouvé dans la chaîne.");
}
}

module.exports = extractJSON;