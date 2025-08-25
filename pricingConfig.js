// pricingConfig.js

const PRICING_CONFIG = {
    // --- WEBSITE DESIGN & DEVELOPMENT ---
    websiteType: {
        'Informational': 1500.00,
        'E-commerce Store': 4000.00,
        'Portfolio/Personal': 1000.00,
        'Blog/Content Hub': 1200.00,
        'Custom Web Application': 0.00, // Requires consultation
    },
    numberOfPages: {
        'Up to 5 Pages': 0.00,
        '6-10 Pages': 400.00,
        '11-20 Pages': 800.00,
        '20+ Pages': 1500.00, // Requires consultation
    },
    copyWriting: {
        'No': 0.00,
        'Yes': 800.00,
    },
    stockImages: {
        'No': 0.00,
        'Yes': 800.00,
    },
    webFeatures: {
        websiteSecurity: 75.00,
        onPageOptimization: 200.00,
        advancedSEO: 150.00,
        paymentGateway: 50.00,
        bookingSystem: 100.00,
        userAccountFunctionality: 120.00,
        customFunctionality: 1000.00,
        crmSystem: 100.00,
    },

    // --- DIGITAL CONTENT CREATION ---
    socialMediaContent: {
        customStaticGraphicPack: {
            'No Static Graphics': 0.00,
            '5 Custom Designs': 150.00,
            '10 Custom Designs': 250.00,
            '20 Custom Designs': 400.00,
        },
        shortFormAnimatedGifPack: {
            'No Animated GIFs': 0.00,
            '2 Short-Form GIFs': 100.00,
            '5 Short-Form GIFs': 200.00,
            '10 Short-Form GIFs': 350.00,
        },
        shortFormSocialVideo: {
            'No Social Videos': 0.00,
            '1 Video (up to 30 seconds)': 300.00,
            '3 Videos (up to 30 seconds each)': 750.00,
            '5 Videos (up to 60 seconds each)': 1500.00,
        },
        profileImageOptimization: 100.00,
        socialMediaCaptionWriting: {
            'No Caption Writing': 0.00,
            'Captions for 5 Posts': 75.00,
            'Captions for 10 Posts': 120.00,
            'Captions for 20 Posts': 200.00,
        },
    },
    visualMarketingAssets: {
        digitalAdBannerDesign: {
            'No Ad Banners': 0.00,
            '3 Ad Banner Sizes/Variations': 180.00,
            '5 Ad Banner Sizes/Variations': 280.00,
            'Custom Ad Banner Set': 0.00, // Requires consultation
        },
        infographicDesign: {
            'No Infographic': 0.00,
            'Basic Infographic (Single-page)': 350.00,
            'Complex Infographic (Multi-section/Interactive)': 700.00,
        },
        customIconographySet: {
            'No Custom Icons': 0.00,
            '5 Custom Icons': 120.00,
            '10 Custom Icons': 200.00,
            '20 Custom Icons': 350.00,
        },
        newsletterHeaderDesign: 80.00,
        customPresentationTemplateDesign: {
            'No Presentation Template': 0.00,
            '5-Slide Template': 200.00,
            '10-Slide Template': 350.00,
            '20-Slide Template': 600.00,
        },
    },
    videoContent: {
        explainerVideoProduction: {
            'No Explainer Video': 0.00,
            'Up to 60 Seconds': 800.00,
            '60-90 Seconds': 1200.00,
            '90-120 Seconds': 1800.00,
        },
        motionGraphicsAnimation: {
            'No Motion Graphics': 0.00,
            'Up to 30 Seconds Animation': 500.00,
            '30-60 Seconds Animation': 900.00,
            'Custom Animation': 0.00, // Requires consultation
        },
        animatedLogoReveal: 150.00,
    },

    // --- BRAND IDENTITY DESIGN ---
    coreBrandEssentials: {
        primaryLogoDesign: {
            'No Logo Design': 0.00,
            '2 Initial Concepts': 400.00,
            '3 Initial Concepts': 600.00,
        },
        logoVariations: 150.00,
        colorPaletteDefinition: 100.00,
        typographySelection: 80.00,
        basicBrandBoard: 120.00,
    },
    digitalBrandPresence: {
        socialMediaProfilePack: {
            'No Social Media Pack': 0.00,
            '2 Platforms': 100.00,
            '4 Platforms': 180.00,
            'Custom Platforms': 0.00, // Requires consultation
        },
        emailSignatureDesign: 50.00,
        customIconographySet: {
            'No Custom Icons': 0.00,
            '5 Custom Icons': 120.00,
            '10 Custom Icons': 200.00,
            '15 Custom Icons': 280.00,
        },
        digitalMarketingTemplate: {
            'No Digital Template': 0.00,
            'Social Post Template': 90.00,
            'Digital Ad Banner Template': 110.00,
            'Email Marketing Template': 100.00,
        },
    },
    printCollateral: {
        businessCardDesign: 70.00,
        letterheadDesign: 60.00,
        presentationTemplateDesign: {
            'No Presentation Template': 0.00,
            'Master Slide Template': 180.00,
            '5-10 Slide Template': 300.00,
            '10-20 Slide Template': 500.00,
        },
    },
    comprehensiveBrandManagement: {
        fullBrandStyleGuide: 500.00,
        brandVoiceMessagingGuidelines: 300.00,
        customGraphicElementsPatterns: 250.00,
        marketingCollateralSuite: {
            'No Collateral Suite': 0.00,
            '3 Custom Items': 400.00,
            '5 Custom Items': 600.00,
            'Custom Suite': 0.00, // Requires consultation
        },
    },
};

module.exports = PRICING_CONFIG;