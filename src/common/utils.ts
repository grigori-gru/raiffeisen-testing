export const getRandomWord = () =>
    Math.random()
        .toString(36)
        .substring(7);
