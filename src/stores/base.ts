import { defineStore } from "pinia";

export const useBaseStore = defineStore("base", () => {
  const baseUrl = "a1.easemob.com";
  const orgName = "1125221214163135";
  const appName = "chat-room";
  const appKey = "1125221214163135#chat-room";
  const clientID = "YXA6jTNKOWuMQe6twEQOd5lSTA";
  const clientSecret = "YXA6qT8Hl2XNh1W4v-iLILPKnrl-R4E";

  return { baseUrl, orgName, appName, appKey, clientID, clientSecret };
});
