const PRICING_CONFIG = require('./pricingConfig'); // Import the backend pricing config

function calculateBackendPrice(selections) {
    let totalPrice = 0;
    let consultationRequired = false;

    // --- WEBSITE DESIGN & DEVELOPMENT LOGIC ---
    if (selections.websiteType && PRICING_CONFIG.websiteType[selections.websiteType] !== undefined) {
        totalPrice += PRICING_CONFIG.websiteType[selections.websiteType];
        if (selections.websiteType === 'Custom Web Application') {
            consultationRequired = true;
        }
    }
    if (selections.numberOfPages && PRICING_CONFIG.numberOfPages[selections.numberOfPages] !== undefined) {
        totalPrice += PRICING_CONFIG.numberOfPages[selections.numberOfPages];
        if (selections.numberOfPages === '20+ Pages') {
            consultationRequired = true;
        }
    }

    // New: Copywriting
    if (selections.copyWriting && PRICING_CONFIG.copyWriting[selections.copyWriting] !== undefined) {
        totalPrice += PRICING_CONFIG.copyWriting[selections.copyWriting];
    }

    // New: Stock Images
    if (selections.stockImages && PRICING_CONFIG.stockImages[selections.stockImages] !== undefined) {
        totalPrice += PRICING_CONFIG.stockImages[selections.stockImages];
    }

    // New: Web Features (assuming these are checkboxes)
    if (selections.websiteSecurity) {
        totalPrice += PRICING_CONFIG.webFeatures.websiteSecurity;
    }
    if (selections.onPageOptimization) {
        totalPrice += PRICING_CONFIG.webFeatures.onPageOptimization;
    }
    if (selections.advancedSEO) {
        totalPrice += PRICING_CONFIG.webFeatures.advancedSEO;
    }
    if (selections.paymentGateway) {
        totalPrice += PRICING_CONFIG.webFeatures.paymentGateway;
    }
    if (selections.bookingSystem) {
        totalPrice += PRICING_CONFIG.webFeatures.bookingSystem;
    }
    if (selections.userAccountFunctionality) {
        totalPrice += PRICING_CONFIG.webFeatures.userAccountFunctionality;
    }
    if (selections.customFunctionality) {
        totalPrice += PRICING_CONFIG.webFeatures.customFunctionality;
        consultationRequired = true; // Mark for consultation if custom functionality is selected
    }
    if (selections.crmSystem) {
        totalPrice += PRICING_CONFIG.webFeatures.crmSystem;
    }


    // --- DIGITAL CONTENT CREATION LOGIC ---
    if (selections.customStaticGraphicPack && PRICING_CONFIG.socialMediaContent.customStaticGraphicPack[selections.customStaticGraphicPack] !== undefined) {
        totalPrice += PRICING_CONFIG.socialMediaContent.customStaticGraphicPack[selections.customStaticGraphicPack];
    }
    if (selections.shortFormAnimatedGifPack && PRICING_CONFIG.socialMediaContent.shortFormAnimatedGifPack[selections.shortFormAnimatedGifPack] !== undefined) {
        totalPrice += PRICING_CONFIG.socialMediaContent.shortFormAnimatedGifPack[selections.shortFormAnimatedGifPack];
    }
    if (selections.shortFormSocialVideo && PRICING_CONFIG.socialMediaContent.shortFormSocialVideo[selections.shortFormSocialVideo] !== undefined) {
        totalPrice += PRICING_CONFIG.socialMediaContent.shortFormSocialVideo[selections.shortFormSocialVideo];
    }
    if (selections.profileImageOptimization) {
        totalPrice += PRICING_CONFIG.socialMediaContent.profileImageOptimization;
    }
    if (selections.socialMediaCaptionWriting && PRICING_CONFIG.socialMediaContent.socialMediaCaptionWriting[selections.socialMediaCaptionWriting] !== undefined) {
        totalPrice += PRICING_CONFIG.socialMediaContent.socialMediaCaptionWriting[selections.socialMediaCaptionWriting];
    }

    if (selections.digitalAdBannerDesign && PRICING_CONFIG.visualMarketingAssets.digitalAdBannerDesign[selections.digitalAdBannerDesign] !== undefined) {
        totalPrice += PRICING_CONFIG.visualMarketingAssets.digitalAdBannerDesign[selections.digitalAdBannerDesign];
        if (selections.digitalAdBannerDesign === 'Custom Ad Banner Set') {
            consultationRequired = true;
        }
    }
    if (selections.infographicDesign && PRICING_CONFIG.visualMarketingAssets.infographicDesign[selections.infographicDesign] !== undefined) {
        totalPrice += PRICING_CONFIG.visualMarketingAssets.infographicDesign[selections.infographicDesign];
    }
    if (selections.customIconographySet && PRICING_CONFIG.visualMarketingAssets.customIconographySet[selections.customIconographySet] !== undefined) {
        totalPrice += PRICING_CONFIG.visualMarketingAssets.customIconographySet[selections.customIconographySet];
    }
    if (selections.newsletterHeaderDesign) {
        totalPrice += PRICING_CONFIG.visualMarketingAssets.newsletterHeaderDesign;
    }
    if (selections.customPresentationTemplateDesign && PRICING_CONFIG.visualMarketingAssets.customPresentationTemplateDesign[selections.customPresentationTemplateDesign] !== undefined) {
        totalPrice += PRICING_CONFIG.visualMarketingAssets.customPresentationTemplateDesign[selections.customPresentationTemplateDesign];
    }

    if (selections.explainerVideoProduction && PRICING_CONFIG.videoContent.explainerVideoProduction[selections.explainerVideoProduction] !== undefined) {
        totalPrice += PRICING_CONFIG.videoContent.explainerVideoProduction[selections.explainerVideoProduction];
    }
    if (selections.motionGraphicsAnimation && PRICING_CONFIG.videoContent.motionGraphicsAnimation[selections.motionGraphicsAnimation] !== undefined) {
        totalPrice += PRICING_CONFIG.videoContent.motionGraphicsAnimation[selections.motionGraphicsAnimation];
        if (selections.motionGraphicsAnimation === 'Custom Animation') {
            consultationRequired = true;
        }
    }
    if (selections.animatedLogoReveal) {
        totalPrice += PRICING_CONFIG.videoContent.animatedLogoReveal;
    }

    if (selections.interactiveContentElementDesign && PRICING_CONFIG.advancedContentSupport.interactiveContentElementDesign[selections.interactiveContentElementDesign] !== undefined) {
        totalPrice += PRICING_CONFIG.advancedContentSupport.interactiveContentElementDesign[selections.interactiveContentElementDesign];
        if (selections.interactiveContentElementDesign === 'Custom Interactive Element') {
            consultationRequired = true;
        }
    }
    if (selections.advancedImageVideoEditing) {
        consultationRequired = true; // Always requires consultation for pricing
    }
    if (selections.ongoingContentStrategyConsultation && PRICING_CONFIG.advancedContentSupport.ongoingContentStrategyConsultation[selections.ongoingContentStrategyConsultation] !== undefined) {
        totalPrice += PRICING_CONFIG.advancedContentSupport.ongoingContentStrategyConsultation[selections.ongoingContentStrategyConsultation];
    }


    // --- BRAND IDENTITY DESIGN LOGIC ---
    if (selections.primaryLogoDesign && PRICING_CONFIG.coreBrandEssentials.primaryLogoDesign[selections.primaryLogoDesign] !== undefined) {
        totalPrice += PRICING_CONFIG.coreBrandEssentials.primaryLogoDesign[selections.primaryLogoDesign];
    }
    if (selections.logoVariations) {
        totalPrice += PRICING_CONFIG.coreBrandEssentials.logoVariations;
    }
    if (selections.colorPaletteDefinition) {
        totalPrice += PRICING_CONFIG.coreBrandEssentials.colorPaletteDefinition;
    }
    if (selections.typographySelection) {
        totalPrice += PRICING_CONFIG.coreBrandEssentials.typographySelection;
    }
    if (selections.basicBrandBoard) {
        totalPrice += PRICING_CONFIG.coreBrandEssentials.basicBrandBoard;
    }

    if (selections.socialMediaProfilePack && PRICING_CONFIG.digitalBrandPresence.socialMediaProfilePack[selections.socialMediaProfilePack] !== undefined) {
        totalPrice += PRICING_CONFIG.digitalBrandPresence.socialMediaProfilePack[selections.socialMediaProfilePack];
        if (selections.socialMediaProfilePack === 'Custom Platforms') {
            consultationRequired = true;
        }
    }
    if (selections.emailSignatureDesign) {
        totalPrice += PRICING_CONFIG.digitalBrandPresence.emailSignatureDesign;
    }
    if (selections.customIconographySet && PRICING_CONFIG.digitalBrandPresence.customIconographySet[selections.customIconographySet] !== undefined) {
        totalPrice += PRICING_CONFIG.digitalBrandPresence.customIconographySet[selections.customIconographySet];
    }
    if (selections.digitalMarketingTemplate && PRICING_CONFIG.digitalBrandPresence.digitalMarketingTemplate[selections.digitalMarketingTemplate] !== undefined) {
        totalPrice += PRICING_CONFIG.digitalBrandPresence.digitalMarketingTemplate[selections.digitalMarketingTemplate];
    }

    if (selections.businessCardDesign) {
        totalPrice += PRICING_CONFIG.printCollateral.businessCardDesign;
    }
    if (selections.letterheadDesign) {
        totalPrice += PRICING_CONFIG.printCollateral.letterheadDesign;
    }
    if (selections.brochureFlyerDesign && PRICING_CONFIG.printCollateral.brochureFlyerDesign[selections.brochureFlyerDesign] !== undefined) {
        totalPrice += PRICING_CONFIG.printCollateral.brochureFlyerDesign[selections.brochureFlyerDesign];
    }
    if (selections.presentationTemplateDesign && PRICING_CONFIG.printCollateral.presentationTemplateDesign[selections.presentationTemplateDesign] !== undefined) {
        totalPrice += PRICING_CONFIG.printCollateral.presentationTemplateDesign[selections.presentationTemplateDesign];
    }

    if (selections.fullBrandStyleGuide) {
        totalPrice += PRICING_CONFIG.comprehensiveBrandManagement.fullBrandStyleGuide;
    }
    if (selections.brandVoiceMessagingGuidelines) {
        totalPrice += PRICING_CONFIG.comprehensiveBrandManagement.brandVoiceMessagingGuidelines;
    }
    if (selections.customGraphicElementsPatterns) {
        totalPrice += PRICING_CONFIG.comprehensiveBrandManagement.customGraphicElementsPatterns;
    }
    if (selections.marketingCollateralSuite && PRICING_CONFIG.comprehensiveBrandManagement.marketingCollateralSuite[selections.marketingCollateralSuite] !== undefined) {
        totalPrice += PRICING_CONFIG.comprehensiveBrandManagement.marketingCollateralSuite[selections.marketingCollateralSuite];
        if (selections.marketingCollateralSuite === 'Custom Suite') {
            consultationRequired = true;
        }
    }
    if (selections.priorityBrandConsulting && PRICING_CONFIG.comprehensiveBrandManagement.priorityBrandConsulting[selections.priorityBrandConsulting] !== undefined) {
        totalPrice += PRICING_CONFIG.comprehensiveBrandManagement.priorityBrandConsulting[selections.priorityBrandConsulting];
    }


    const finalPrice = parseFloat(totalPrice.toFixed(2));
    return {
        price: finalPrice,
        consultationRequired: consultationRequired
    };
}

module.exports = calculateBackendPrice;