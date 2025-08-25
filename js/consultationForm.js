// about.js

// --- showToast function (duplicated for self-containment) ---
function showToast(title, message, type) {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        // Create the toast container if it doesn't exist
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.style.position = 'fixed';
        toastContainer.style.bottom = '1rem';
        toastContainer.style.right = '1rem';
        toastContainer.style.zIndex = '100001'; // Higher than Bootstrap modal
        document.body.appendChild(toastContainer);
    }
    const toastElement = document.createElement('div');
    toastElement.classList.add('toast', 'align-items-center', 'border-0');
    if (type === 'success') { toastElement.classList.add('text-bg-success'); }
    else if (type === 'danger') { toastElement.classList.add('text-bg-danger'); }
    else { toastElement.classList.add('text-bg-info'); }
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <strong>${title}</strong> ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    toastContainer.appendChild(toastElement);
    const bsToast = new bootstrap.Toast(toastElement, { autohide: true, delay: 5000 });
    bsToast.show();
    toastElement.addEventListener('hidden.bs.toast', () => { toastElement.remove(); });
}

// --- NEW: Function to validate consultation date and time ---
function isBookingDateTimeValid(dateTimeString) {
    // List of South African public holidays (YYYY-MM-DD format)
    // IMPORTANT: This list needs to be updated annually.
    const publicHolidaysSA = [
        // 2024
        '2024-01-01', '2024-03-21', '2024-03-29', '2024-04-01', '2024-04-27',
        '2024-05-01', '2024-06-16', '2024-06-17', '2024-08-09', '2024-09-24',
        '2024-12-16', '2024-12-25', '2024-12-26',
        // 2025
        '2025-01-01', '2025-03-21', '2025-04-18', '2025-04-21', '2025-04-27',
        '2025-04-28', '2025-05-01', '2025-06-16', '2025-08-09', '2025-09-24',
        '2025-12-16', '2025-12-25', '2025-12-26',
    ];

    const selectedDate = new Date(dateTimeString);
    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hours = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();

    // 1. Check for Sundays (dayOfWeek === 0)
    if (dayOfWeek === 0) {
        return { isValid: false, message: 'Sundays are not available for consultations.' };
    }

    // 2. Check for public holidays
    // Get the date part in YYYY-MM-DD format for comparison
    const dateString = selectedDate.toISOString().split('T')[0];
    if (publicHolidaysSA.includes(dateString)) {
        return { isValid: false, message: 'Selected date is a public holiday and not available for consultations.' };
    }

    // 3. Check for business hours (Monday - Friday, 8:00 to 17:00)
    // We already know it's not Sunday. Let's exclude Saturdays now.
    if (dayOfWeek === 6) { // Saturday
        return { isValid: false, message: 'Consultations are only available on weekdays.' };
    }

    if (hours < 8 || hours >= 17 || (hours === 17 && minutes > 0)) {
        return { isValid: false, message: 'Consultations are only available between 8:00 AM and 5:00 PM.' };
    }

    // All checks passed
    return { isValid: true, message: '' };
}

// --- Event Listener Setup for Consultation Form ---
document.addEventListener('DOMContentLoaded', () => {

    const consultationForm = document.getElementById('consultationForm');
    const bookConsultationBtn = document.getElementById('bookConsultationBtn');
    const consultationSpinner = document.getElementById('consultationSpinner');
    const consultationModal = new bootstrap.Modal(document.getElementById('consultationModal'));
    const consultationDateTimeInput = document.getElementById('consultationDateTime'); // NEW: Get reference to the date/time input

    if (consultationForm) {
        consultationForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!consultationForm.checkValidity()) {
                consultationForm.classList.add('was-validated');
                return;
            }

            // --- NEW: Custom date/time validation ---
            const validationResult = isBookingDateTimeValid(consultationDateTimeInput.value);
            if (!validationResult.isValid) {
                showToast('Booking Error!', validationResult.message, 'danger');
                return; // Stop the form submission
            }
            // --- END NEW VALIDATION ---

            consultationSpinner.classList.remove('d-none');
            bookConsultationBtn.disabled = true;
            bookConsultationBtn.classList.add('disabled');

            const consultationData = {
                consultationName: document.getElementById('consultationName').value,
                consultationEmail: document.getElementById('consultationEmail').value,
                consultationPhone: document.getElementById('consultationPhone').value,
                consultationDateTime: document.getElementById('consultationDateTime').value,
            };

            try {
                // Using the full URL for the backend server when running locally
                const response = await fetch('http://localhost:5000/api/book-consultation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(consultationData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to submit consultation request');
                }

                const result = await response.json();
                console.log('Consultation request successful:', result.message);
                showToast('Success!', result.message, 'success');
                consultationModal.hide();
                consultationForm.reset();
                consultationForm.classList.remove('was-validated');

            } catch (error) {
                console.error('Consultation request error:', error);
                showToast('Error!', error.message || 'An unexpected error occurred.', 'danger');
            } finally {
                consultationSpinner.classList.add('d-none');
                bookConsultationBtn.disabled = false;
                bookConsultationBtn.classList.remove('disabled');
            }
        });
    } else {
        console.warn("Consultation form with ID 'consultationForm' not found on this page.");
    }
});
