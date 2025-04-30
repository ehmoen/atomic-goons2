export function rgbaColor(r, g, b, a = 255) {
    return `rgba(${r},${g},${b},${a})`;
}

export function rand(range) {
    return (Math.floor(Math.random() * (range + 1)));
}

export function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

export function drawStars(el, numStars){

    for (let i = 0; i < numStars; i++) {
        let star = el.appendChild(document.createElement("div"));
        star.className = "star";
        const xy = getRandomPosition();
        star.style.top = xy[0] + 'px';
        star.style.left = xy[1] + 'px';
        el.append(star);
    }

    function getRandomPosition() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const randomX = Math.floor(Math.random() * height);
        const randomY = Math.floor(Math.random() * width);
        return [randomX, randomY];
    }
}