/* eslint-disable */

function _ClassErrorPrefix(className) {
    return `Error in class "${className}": `
}

function _MessagePostFix(message) {
    return message != "" ? " " + message : ""
}

export function MissingOverloadException(className, methodName, message = "") {
    throw new Error(`${_ClassErrorPrefix(className)}Method ${methodName} needs to be overloaded!${_MessagePostFix(message)}`)
}