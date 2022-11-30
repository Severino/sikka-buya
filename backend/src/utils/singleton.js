// Taken from https://stackoverflow.com/questions/34382796/where-should-i-initialize-pg-promise
// Thanks @vitaly-t

// generic singleton creator:
export function createSingleton(name, create) {
    const s = Symbol.for(name);
    let scope = global[s];
    if (!scope) {
        scope = { ...create() };
        global[s] = scope;
    }
    return scope;
}