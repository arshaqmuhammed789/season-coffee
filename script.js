$(document).ready(() => {
    displayItems("Hot Drinks");

    $(".clear").click(() => {
        localStorage.clear();
        addToCart();
        window.location.reload();
    });

    $(".list-item").click(function() {
        $('.list-item').removeClass('active');
        $(this).addClass("active");
        const catagory = $(this).text();
        console.log(catagory);
        displayItems(catagory);
    });
});

function displayItems(catagory) {
    const main = $(".product-list");
    main.remove();

    fetch('item_details.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const catagoryItems = data.filter(list => list.catagory === catagory);

        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        addToCart();

        catagoryItems.forEach((item) => {
            let qty = 1;
            const main = document.querySelector(".main");
            const productRow = document.createElement("div");
            const productImg = document.createElement("img");
            const productDetails = document.createElement("div");
            const title = document.createElement("p");
            const perSave = document.createElement("p");
            const description = document.createElement("p");
            const price = document.createElement("p");
            const addBtn = document.createElement("button");
            const qtyBtn = document.createElement("div");
            const vegImg = document.createElement("img");

            $(productRow).addClass("product-list");
            $(productDetails).addClass("product-details");
            $(title).addClass("product-title");
            $(addBtn).addClass("add-btn");
            $(title).text(item.name);
            $(addBtn).text("Add Item");

            // Check if the item is already in the cart
            let existingItem = cartItems.find(cartItem => cartItem.item === item.name);
            if (existingItem) {
                qty = existingItem.quantity;
                $(qtyBtn).find(".quantity").text(qty);
                $(addBtn).css("display", "none");
                $(qtyBtn).css("display", "flex");
            }

            $(addBtn).click(function() {
                $(this).css("display", "none");
                $(qtyBtn).css("display", "flex");
                $(".cart").css("display", "block");

                const cart = {
                    item: item.name,
                    quantity: qty,
                    price: item.price,
                };
                qty =1;

                // Add the item to the cart or update it if it already exists
                if (existingItem) {
                    existingItem.quantity = qty;  // Update the quantity if item exists
                    existingItem.price = item.price * qty;  // Update the price based on the new quantity
                } else {
                    cartItems.push(cart);
                }
                $(".quantity").text(qty);
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                addToCart();

            });

            $(vegImg).attr('src', "veg icon.png");
            $(productImg).attr('src', "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?cs=srgb&dl=pexels-chevanon-312418.jpg&fm=jpg");
            $(perSave).text(item.quantity);
            $(description).text(item.description);
            $(price).text("OMR " + item.price); 
            $(qtyBtn).addClass('qty-btn');
            $(qtyBtn).html(` <button class="decrement-btn">-</button> <p class="quantity">${qty}</p> <button class="increment-btn">+</button>`);

            productRow.appendChild(productImg);
            productRow.appendChild(productDetails);
            productDetails.appendChild(vegImg);
            productDetails.appendChild(title);
            productDetails.appendChild(perSave);
            productDetails.appendChild(description);
            productDetails.appendChild(price);
            productRow.appendChild(addBtn);
            productRow.appendChild(qtyBtn);
            main.appendChild(productRow);

            // Decrement button functionality
            $(qtyBtn).find(".decrement-btn").click(function() {
                if (qty > 0) {
                    qty--;
                    const cart = {
                        item: item.name,
                        quantity: qty,
                        price: item.price,
                    };

                    // Find the existing item and update its quantity and price
                    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.item === item.name);
                    if (existingItemIndex !== -1) {
                        cartItems[existingItemIndex].quantity = qty;
                        cartItems[existingItemIndex].price = item.price * qty;  // Recalculate price based on updated quantity
                    } else {
                        cartItems.push(cart);
                    }

                    // If quantity is 0, remove the item from cartItems
                    if (qty === 0) {
                        cartItems = cartItems.filter(cartItem => cartItem.item !== item.name);
                        $(qtyBtn).css("display", "none");  // Hide the qtyBtn
                        $(addBtn).css("display", "block"); 
                    }

                    // Save updated cart to localStorage
                    localStorage.setItem("cartItems", JSON.stringify(cartItems));
                    addToCart();
                    $(qtyBtn).find(".quantity").text(qty);
                    $(price).text("OMR " + (item.price).toFixed(1));  // Update price when quantity changes
                }
                // else {
                //     $(qtyBtn).css("display", "none");
                //     $(addBtn).css("display", "block");
                // }
            });

            // Increment button functionality
            $(qtyBtn).find(".increment-btn").click(function() {
                qty++;
                const cart = {
                    item: item.name,
                    quantity: qty,
                    price: item.price,
                };

                // Find the existing item and update its quantity and price
                const existingItemIndex = cartItems.findIndex(cartItem => cartItem.item === item.name);
                if (existingItemIndex !== -1) {
                    cartItems[existingItemIndex].quantity = qty;
                    cartItems[existingItemIndex].price = item.price * qty;  // Recalculate price based on updated quantity
                } else {
                    cartItems.push(cart);
                }

                // Save updated cart to localStorage
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                addToCart();
                $(qtyBtn).find(".quantity").text(qty);
                $(price).text("OMR " + (item.price).toFixed(1));  // Update price when quantity changes
            });
        });
    })
    .catch(error => {
        console.error('Error fetching the data:', error);
    });
}

function addToCart() {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (cartItems.length < 1) {
        $(".cart").css("display", "none");
    };

    if (cartItems.length > 0) {
        $(".cart").css("display", "block");
    }
    $(".items-added").text(cartItems.length + " ITEMS ADDED");
    let more = cartItems.length - 1;
    let cartItemName;
    if (cartItems.length > 1) {
        cartItemName = `${cartItems[0].item} +${more} more`;
    } else if (cartItems.length === 1) {
        cartItemName = cartItems[0].item;
    }
    $(".cart-item-name").text(cartItemName);
    console.log(cartItems);

    const sum = cartItems.reduce(function(acc, itemPrice) {
        return acc + itemPrice.price;  // Just sum the updated prices for each item
    }, 0);

    $(".cart-total").text("OMR "+sum.toFixed(2));
}
