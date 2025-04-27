export function rgbaColor(r, g, b, a = 255) {
    return `rgba(${r},${g},${b},${a})`;
}

export function rand(range) {
    return (Math.floor(Math.random() * (range + 1)));
}

export function randomRange(min, max) {
    return min + Math.random() * (max - min);
}