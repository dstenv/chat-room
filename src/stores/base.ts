import { defineStore } from "pinia";

export const useBaseStore = defineStore("base", () => {
    const RestApi = "a1.easemob.com";
    const orgName = "1125221214163135";
    const socket3 = "im-api-v2.easemob.com";
    const clientID = "YXA62VO4Vj7CT-2ppwCbK0N8xw";
    const clientSecret = "YXA64_7wQq1yKt0I1bVn33rU0GubJJw";

    const appName = "demo";
    const appKey = "1125221214163135#demo";

    const baseUrl = `${window.location.protocol}//${RestApi}`;

    return {
        RestApi,
        socket3,
        orgName,
        appName,
        appKey,
        clientID,
        clientSecret,
        baseUrl,
    };
});
