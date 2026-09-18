declare module "facebook-nodejs-business-sdk" {
    type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";

    class FacebookAdsApi {
        static init(accessToken: string): FacebookAdsApi;
        call(method: ApiMethod, path: string[], params?: unknown): Promise<unknown>;
    }

    export { FacebookAdsApi };
}