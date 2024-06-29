export const setPropertyByPath = (object, path, value) => {
    console.log(path, "path")
    const pathParts = path.split('.');
    let current = object;
    for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
    }
    console.log(current[pathParts[pathParts.length - 1]], "iciiii")
    current[pathParts[pathParts.length - 1]] = {
        value,
        generatedByAI: false,
        id : current[pathParts[pathParts.length - 1]].id
    };
    return object;
}

