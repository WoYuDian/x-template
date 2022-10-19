export function getImageUrl(image: string) {
    return `url(s2r://panorama${image.split('{resources}')[1]})`
}