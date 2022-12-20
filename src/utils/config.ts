import { useBaseStore } from "@/stores/base";
import EaseChatSDK from "easemob-websdk";
import pinia from "./createPinia";

const baseStore = useBaseStore(pinia);
const { appKey, socket3, RestApi } = baseStore;

/*
 * isHttpDNS： isPrivate为true开启私有化配置则走自有配置的url以及apiUrl，
 * 否则为true就SDK自助获取DNS地址。
 * 【特别注意】如果不需要私有化配置，也就是自己定义url以及apiUrl。isHttpDNS、url、apiUrl，均可不用填写只用填入appKey！SDK内部会进行自动获取！
 **/
const EaseChatClient = new EaseChatSDK.connection({
    appKey,
    isHttpDNS: true,
    url: `//${socket3}`,
    apiUrl: `//${RestApi}`,
});
console.log("EaseIMClient", EaseChatClient);
export { EaseChatSDK, EaseChatClient };
