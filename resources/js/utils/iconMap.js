export const loadIcons = () => {
    const modules = import.meta.glob("../icons/heroicons/*.vue"); // Локальный путь
    const icons = {};

    for (const path in modules) {
        const iconName = path.split("/").pop().replace(".vue", ""); // Извлекаем имя иконки
        icons[iconName] = modules[path];
    }

    return icons;
};
