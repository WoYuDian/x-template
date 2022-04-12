export function printObject(object, level = 0, skipKeys = []) {
    let indentation = '';
    for(let i = 0; i < level; i++) {
        indentation += ' @ '
    }
    for(const key in object) {
        if(skipKeys.indexOf(key) > -1) {
            continue;
        }
        print(indentation, key, '++', object[key])
        if(object[key] instanceof Object) {
            printObject(object[key], level + 1, skipKeys)
        }
    }
}