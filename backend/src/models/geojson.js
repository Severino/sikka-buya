const { GraphQLError, GraphQLScalarType } = require('graphql')

class GeoJSON {

    //All implemented GeoJSON types: https://www.rfc-editor.org/rfc/rfc7946 
    static types = ['point', 'polygon']

    static get scalarType() {
        return new GraphQLScalarType({
            name: "GeoJSON",
            description: "A geometryobject projected on a map represented in JSON format. Containing two properties:\n * 'type': the name of the provided geometry\n* 'coordinates': a list of coordinates defining the geometry",
            serialize(value) {
                if (typeof value === "string") value = JSON.parse(value)
                return value
            },
            parseValue(value) {
                const json = JSON.parse(value)

                if (!json.type) {
                    throw new GraphQLError(`GeoJSON requires a type!`)
                } else if (GeoJSON.types.indexOf(json.type) === -1) {
                    throw new GraphQLError(`GeoJSON type "${json.type}" is either not valid or not implemented!`)
                } else {
                    switch (json.type.toLowerCase()) {
                        case GeoJsonPoint.type:
                            return GeoJsonPoint.parseValue(value)
                        default:
                            throw new GraphQLError(`GeoJSON type was not correctly implemented: ${json.type}`)
                    }
                }


            },
            parseLiteral(ast) {
                return ast.value
            }
        })
    }
}

class GeoJsonObject {
    static validateJSON(string) {
        let value = null
        try {
            let result = JSON.parse(string)
            let err = []
            if (!result.type) {
                err.push(`type`)
            }

            if (!result.coordinates) {
                err.push(`coordinates`)
            }

            if (err.length > 0) {
                throw new GraphQLError(`Incomplete GeoJSON, it's missing the attribute(s): ${err.join(", ")}`)
            } else {
                value = result
            }
        } catch (e) {
            throw new GraphQLError(`Could not parse GeoJSON string.`)
        }

        return val
    }

    static throwInvalidTypeError(expected, actual) {
        throw new GraphQLError(`Types doesn't match: expected ${expected}, but got ${actual}`)
    }
    static throwInvalideCoordinatesError(type, msg) {
        throw new GraphQLError(`Provided coordinates are invalid for type ${type}: ${msg}`)
    }
}

class GeoJsonPoint extends GeoJsonObject {

    static type = 'point'

    static parseValue(string) {
        let result = null
        let json = this.validateJSON(string)
        if (json) {
            let { type, coordinates } = json
            if (type != this.type) this.throwInvalidTypeError(this.type, type)
            else if (!this.evaluateCoordinates(coordinates)) {
                this.throwInvalideCoordinatesError(this.type, `Coordinates needs to be an array of excactly two numbers!`)
            }
        }
        return result
    }

    static evaluateCoordinates(coordinates) {
        return (Array.isArray(coordinates) && Array.length === 2 && coordinates.every(val => !isNaN(val)))
    }
}

module.exports = {
    GeoJSON,
    GeoJsonObject,
    GeoJsonPoint,
}