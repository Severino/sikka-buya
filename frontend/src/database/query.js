import axios from "axios"
const baseURL = process.env.VUE_APP_DATABASE_URL || "http://localhost:4000/graphql"
const host = baseURL
import AxiosHelper from "@/utils/AxiosHelper.js";
import Auth from "../utils/Auth";
import store from "../store";

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

    static async raw(query, variables) {

        return new Query().raw(query, variables)

    }


    async raw(query, variables = {}) {

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject('Operation timed out.')
            }, 5000)
            axios({
                url: host,
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
                    if (errors[0] === "401") {
                        store.commit("showLoginForm")
                    }

                    reject(errors)
                }
            }).catch(reject)
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

        let query
        if (!data.id) {
            query = `
            mutation {
              add${this.capitalizedName}(
                  data:{
                  ${properties}
                  }
              )
            }
          `;
        } else {
            query = `
            mutation {
              update${this.capitalizedName}(
                  data:{
                  ${properties}
                  }
              )
            }
          `;
        }

        return this.raw(query)
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