import * as utils from '../js/utils.js';
console.log('Imported utils:', utils);

/**
 * Retourne un entier aléatoire entre min et max (inclus)
 */
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Détecte si deux rectangles se chevauchent
 */
export function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
        return false;
    }
    return true;
}

/**
 * Détecte si deux cercles se chevauchent
 */
export function circleIntersect(x1, y1, r1, x2, y2, r2) {
    const squareDistance = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
    return squareDistance <= (r1 + r2) * (r1 + r2);
}

/**
 * Formate un temps en millisecondes au format MM:SS:CC (centièmes)
 */
export function timeToString(time) {
    const diffInHrs = time / 3600000;
    const hh = Math.floor(diffInHrs);

    const diffInMin = (diffInHrs - hh) * 60;
    const mm = Math.floor(diffInMin);

    const diffInSec = (diffInMin - mm) * 60;
    const ss = Math.floor(diffInSec);

    const diffInMs = (diffInSec - ss) * 100;
    const ms = Math.floor(diffInMs);

    const formattedMM = mm.toString().padStart(2, '0');
    const formattedSS = ss.toString().padStart(2, '0');
    const formattedMS = ms.toString().padStart(2, '0');

    return `${formattedMM}:${formattedSS}:${formattedMS}`;
}

/**
 * Génère une chaîne aléatoire de longueur donnée avec des lettres minuscules
 */
export function generateString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

/**
 * Calcule la position absolue d'un élément dans la page
 */
export function getPosition(el) {
    let xPosition = 0;
    let yPosition = 0;

    while (el) {
        xPosition += el.offsetLeft - el.scrollLeft + el.clientLeft;
        yPosition += el.offsetTop - el.scrollTop + el.clientTop;
        el = el.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}