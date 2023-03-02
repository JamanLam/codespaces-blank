const submitButton = document.querySelector('button[type="submit"]');
const barrierRadius = 50;
let isActive = false;

const handleMouseMove = function (event) {
	const barrierX = event.pageX;
	const barrierY = event.pageY;
	const submitButtonRect = submitButton.getBoundingClientRect();
	const submitButtonX = submitButtonRect.x + submitButtonRect.width / 2;
	const submitButtonY = submitButtonRect.y + submitButtonRect.height / 2;
	const distance = Math.sqrt(
		Math.pow(submitButtonX - barrierX, 2) + Math.pow(submitButtonY - barrierY, 2)
	);

	if (distance <= barrierRadius) {
		const randomY = Math.floor(Math.random() * 400) - 200; // generates a random number between -100 and 100
		submitButton.style.setProperty("--hover-translate", `${randomY}px`);
		submitButton.style.transform = `translateY(${submitButton.style.getPropertyValue(
			"--hover-translate"
		)})`;
		submitButton.innerText = "Not enough money";
	} else {
		submitButton.innerText = "Place Order";
	}

	// else {
	//   const randomY = Math.floor(Math.random() * - 400);
	//   submitButton.style.setProperty('--hover-translate', `${randomY}px`);
	//   submitButton.style.transform = `translateY(${submitButton.style.getPropertyValue('--hover-translate')})`;
	// }
	// submitButton.innerText = "Place Order";
};

document.addEventListener("mousemove", handleMouseMove);

// Define a function to update the cart totals
function updateCart() {
	// Get the relevant elements from the DOM
	const subtotalAmountElem = document.getElementById("subtotal");
	const shippingAmountElem = document.getElementById("shipping");
	const totalAmountElem = document.getElementById("total");
	const products = document.querySelectorAll(".product-card");
	const submitButton = document.querySelector('button[type="submit"]');
	const submitButtonDisabled = submitButton.disabled;

	// Initialize the subtotal and total amounts
	let subtotal = 0;
	let total = 0;

	// Loop through each product card and update the subtotal
	products.forEach((product) => {
		const priceElem = product.querySelector(".price span");
		const quantityElem = product.querySelector(".quantity");
		const price = parseFloat(priceElem.innerText.replace(",", ""));
		const quantity = parseInt(quantityElem.innerText);
		subtotal += price * quantity;
	});

	// Update the subtotal amount in the DOM
	subtotalAmountElem.innerText = subtotal.toFixed(2);

	// Calculate the total amount including shipping and update the DOM
	if (subtotal > 10) {
		shippingAmountElem.innerText = (15.0).toFixed(2);
		total = subtotal + 15.0;
	} else {
		shippingAmountElem.innerText = (0.0).toFixed(2);
		total = subtotal;
	}
	totalAmountElem.innerText = total.toFixed(2);

	if (total >= 0 && total < 50 && isActive) {
		document.removeEventListener("mousemove", handleMouseMove);
		isActive = false;
	} else if (total >= 50 && !isActive) {
		document.addEventListener("mousemove", handleMouseMove);
		isActive = true;
	}

	if (!submitButtonDisabled && total > 5) {
		submitButton.classList.add("active");
		submitButton.addEventListener("click", function (event) {
			event.preventDefault();
			submitButton.classList.remove("active");
			submitButton.disabled = true;
			submitButton.style.transform = "scale(0.75)";
			submitButton.innerText = "Order Confirmed";
			setTimeout(function () {
				submitButton.style.transform = "scale(1)";
			}, 200);
		});
	}
}

// Define a function to decrement the quantity of a product
function decrementQuantity(quantityElem) {
	// Get the current quantity value
	let quantity = parseInt(quantityElem.innerText);

	// Decrement the quantity if it's greater than 1
	if (quantity > 1) {
		quantity--;
		quantityElem.innerText = quantity;
		updateCart();
	}
}

// Define a function to increment the quantity of a product
function incrementQuantity(quantityElem) {
	// Get the current quantity value
	let quantity = parseInt(quantityElem.innerText);

	// Increment the quantity
	quantity++;
	quantityElem.innerText = quantity;
	updateCart();
}

// Define a function to remove a product from the cart
function cancelProduct(cancelBtn) {
	// Get the parent product card element
	const productCardElem = cancelBtn.closest(".product-card");
	productCardElem.style.transform = "scale(.7)";

	// Remove the product card from the DOM
	setTimeout(function () {
		productCardElem.remove();
        updateCart();
	}, 100);

	// productCardElem.remove();

	// Update the cart totals
	// updateCart();
}
