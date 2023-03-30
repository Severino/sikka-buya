import CMSPage from '../../models/CMSPage'

/**
 * Helps handling CMS functionality
 */
export default {
    methods: {
        cms_delete: async function (id) {
            if (id)
                await CMSPage.delete(id)
        },
        cms_edit: function ({ id, group = "Unknown Group", props = {} } = {}) {
            if (id)
                this.$router.push({ name: 'CMSPage', params: { group, id }, props })
        },
        cms_createPage: async function (pageGroupName) {
            return CMSPage.create(pageGroupName)
        },
        cms_createAndVisit: async function (pageGroupName, props) {
            const id = await CMSPage.create(pageGroupName)
            if (id)
                this.$router.push({ name: "CMSPage", props, params: { id, group: pageGroupName } })
        },
        cms_list: async function (group) {
            return CMSPage.list(group)
        },
        cms_get: async function ({ id, group }) {
            let page = null

            if (!id && !group) throw new Error("Id or group must be provided")
            else if (!id) {
                // get the first page of the group
                page = await CMSPage.getSingle(group)
            } else {
                // get the page with the id
                page = CMSPage.get(id)
            }

            return page
        }
    }
}