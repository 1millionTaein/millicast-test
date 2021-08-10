import { auth, base } from "./ApiHelper";

const streamName = "krmxvbmm";
const accountId = "CEANfN";

export function publishCall() {
  return auth.post("/director/publish", { streamName });
}

export function subscribeCall() {
  return base.post("/director/subscribe", {
    streamName,
    streamAccountId: accountId,
    unauthorizedSubscribe: true,
  });
}
