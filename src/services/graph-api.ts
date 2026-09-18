import "dotenv/config";
import { FacebookAdsApi } from "facebook-nodejs-business-sdk";
import {
    buildLimitedTimeOfferTemplatePayload,
    buildMediaCardCarouselPayload,
    buildUtilityTemplatePayload
} from "./message-payloads.js";

const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

if (!accessToken) {
    throw new Error("FACEBOOK_ACCESS_TOKEN is not configured");
}

const api = FacebookAdsApi.init(accessToken);

class GraphApi {
    static async makeApiCall(
        senderPhoneNumberId: string,
        requestBody: unknown,
        messageId?: string
    ): Promise<unknown> {
        try {
            // Mark as read and send typing indicator
            if (messageId) {
                const typingBody = {
                    messaging_product: "whatsapp",
                    status: "read",
                    message_id: messageId,
                    typing_indicator: {
                        type: "text"
                    }
                }
                await api.call(
                    "POST",
                    // Route construction
                    [`${senderPhoneNumberId}`, "messages"],
                    typingBody
                )
            }

            const response = await api.call(
                "POST",
                [`${senderPhoneNumberId}`, "messages"],
                requestBody
            )
            console.log(response)
            return response
        } catch (error) {
            console.log("Error making API call", error);
            throw error;
        }
    }

    static async messageWithInteractiveReply(
        messageId: string,
        senderPhoneNumberId: string,
        receipientPhoneNumberId: string,
        messageText: string,
        replyCTAs: {id: string, title: string}[]
    ): Promise<unknown> {
        const requestBody = {
            messaging_product: "whatsapp",
            to: receipientPhoneNumberId,
            receipient_type: "individual",
            type: "interactive",
            interactive: {
                type: "button",
                body: {
                    text: messageText
                },
                action: {
                    buttons: replyCTAs.map((cta) => ({
                        type: "button",
                        reply: {
                            id: cta.id,
                            title: cta.title
                        }
                    }))
                }
            }
        }
        return this.makeApiCall(senderPhoneNumberId, requestBody, messageId)
    }

    static async messageWithUtilityTemplate(
        messageId: string,
        senderPhoneNumberId: string,
        recipientPhoneNumber: string,
        options: any
    ): Promise<unknown> {
        const requestBody = buildUtilityTemplatePayload({recipientPhoneNumber, ...options})
        return this.makeApiCall(senderPhoneNumberId, requestBody, messageId)
    }

    static async messageWithLimitedTimeOfferTemplate(
        messageId: string,
        senderPhoneNumberId: string,
        recipientPhoneNumber: string,
        options: any
    ): Promise<unknown> {
        const expirationTimeMs = Date.now() + (48 * 60 * 60 * 1000);
        const requestBody = buildLimitedTimeOfferTemplatePayload({recipientPhoneNumber, expirationTimeMs, ...options})
        return this.makeApiCall(senderPhoneNumberId, requestBody, messageId)
    }

    static async messageWithMediaCardCarousel(
        messageId: string,
        senderPhoneNumberId: string,
        recipientPhoneNumber: string,
        options: any
    ): Promise<unknown> {
        const requestBody = buildMediaCardCarouselPayload({recipientPhoneNumber, ...options})
        return this.makeApiCall(senderPhoneNumberId, requestBody, messageId)
    }
}

export default GraphApi;
