const BASE_URL = 'http://localhost:5000';

export const URLS = {
    TAGS: {
        BASE: `${BASE_URL}/api/tags`,
        BY_ID: `${BASE_URL}/api/tags/tag/byId/`,
        BY_NAME: `${BASE_URL}/api/tags/tag/byName/`,
        BY_SEARCH: `${BASE_URL}/api/tags/search/`,
        ADD: `${BASE_URL}/api/tags/add`,
        UPDATE: `${BASE_URL}/api/tags/update/`,
        DELETE: `${BASE_URL}/api/tags/delete/`
    },
    USERS: {
        BASE: `${BASE_URL}/api/users`,
        BY_ID: `${BASE_URL}/api/users/user/byId/`,
        BY_USERNAME: `${BASE_URL}/api/users/user/byUsername/`,
        BY_EMAIL: `${BASE_URL}/api/users/user/byEmail/`,
        BY_ROLE_SCOPE: `${BASE_URL}/api/users/roleScope/`,
        BY_SEARCH: `${BASE_URL}/api/users/search/`,
        BY_ORGANIZATION: `${BASE_URL}/api/users/organization/`,
        ADD: `${BASE_URL}/api/users/add`,
        UPDATE: `${BASE_URL}/api/users/update/`,
        DELETE: `${BASE_URL}/api/users/delete/`,
        LOGIN: `${BASE_URL}/api/users/login`,
        REGISTER: `${BASE_URL}/api/users/register`
    },
    ORGANIZATIONS: {
        BASE: `${BASE_URL}/api/organizations`,
        BY_ID: `${BASE_URL}/api/organizations/organization/byId/`,
        BY_NAME: `${BASE_URL}/api/organizations/organization/byName/`,
        BY_DEPARTMENT: `${BASE_URL}/api/organizations/department/`,
        BY_SEARCH: `${BASE_URL}/api/organizations/search/`,
        ADD: `${BASE_URL}/api/organizations/add`,
        UPDATE: `${BASE_URL}/api/organizations/update/`,
        DELETE: `${BASE_URL}/api/organizations/delete/`
    },
    MATERIALS: {
        BASE: `${BASE_URL}/api/materials`,
        BY_ID: `${BASE_URL}/api/materials/material/byId/`,
        BY_NAME: `${BASE_URL}/api/materials/material/byName/`,
        BY_STATUS: `${BASE_URL}/api/materials/status/`,
        BY_RENEWAL_DATE: `${BASE_URL}/api/materials/renewalDate/`,
        BY_RETURN_DEADLINE: `${BASE_URL}/api/materials/returnDeadLine/`,
        BY_SEARCH: `${BASE_URL}/api/materials/search/`,
        BY_TAG: `${BASE_URL}/api/materials/taggedAsOne/`,
        BY_TAGS: `${BASE_URL}/api/materials/taggedAsMany/`,
        BY_USER: `${BASE_URL}/api/materials/assignedTo/`,
        ADD: `${BASE_URL}/api/materials/add`,
        UPDATE: `${BASE_URL}/api/materials/update/`,
        DELETE: `${BASE_URL}/api/materials/delete/`
    },
    REQUESTS: {
        BASE: `${BASE_URL}/api/requests`,
        BY_ID: `${BASE_URL}/api/requests/request/byId/`,
        BY_TYPE: `${BASE_URL}/api/requests/type/`,
        BY_STATUS: `${BASE_URL}/api/requests/status/`,
        BY_DATE: `${BASE_URL}/api/requests/date/`,
        BY_REQUESTER: `${BASE_URL}/api/requests/requester/`,
        BY_MATERIAL: `${BASE_URL}/api/requests/material/`,
        ADD: `${BASE_URL}/api/requests/add`,
        UPDATE: `${BASE_URL}/api/requests/update/`,
        DELETE: `${BASE_URL}/api/requests/delete/`
    }
};
