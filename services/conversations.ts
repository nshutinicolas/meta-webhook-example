import GraphApi from "./graph-api.js";
import { Message } from "./message.js";
import { Status } from "./status.js";

function sendTryOutDemoMessage(
    messageId: string,
    senderPhoneNumberId: string,
    recipientPhoneNumber: string,
    messageBody: string
) {
    return GraphApi.messageWithInteractiveReply(
        messageId,
        senderPhoneNumberId,
        recipientPhoneNumber,
        messageBody,
        [
            {
                id: "reply-offer",
                title: "Current promo"
            },
            {
                id: "reply-media-card-carousel",
                title: "Get recipe ideas"
            },
            {
                id: "reply-interactive-with-media",
                title: "Shop online"
            }
        ]
    )
}

const sendInteractiveMediaMessage = (
    messageId: string,
    senderPhoneNumberId: string,
    recipientPhoneNumber: string
) => {
    return GraphApi.messageWithUtilityTemplate(
        messageId,
        senderPhoneNumberId,
        recipientPhoneNumber,
        {
            templateName: "grocery_delivery_utility",
            locale: "en_US",
            imageId: "GROCERIES_MEDIA_ID"
        }
    )
}

const sendLimitedTimeOfferMessage = (
    messageId: string,
    senderPhoneNumberId: string,
    recipientPhoneNumber: string
) => {
    return GraphApi.messageWithLimitedTimeOfferTemplate(
        messageId,
        senderPhoneNumberId,
        recipientPhoneNumber,
        {
            templateName: "strawberries_limited_offer",
            locale: "en_US",
            imageId: "STRAWBERRIES_MEDIA_ID",
            offerCode: "BERRIES20"
        }
    )
}

const sendMediaCarouselMessage = (
    messageId: string,
    senderPhoneNumberId: string,
    recipientPhoneNumber: string
) => {
  return GraphApi.messageWithMediaCardCarousel(
    messageId,
    senderPhoneNumberId,
    recipientPhoneNumber,
    {
      templateName: "recipe_media_carousel",
      locale: "en_US",
      imageIds: [
        "SHEET_PAN_DINNER_MEDIA_ID",
        "SALAD_BOWL_MEDIA_ID",
      ]
    }
  );
}
async function markMessageForFollowUp(messageId: string) {
//   await Cache.insert(messageId);
// Do some caching related to this message
}

export class Conversation {
    phoneNumberId: string
    constructor(phoneNumberId: string) {
        this.phoneNumberId = phoneNumberId
    }

    static async handleMessage(senderPhoneNumberId: string, rawMessage: any) {
        const message = new Message(rawMessage)
        switch (message.type) {
            case "reply-interactive-with-media": {
                const interactiveMediaResponse = await sendInteractiveMediaMessage(
                message.id,
                senderPhoneNumberId,
                message.senderPhoneNumber
                )
                const mediaResponse = interactiveMediaResponse as { messages: any[] }
                await markMessageForFollowUp(mediaResponse.messages[0].id);
                break
            }
            case "reply-offer":
                break
            case "reply-media-card-carousel":
                break
            default:
                break
        }
    }

    static async handleStatus(senderPhoneNumberId: string, rawStatus: any) {
        const status = new Status(rawStatus);

        // Only handle delivered and read statuses
        if (!(status.status === 'delivered' || status.status === 'read')) {
        return;
        }

        // Only send a follow up message if the current message is flagged
        // as needing one in the cache.
        // if (await Cache.remove(status.messageId)) {
        //     await sendTryOutDemoMessage(
        //         undefined,
        //         senderPhoneNumberId,
        //         status.recipientPhoneNumber,
        //         constants.APP_TRY_ANOTHER_MESSAGE
        //     );
        // }
  }
}


