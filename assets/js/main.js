import { db, collection, addDoc, serverTimestamp } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('orderForm');
    const successModal = document.getElementById('successModal');
    const submitBtn = document.getElementById('submitBtn');

    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Form validation check
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const address = document.getElementById('address').value.trim();

            if (!name || !phone || !address) {
                alert("Please fill all fields properly!");
                return;
            }

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerText = "Order Processing... Please Wait";

            const formData = {
                customerName: name,
                phoneNumber: phone,
                address: address,
                productName: "Ausmoherbal Hair Oil",
                price: 499,
                status: "Pending",
                createdAt: serverTimestamp(),
                orderDate: new Date().toLocaleDateString('en-IN'),
                timestamp: Date.now() // Plan B for sorting
            };

            console.log("Attempting to save order:", formData);

            try {
                // Save to Firestore 'orders' collection
                const docRef = await addDoc(collection(db, "orders"), formData);
                console.log("Order Success! ID:", docRef.id);

                // Show success modal
                if (successModal) {
                    successModal.style.display = 'flex';
                } else {
                    alert("Order Placed Successfully!");
                }

                // Clear form
                orderForm.reset();
            } catch (error) {
                console.error("Firebase Logic Error:", error);
                alert("Order Error: " + error.message + "\nCheck if Firestore is enabled in Firebase Console.");
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerText = "CONFIRM ORDER @ ₹499";
            }
        });
    }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
