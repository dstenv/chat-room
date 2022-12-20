import { useBaseStore } from "@/stores/base";
import pinia from "@/utils/createPinia";
import axios from "axios";

const baseStore = useBaseStore(pinia);

const requestBaseConfig = {
    method: "get",
    headers: { "Content-Type": "application/json" },
    url: "",
};

type Request = typeof requestBaseConfig;

export const request = async <T>(options: T & Request) => {
    options.method = options.method || requestBaseConfig.method;
    options.headers = options.headers || requestBaseConfig.headers;
    options.url += baseStore.baseUrl;

    const result = await axios({ ...options });
    console.log("apis/base.ts请求结果 --> ", result);
};
