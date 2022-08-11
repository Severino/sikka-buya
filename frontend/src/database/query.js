
import axios from "axios"
import AxiosHelper from "@/utils/AxiosHelper.js";
import Auth from "../utils/Auth";
import { graphqlEndpoint } from './host';
import { print } from 'graphql/language/printer';

export default class Query {

    constructor(name) {
        this.name = name
    }

    get capitalizedName() {
        return this.name[0].toUpperCase() + this.name.substr(1)
    }

    async get(id, properties) {
        const query = `
              {
                get${this.capitalizedName} (id:${id})  {
                    ${properties.join(",")}
                }
              }
            `

        return Query.raw(query)
    }

    async raw(query, variables) {
        return Query.raw(query, variables)
    }


    static async gql(query, variables) {
        const string = print(query)
        return this.raw(string, variables)
    }

    static async raw(query, variables = {}) {
        // console.log(query, JSON.stringify(variables))
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject('Operation timed out.')
            }, 5000)
            axios({
                url: graphqlEndpoint,
                method: "post",
                headers: { "auth": Auth.loadToken() },
                data: {
                    query,
                    variables
                },
            }).then(result => {
                if (AxiosHelper.ok(result)) {
                    resolve(result)
                } else {
                    let errors = AxiosHelper.getErrors(result)
                    reject(errors)
                }
            }).catch((e) => {
                if (e.isAxiosError) {
                    if (e.response) {
                        console.error(e.response.data.errors[0])
                        reject(e.response.data.errors.map(item => item.message).join(" --- "))
                    } else {
                        reject("Server ist derzeit nicht erreichbar. Versuchen Sie es später nochmal.")
                    }
                } else reject(e)
            })
                .finally(() => clearTimeout(timeout))
        })
    }

    async update(data) {

        if (data.id == -1) delete data.id

        let properties = ""
        for (let [key, val] of Object.entries(data)) {
            const fixedValue = typeof (val) == "string" ? `"${val}"` : Array.isArray(val) ? `[${val.join(",")}]` : val
            properties += key + ":" + fixedValue + ",\n"
        }
        properties = properties.slice(0, -2)

        const queryName = (data.id) ? "update" : "add"
        return this.raw(`mutation {
            ${queryName}${this.capitalizedName}(${properties})
          }
        `)
    }

    delete(id) {
        const query = `
        mutation {
          delete${this.capitalizedName}(
            id: ${id}
          )
        }
      `;

        return this.raw(query)
    }

    async list(properties) {
        const query = `{
          ${this.name} {
              ${properties.join(",")}
          }
        }
      `

        return Query.raw(query)
    }
}