// js/quoteForm.js

// --- DUPLICATED PRICING_CONFIG FOR FRONTEND USE ---
// IMPORTANT: Ensure these prices match your backend pricingConfig.js exactly.
// You MUST replace placeholder prices with your actual figures.
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
        customFunctionality: 1000.00, // Often implies consultation, but has a base price here
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
        brochureFlyerDesign: {
            'No Brochure/Flyer': 0.00,
            'Single-Page Flyer': 150.00,
            'Bi-Fold Brochure': 250.00,
            'Tri-Fold Brochure': 350.00,
        },
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
        priorityBrandConsulting: {
            'No Priority Consulting': 0.00,
            'Hourly Consultation': 75.00,
            'Monthly Retainer': 500.00,
        },
    },
};


// --- calculateFrontendPriceJS Function ---
// This function mirrors the backend pricing logic to provide an instant quote.
function calculateFrontendPriceJS(selections) {
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


// --- Function to collect ALL relevant service selections from the form ---
// This function is now shared by both the instant update and the final submission.
function collectSelectedServices() {
    return {
        // Website Design & Development
        websiteType: document.getElementById('websiteTypeSelect')?.value || '',
        numberOfPages: document.getElementById('numberOfPagesSelect')?.value || '',
        copyWriting: document.getElementById('copyWriting')?.value || '',
        stockImages: document.getElementById('stockImages')?.value || '',

        // Web Features (checkboxes)
        websiteSecurity: document.getElementById('websiteSecurity')?.checked || false,
        onPageOptimization: document.getElementById('onPageOptimization')?.checked || false,
        advancedSEO: document.getElementById('advancedSEO')?.checked || false,
        paymentGateway: document.getElementById('paymentGateway')?.checked || false,
        bookingSystem: document.getElementById('bookingSystem')?.checked || false,
        userAccountFunctionality: document.getElementById('userAccountFunctionality')?.checked || false,
        customFunctionality: document.getElementById('customFunctionality')?.checked || false,
        crmSystem: document.getElementById('crmSystem')?.checked || false,

        // Digital Content Creation
        customStaticGraphicPack: document.getElementById('customStaticGraphicPack')?.value || '',
        shortFormAnimatedGifPack: document.getElementById('shortFormAnimatedGifPack')?.value || '',
        shortFormSocialVideo: document.getElementById('shortFormSocialVideo')?.value || '',
        profileImageOptimization: document.getElementById('profileImageOptimization')?.checked || false,
        socialMediaCaptionWriting: document.getElementById('socialMediaCaptionWriting')?.value || '',

        digitalAdBannerDesign: document.getElementById('digitalAdBannerDesign')?.value || '',
        infographicDesign: document.getElementById('infographicDesign')?.value || '',
        customIconographySet: document.getElementById('customIconographySet')?.value || '',
        newsletterHeaderDesign: document.getElementById('newsletterHeaderDesign')?.checked || false,
        customPresentationTemplateDesign: document.getElementById('customPresentationTemplateDesign')?.value || '',

        explainerVideoProduction: document.getElementById('explainerVideoProduction')?.value || '',
        motionGraphicsAnimation: document.getElementById('motionGraphicsAnimation')?.value || '',
        animatedLogoReveal: document.getElementById('animatedLogoReveal')?.checked || false,

        interactiveContentElementDesign: document.getElementById('interactiveContentElementDesign')?.value || '',
        advancedImageVideoEditing: document.getElementById('advancedImageVideoEditing')?.checked || false,
        ongoingContentStrategyConsultation: document.getElementById('ongoingContentStrategyConsultation')?.value || '',

        // Brand Identity Design
        primaryLogoDesign: document.getElementById('primaryLogoDesign')?.value || '',
        logoVariations: document.getElementById('logoVariations')?.checked || false,
        colorPaletteDefinition: document.getElementById('colorPaletteDefinition')?.checked || false,
        typographySelection: document.getElementById('typographySelection')?.checked || false,
        basicBrandBoard: document.getElementById('basicBrandBoard')?.checked || false,

        socialMediaProfilePack: document.getElementById('socialMediaProfilePack')?.value || '',
        emailSignatureDesign: document.getElementById('emailSignatureDesign')?.checked || false,
        customIconographySet: document.getElementById('customIconographySet')?.value || '',
        digitalMarketingTemplate: document.getElementById('digitalMarketingTemplate')?.value || '',

        businessCardDesign: document.getElementById('businessCardDesign')?.checked || false,
        letterheadDesign: document.getElementById('letterheadDesign')?.checked || false,
        brochureFlyerDesign: document.getElementById('brochureFlyerDesign')?.value || '',
        presentationTemplateDesign: document.getElementById('presentationTemplateDesign')?.value || '',

        fullBrandStyleGuide: document.getElementById('fullBrandStyleGuide')?.checked || false,
        brandVoiceMessagingGuidelines: document.getElementById('brandVoiceMessagingGuidelines')?.checked || false,
        customGraphicElementsPatterns: document.getElementById('customGraphicElementsPatterns')?.checked || false,
        marketingCollateralSuite: document.getElementById('marketingCollateralSuite')?.value || '',
        priorityBrandConsulting: document.getElementById('priorityBrandConsulting')?.value || '',
    };
}


// --- Function to update the displayed price and consultation message ---
function updatePriceDisplay() {
    const selectedServices = collectSelectedServices();
    const { price, consultationRequired } = calculateFrontendPriceJS(selectedServices);

    const displayPriceElement = document.getElementById('displayPrice');
    const consultationMessageElement = document.getElementById('consultationMessage');

    if (displayPriceElement) { // Check if element exists before manipulating
        if (consultationRequired) {
            displayPriceElement.textContent = 'R TBD'; // To Be Determined
        } else {
            displayPriceElement.textContent = `R ${price.toFixed(2)}`;
        }
    }

    if (consultationMessageElement) { // Check if element exists
        if (consultationRequired) {
            consultationMessageElement.classList.remove('d-none'); // Show message
        } else {
            consultationMessageElement.classList.add('d-none'); // Hide message
        }
    }
}

// --- Function to check if all required fields are filled and update button state ---
// Moved to global scope for broader access
function checkFormValidity() {
    const clientName = document.getElementById('clientNameInput');
    const clientEmail = document.getElementById('clientEmailInput');
    const phoneNumber = document.getElementById('phoneNumberInput');
    const submitBtn = document.getElementById('submitQuoteBtn');
    const submitBtnWrapper = document.getElementById('submitBtnWrapper');

    // These conditions define when a field is 'filled'.
    // `trim()` removes any leading/trailing whitespace.
    const isClientNameFilled = clientName && clientName.value.trim() !== '';
    const isClientEmailFilled = clientEmail && clientEmail.value.trim() !== '';
    const isPhoneNumberFilled = phoneNumber && phoneNumber.value.trim() !== '' && phoneNumber.value.trim().length >= 7; // Basic length check for phone number

    // The button is only valid if ALL required fields are filled.
    const formIsValid = isClientNameFilled && isClientEmailFilled && isPhoneNumberFilled;

    // Set the disabled state of the button.
    // If formIsValid is true, !formIsValid is false, so button.disabled becomes false (enabled).
    // If formIsValid is false, !formIsValid is true, so button.disabled becomes true (disabled).
    if (submitBtn) {
        submitBtn.disabled = !formIsValid;
    }

    // --- NEW: Tooltip logic ---
    if (submitBtnWrapper) {
        if (!formIsValid) {
            // If form is invalid, add tooltip attributes to the wrapper
            submitBtnWrapper.setAttribute('data-bs-toggle', 'tooltip');
            submitBtnWrapper.setAttribute('data-bs-placement', 'top');
            submitBtnWrapper.setAttribute('title', 'Please fill in all required contact details to request your quotation.');
            // Re-initialize tooltip to ensure it appears after attributes are set
            // Destroy existing tooltip if any, then re-create
            const existingTooltip = bootstrap.Tooltip.getInstance(submitBtnWrapper);
            if (existingTooltip) {
                existingTooltip.dispose();
            }
            new bootstrap.Tooltip(submitBtnWrapper);
        } else {
            // If form is valid, remove tooltip attributes and destroy tooltip instance
            submitBtnWrapper.removeAttribute('data-bs-toggle');
            submitBtnWrapper.removeAttribute('data-bs-placement');
            submitBtnWrapper.removeAttribute('title');
            const tooltipInstance = bootstrap.Tooltip.getInstance(submitBtnWrapper);
            if (tooltipInstance) {
                tooltipInstance.dispose(); // Destroy the tooltip instance
            }
        }
    }

    return formIsValid;
}

// --- NEW: Function to display Bootstrap Toasts ---
function displayToast(type, message) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        console.error('Toast container not found!');
        return;
    }

    // Determine Bootstrap class based on type
    let bgClass = '';
    let headerText = '';
    if (type === 'success') {
        bgClass = 'text-bg-success';
        headerText = 'Success!';
    } else if (type === 'error') {
        bgClass = 'text-bg-danger';
        headerText = 'Error!';
    } else {
        bgClass = 'text-bg-info';
        headerText = 'Info';
    }

    // Create toast element
    const toastEl = document.createElement('div');
    toastEl.classList.add('toast', 'align-items-center', bgClass, 'border-0');
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toastEl);

    // Initialize and show toast
    const toast = new bootstrap.Toast(toastEl, {
        autohide: true,
        delay: 5000 // Toast disappears after 5 seconds
    });
    toast.show();

    // Optional: Scroll to the toast container to make sure it's visible
    toastContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- Main function to handle form submission ---
async function submitQuoteForm(event) {
    // Prevent default form submission behavior (page reload)
    // This is crucial if the submit button is type="submit" in HTML
    // If your button is type="button", this 'event.preventDefault()' isn't strictly needed for the button itself,
    // but it's good practice for general form submission handlers.
    event.preventDefault(); 

    // Re-check validity just before submission
    if (!checkFormValidity()) {
        displayToast('error', 'Please fill in your Full Name, Email Address, and Phone Number before submitting the quote request.');
        return; // Stop the submission
    }

    const clientName = document.getElementById('clientNameInput').value;
    const clientEmail = document.getElementById('clientEmailInput').value;
    const phoneNumber = document.getElementById('phoneNumberInput').value;
    const message = document.getElementById('messageTextarea').value;

    const selectedServices = collectSelectedServices(); // Use the shared function to get current selections

    // Calculate Frontend Price (again, for sending to backend and final frontend confirmation)
    const { price: frontendCalculatedPrice, consultationRequired } = calculateFrontendPriceJS(selectedServices);

    // --- Basic Client-Side Validation before sending ---
    if (!clientName || !clientEmail) {
        alert('Please provide your full name and email address to submit the quote request.');
        return; // Stop the submission
    }

    const submitBtn = document.getElementById('submitQuoteBtn');
    const submitSpinner = document.getElementById('submitSpinner');

   // Ensure elements exist before proceeding
    if (!quoteForm || !submitBtn || !submitSpinner || !displayPrice) {
        console.error("Required form elements not found for submission.");
        showToast('Error!', 'Form elements missing. Please refresh the page.', 'danger');
        return;
    }

    // --- Send Data to Backend ---
    try {
        if (submitBtn) {
            submitSpinner.style.display = 'block';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...'; // Or 'Sending Request...'
        }
        const response = await fetch('http://localhost:5000/api/submit-quote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clientName,
                clientEmail,
                phoneNumber,
                message,
                selectedServices,
                frontendCalculatedPrice // Send the frontend calculated price for backend validation
            }),
        });

        const result = await response.json();

        if (response.ok) {
            displayToast('success', result.message || 'Your quote request has been sent successfully! Please check your email for the detailed quotation.');
            // Optionally clear the form or redirect the user
            document.getElementById('quoteForm').reset();
            updatePriceDisplay(); // Reset the price display after form clear
        } else {
            // Do NOT clear form on error, so user can correct
            displayToast('error', result.message || 'Error submitting quote. Please try again or contact us directly.');
            document.getElementById('quoteForm').reset(); // Clear the form on error
            updatePriceDisplay(); // Reset price display
            submitBtn.textContent = 'Submit Quote Request';
        }
    } catch (error) {
        console.error('Frontend Fetch Error:', error);
        displayToast('error', 'An unexpected error occurred during submission. Please check your network and try again.');
        document.getElementById('quoteForm').reset(); // Clear the form on error
        updatePriceDisplay(); // Reset price display
        submitBtn.textContent = 'Submit Quote Request';
    }
    finally { // <--- The 'finally' keyword starts the block
        // This code runs AFTER the try block or the catch block, regardless of success or error.
        // It's ideal for cleanup, like re-enabling buttons or hiding spinners.
        if (submitBtn) {
            submitBtn.textContent = 'Submit Quote Request';
            if (submitSpinner) submitSpinner.style.display = 'none'; // Hide spinner
        }
        checkFormValidity(); // Re-evaluate button disabled state based on current form data
    } // <--- The closing curly brace ends the 'finally' block
}


// --- Event Listener Setup ---
document.addEventListener('DOMContentLoaded', () => {
    // Get a reference to the form
    const quoteForm = document.getElementById('quoteForm');
    const submitQuoteBtn = document.getElementById('submitQuoteBtn');
    const submitSpinner = document.getElementById('submitSpinner');

    //const submitBtn = document.getElementById('submitQuoteBtn');
    const clientNameInput = document.getElementById('clientNameInput');
    const clientEmailInput = document.getElementById('clientEmailInput');
    const phoneNumberInput = document.getElementById('phoneNumberInput');
    const submitBtnWrapper = document.getElementById('submitBtnWrapper');

    // List of element IDs that, when changed, should trigger a price update
    // You MUST ensure these IDs match your HTML elements exactly.
    
    const relevantInputIds = [
        'websiteTypeSelect', 'numberOfPagesSelect', 'copyWriting', 'stockImages',
        'websiteSecurity', 'onPageOptimization', 'advancedSEO',
        'paymentGateway', 'bookingSystem', 'userAccountFunctionality',
        'customFunctionality', 'crmSystem',
        'customStaticGraphicPack', 'shortFormAnimatedGifPack',
        'shortFormSocialVideo', 'profileImageOptimization',
        'socialMediaCaptionWriting', 'digitalAdBannerDesign',
        'infographicDesign', 'customIconographySetSelect', 'newsletterHeaderDesign',
        'customPresentationTemplateDesign', 'explainerVideoProduction',
        'motionGraphicsAnimation', 'animatedLogoReveal',
        'interactiveContentElementDesign', 'advancedImageVideoEditing',
        'ongoingContentStrategyConsultation', 'primaryLogoDesign',
        'logoVariations', 'colorPaletteDefinition', 'typographySelection',
        'basicBrandBoard', 'socialMediaProfilePack', 'emailSignatureDesign',
        'customIconographySet', 'digitalMarketingTemplate', 'businessCardDesign',
        'letterheadDesign', 'brochureFlyerDesign', 'presentationTemplateDesign',
        'fullBrandStyleGuide', 'brandVoiceMessagingGuidelines',
        'customGraphicElementsPatterns', 'marketingCollateralSuite',
        'priorityBrandConsulting'
    ];

    // Attach 'change' event listener to each relevant input
    relevantInputIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', updatePriceDisplay);
        } else {
            console.warn(`Element with ID '${id}' not found. Check your HTML.`);
        }
    });

    if (clientNameInput) {
        clientNameInput.addEventListener('input', checkFormValidity);
    }
    if (clientEmailInput) {
        clientEmailInput.addEventListener('input', checkFormValidity);
    }
    if (phoneNumberInput) {
        phoneNumberInput.addEventListener('input', checkFormValidity);
    }

    // 1. Attach the listener to the FORM's 'submit' event, not the button's 'click'.
    // 2. Ensure only ONE such listener exists for form submission.
    if (quoteForm) {
        quoteForm.addEventListener('submit', submitQuoteForm); // <--- THIS IS THE CORRECT LISTENER
    } else {
        console.error("Form with ID 'quoteForm' not found! Form submission will not work correctly.");
    }
    //if (submitBtn) {
    //    submitBtn.addEventListener('click', submitQuoteForm);
    //} else {
    //     console.error("Submit button with ID 'submitQuoteBtn' not found!");
   // }


    // --- NEW: Initialize Bootstrap Tooltips on all elements that might have them ---
    // This is a common way to activate all tooltips on a page.
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Call updatePriceDisplay initially in case some fields have default values
    // or were pre-filled by the browser (e.g., during development or refreshing).
    updatePriceDisplay();
    checkFormValidity(); // Crucial: Set initial button state on page load
});