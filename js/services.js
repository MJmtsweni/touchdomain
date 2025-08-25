// --- Global helper function for toast notifications ---
function showToast(title, message, type) {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.style.position = 'fixed';
        toastContainer.style.bottom = '1rem';
        toastContainer.style.right = '1rem';
        toastContainer.style.zIndex = '1090';
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

document.addEventListener('DOMContentLoaded', () => {
    const orderNowModal = document.getElementById('orderNowModal');
    const orderNowForm = document.getElementById('orderNowForm');
    const orderNowBtn = document.getElementById('orderNowBtn');
    const orderNowSpinner = document.getElementById('orderNowSpinner');

    if (orderNowModal) {
        // Event listener to dynamically update the modal content
        orderNowModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const packageName = button.getAttribute('data-package-name');
            const modalTitle = orderNowModal.querySelector('#selectedPackageName');
            const modalPackageNameText = orderNowModal.querySelector('#modalPackageName');
            const packageIdInput = orderNowModal.querySelector('#packageId');

            // Set the package name in the modal title and form text
            if (modalTitle && modalPackageNameText) {
                const formattedName = packageName.replace('package-', '').replace('-', ' ');
                modalTitle.textContent = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
                modalPackageNameText.textContent = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
            }
            // Set the package ID in a hidden input for form submission
            if (packageIdInput) {
                packageIdInput.value = packageName;
            }
        });
    }

    if (orderNowForm) {
        orderNowForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!orderNowForm.checkValidity()) {
                orderNowForm.classList.add('was-validated');
                return;
            }

            orderNowSpinner.classList.remove('d-none');
            orderNowBtn.disabled = true;
            orderNowBtn.classList.add('disabled');

            const orderData = {
                clientName: document.getElementById('orderName').value,
                clientEmail: document.getElementById('orderEmail').value,
                phoneNumber: document.getElementById('orderPhone').value,
                packageId: document.getElementById('packageId').value,
            };

            try {
                const response = await fetch('http://localhost:5000/api/generate-package-quote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to submit order request');
                }

                const result = await response.json();
                console.log('Order request successful:', result.message);
                showToast('Success!', result.message, 'success');

                const modalInstance = bootstrap.Modal.getInstance(orderNowModal);
                if (modalInstance) {
                    modalInstance.hide();
                }
                orderNowForm.reset();
                orderNowForm.classList.remove('was-validated');

            } catch (error) {
                console.error('Order request error:', error);
                showToast('Error!', error.message || 'An unexpected error occurred.', 'danger');

            } finally {
                orderNowSpinner.classList.add('d-none');
                orderNowBtn.disabled = false;
                orderNowBtn.classList.remove('disabled');
            }
        });
    }
});