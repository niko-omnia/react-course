// Function to save data into localstorage
export function setLocalData(key, value) {
    if (typeof value === "object" || typeof value === "boolean" || typeof value === "number") {
        localStorage.setItem(key, JSON.stringify(value));
    } else {
        localStorage.setItem(key, value);
    }
}

// Function to get data from localstorage
export function getLocalData(key) {
    const data = localStorage.getItem(key);
    if (data === null) return null;

    try {
        return JSON.parse(data);
    } catch (err) {
        return data;
    }
}

// Function to remove data from localstorage
export function removeLocalData(key) {
    localStorage.removeItem(key);
}
