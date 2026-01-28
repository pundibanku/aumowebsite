import { db, collection, addDoc, serverTimestamp } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('orderForm');
    const successModal = document.getElementById('successModal');
    const submitBtn = document.getElementById('submitBtn');
    const onlineMsg = document.getElementById('onlineMsg');
    const payRadios = document.querySelectorAll('input[name="paymentMethod"]');

    payRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'Online') {
                onlineMsg.style.display = 'block';
            } else {
                onlineMsg.style.display = 'none';
            }
        });
    });

    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const address = document.getElementById('address').value.trim();
            const payMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

            if (!name || phone.length < 10 || !address) {
                alert("Please enter proper Name, 10-digit Phone, and Address!");
                return;
            }

            // Disable button
            submitBtn.disabled = true;
            submitBtn.innerText = "Connecting to Server...";

            const formData = {
                customerName: name,
                phoneNumber: phone,
                address: address,
                productName: "Ausmoherbal Hair Oil",
                price: 499,
                status: "Pending",
                paymentMethod: payMethod,
                createdAt: serverTimestamp(),
                orderDate: new Date().toLocaleDateString('en-IN')
            };

            console.log("Submitting order to Firebase:", formData);

            try {
                // Setting a 15 second timeout for the request
                const savePromise = addDoc(collection(db, "orders"), formData);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Network Timeout! Firebase is not responding.")), 15000)
                );

                const docRef = await Promise.race([savePromise, timeoutPromise]);

                console.log("Order Success! ID:", docRef.id);
                if (successModal) {
                    successModal.style.display = 'flex';
                } else {
                    alert("Order Placed Successfully!");
                }
                orderForm.reset();

            } catch (error) {
                console.error("Critical Error:", error);
                alert("❌ ORDER FAIL HOGAYA!\n\nReason: " + error.message + "\n\n1. Check if Firestore is 'Enabled' in Console.\n2. Check if Rules are set to 'true'.\n3. Check your Internet connection.");
            } finally {
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
