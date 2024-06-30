export const setPropertyByPath = (object, path, value) => {
    const pathParts = path.split('.');
    let current = object;
    for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
    }
    current[pathParts[pathParts.length - 1]] = {
        value,
        generatedByAI: false,
        id : current[pathParts[pathParts.length - 1]].id
    };
    return object;
}

