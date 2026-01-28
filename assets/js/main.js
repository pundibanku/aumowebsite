import { db, collection, addDoc, serverTimestamp } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('orderForm');
    const successModal = document.getElementById('successModal');
    const submitBtn = document.getElementById('submitBtn');

    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerText = "Processing...";

            const formData = {
                customerName: document.getElementById('name').value,
                phoneNumber: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                productName: "Ausmoherbal Hair Oil",
                price: 499,
                currency: "INR",
                status: "Pending", // For admin dashboard compatibility
                createdAt: serverTimestamp(),
                orderDate: new Date().toLocaleDateString('en-IN'),
                source: "Landing Page"
            };

            try {
                // Save to Firestore 'orders' collection
                const docRef = await addDoc(collection(db, "orders"), formData);
                console.log("Order placed with ID: ", docRef.id);

                // Show success modal
                successModal.style.display = 'flex';

                // Clear form
                orderForm.reset();
            } catch (error) {
                console.error("Error adding document: ", error);
                alert("Order failed: " + error.message);
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerText = "CONFIRM ORDER @ ₹499";
            }
        });
    }
});

// Smooth Scroll for Anchor Tags
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
