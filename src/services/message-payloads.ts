export function buildUtilityTemplatePayload(options: any) {
    const {
        recipientPhoneNumber,
        templateName,
        locale,
        imageId
    } = options
    return {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipientPhoneNumber,
        type: "template",
        template: {
            name: templateName,
            language: {
                code: locale
            },
            components: [
                {
                    type: "header",
                    parameters: [
                        {
                            type: "image",
                            image: {
                                id: imageId
                            }
                        }
                    ]
                }
            ]
        }
    }
}

export function buildLimitedTimeOfferTemplatePayload(options: any) {
    const {
        recipientPhoneNumber,
        templateName,
        locale,
        imageId,
        offerCode,
        expirationTimeMs
    } = options
    return {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipientPhoneNumber,
        type: "template",
        template: {
            name: templateName,
            language: {
                code: locale
            },
            components: [
                {
                    type: "body",
                    parameters: [
                        {
                            type: "image",
                            image: {
                                id: imageId
                            }
                        }
                    ]
                },
                {
                    type: "limited_time_offer",
                    parameters: [
                        {
                            type: "limited_time_offer",
                            limites_time_offer: {
                                expiration_time_ms: expirationTimeMs,
                            }
                        }
                    ]
                },
                {
                    type: "button",
                    parameters: [
                        {
                            type: "button",
                            button: {
                                type: "reply",
                                reply: {
                                    id: offerCode
                                }
                            }
                        }
                    ]
                },
                {
                    type: "button",
                    sub_type: "copy_code",
                    index: 0,
                    parameters: [
                        {
                            type: "coupon_code",
                            coupon_code: offerCode
                        }
                    ]
                }
            ]
        }
    }
}

export function buildMediaCardCarouselPayload(options: any) {
    const {
        recipientPhoneNumber,
        templateName,
        locale,
        imageIds,
    } = options
    return {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipientPhoneNumber,
        type: "template",
        template: {
            name: templateName,
            language: {
                code: locale
            },
            components: [
                {
                    type: "carousel",
                    cards: imageIds.map((imageId: string, index: number) => ({
                        card_index: index,
                        components: [
                            {
                                type: "header",
                                parameters: [
                                    {
                                        type: "image",
                                        image: {
                                            id: imageId
                                        }
                                    }
                                ]
                            }
                        ]
                    }))
                }
            ]
        }
    }
}
