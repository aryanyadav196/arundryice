/* =========================================================
   ARUN DRY ICE
   PRODUCT ORDER SYSTEM
   main.js
========================================================= */


/* =========================================================
   PRODUCT CONFIGURATION
========================================================= */

const PRODUCT = {

    name: "DRY ICE",

    description:
        "High-quality Dry Ice ▪️Events and Entertainment ▪️Pharmaceuticals and Medical Logistics ▪️Food and Beverage Industry ▪️Industrial Cooling and Laboratory",

    image: "./img/DRY_ICE.png",

    scanner: "./img/Scanner.jpeg"

};


/* =========================================================
   PRICING CONFIGURATION
========================================================= */

const PRICE_SLABS = [

    {
        min: 1,
        max: 9,
        price: 100
    },

    {
        min: 10,
        max: 19,
        price: 100
    },

    {
        min: 20,
        max: Infinity,
        price: 100
    }

];


/* =========================================================
   OTHER CHARGES
========================================================= */

const CONFIG = {

    deliverySlabs: [

        {
            min: 1,
            max: 9,
            fee: 200
        },

        {
            min: 10,
            max: 19,
            fee: 100
        },

        {
            min: 20,
            max: Infinity,
            fee: 0
        }

    ],

    platformFeePercent: 0,

    adminWhatsApp: "919323735889",

    /*
       Quantity based discount.

       Regular price = ₹100/Kg
       Discount = 30%

       Saving = ₹30/Kg
       Final price = ₹70/Kg
    */

    discountSlabs: [

        {
            min: 1,
            max: Infinity,
            percent: 30
        }

    ]

};


/* =========================================================
   STATE
========================================================= */

let orderData = createEmptyOrder();


function createEmptyOrder() {

    return {

        product: PRODUCT.name,

        quantity: 1,

        regularPricePerUnit: 0,

        regularProductCost: 0,

        pricePerUnit: 0,

        productCost: 0,

        delivery: 0,

        platformFee: 0,

        discount: 0,

        discountPerUnit: 0,

        discountPercent: 0,

        total: 0,

        customer: {

            name: "",
            phone: "",
            place: "",
            address: "",
            placeUrl: "",
            requestedDate: "",
            requestedTime: ""

        },

        orderId: "",
        date: "",
        time: ""

    };

}


/* =========================================================
   DOM HELPER
========================================================= */

function $(id) {

    return document.getElementById(id);

}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    init
);


function init() {

    loadProduct();

    setupQuantityControls();

    setupNavigation();

    setupForms();

    setupSharing();

    loadSavedCustomer();

    loadSavedQuantity();

    improveTextSizes();

    updatePrice();

    setMinimumDate();

}


/* =========================================================
   UI TEXT SIZE
========================================================= */

function improveTextSizes() {

    const style = document.createElement("style");

    style.id = "arunDryIceTextFix";

    style.textContent = `

        #productStep h1,
        #productStep h2,
        #productStep h3 {

            font-size: 1.15rem;

        }

        #productName {

            font-size: 1.35rem !important;

        }

        #productDescription {

            font-size: 0.88rem !important;
            line-height: 1.6 !important;

        }

        label,
        .form-label,
        .quantity-label,
        .quick-quantity-label {

            font-size: 0.82rem !important;

        }

        .quantity-option {

            font-size: 0.88rem !important;

        }

        #quantityInput {

            font-size: 1rem !important;
            font-weight: 700;

        }

        #pricePerUnit,
        #regularPricePerUnit,
        #savingPerUnit {

            font-size: 0.95rem !important;

        }

        .order-summary h2,
        .summary-title {

            font-size: 1rem !important;

        }

        .summary-label,
        .summary-row span:first-child {

            font-size: 0.78rem !important;

        }

        .summary-value,
        .summary-row span:last-child {

            font-size: 0.88rem !important;

        }

        #youSave,
        #yourSavings,
        #savingPerUnit,
        #savingsAmount,
        #savingAmount {

            font-size: 0.95rem !important;
            font-weight: 700;

        }

        #discountedProductCost,
        #discountedCost,
        #finalProductCost {

            font-size: 0.9rem !important;
            font-weight: 700;

        }

        #totalPrice {

            font-size: 1.25rem !important;
            font-weight: 800;

        }

    `;

    if (!document.getElementById("arunDryIceTextFix")) {

        document.head.appendChild(style);

    }

}


/* =========================================================
   PRODUCT
========================================================= */

function loadProduct() {

    setText(
        "productName",
        PRODUCT.name
    );

    setText(
        "productDescription",
        PRODUCT.description
    );


    if ($("productImage")) {

        $("productImage").src =
            PRODUCT.image;

    }


    if ($("scannerImage")) {

        $("scannerImage").src =
            PRODUCT.scanner;

    }


    if ($("downloadScanner")) {

        $("downloadScanner").href =
            PRODUCT.scanner;

    }

}


/* =========================================================
   QUANTITY CONTROLS
========================================================= */

function setupQuantityControls() {

    const input =
        $("quantityInput");

    if (!input) return;


    $("increaseQuantity")?.addEventListener(
        "click",
        () => {

            const current =
                getValidQuantity();

            input.value =
                current + 1;

            updatePrice();

        }
    );


    $("decreaseQuantity")?.addEventListener(
        "click",
        () => {

            const current =
                getValidQuantity();

            input.value =
                Math.max(
                    1,
                    current - 1
                );

            updatePrice();

        }
    );


    input.addEventListener(
        "input",
        () => {

            const raw =
                input.value.trim();


            if (raw === "") {

                updatePrice();

                return;

            }


            const quantity =
                Number(raw);


            if (
                !Number.isInteger(quantity) ||
                quantity < 1
            ) {

                return;

            }


            updatePrice();

        }
    );


    input.addEventListener(
        "blur",
        () => {

            const raw =
                input.value.trim();


            const quantity =
                parseInt(
                    raw,
                    10
                );


            if (
                raw === "" ||
                Number.isNaN(quantity) ||
                quantity < 1
            ) {

                input.value = 1;

            }


            updatePrice();

        }
    );


    document
        .querySelectorAll(".quantity-option")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const quantity =
                        parseInt(
                            button.dataset.quantity,
                            10
                        );


                    if (
                        Number.isNaN(quantity) ||
                        quantity < 1
                    ) {

                        return;

                    }


                    input.value =
                        quantity;

                    updatePrice();

                }
            );

        });

}


/* =========================================================
   LOAD SAVED QUANTITY
========================================================= */

function loadSavedQuantity() {

    const saved =
        localStorage.getItem(
            "savedQuantity"
        );


    const input =
        $("quantityInput");


    if (!input) return;


    if (saved) {

        const quantity =
            parseInt(
                saved,
                10
            );


        if (
            Number.isInteger(quantity) &&
            quantity >= 1
        ) {

            input.value =
                quantity;

        }

    }


    if (
        !input.value ||
        !Number.isInteger(
            Number(input.value)
        ) ||
        Number(input.value) < 1
    ) {

        input.value = 1;

    }

}


/* =========================================================
   GET VALID QUANTITY
========================================================= */

function getValidQuantity() {

    const input =
        $("quantityInput");


    if (!input) {

        return 1;

    }


    const quantity =
        Number(input.value);


    if (
        !Number.isInteger(quantity) ||
        quantity < 1
    ) {

        return 1;

    }


    return quantity;

}


/* =========================================================
   ACTIVE QUICK QUANTITY
========================================================= */

function setActiveQuantityButton(
    quantity
) {

    document
        .querySelectorAll(".quantity-option")
        .forEach(button => {

            const buttonQuantity =
                parseInt(
                    button.dataset.quantity,
                    10
                );


            button.classList.toggle(
                "active",
                buttonQuantity === quantity
            );

        });

}


/* =========================================================
   GET REGULAR PRICE
========================================================= */

function getPricePerUnit(quantity) {

    quantity =
        Number(quantity);


    if (
        !Number.isFinite(quantity) ||
        quantity < 1
    ) {

        return 0;

    }


    const slab =
        PRICE_SLABS.find(
            item =>
                quantity >= item.min &&
                quantity <= item.max
        );


    return slab
        ? Number(slab.price) || 0
        : 0;

}


/* =========================================================
   GET DISCOUNT %
========================================================= */

function getDiscountPercent(quantity) {

    quantity =
        Number(quantity);


    if (
        !Number.isFinite(quantity) ||
        quantity < 1
    ) {

        return 0;

    }


    const slab =
        CONFIG.discountSlabs.find(
            item =>
                quantity >= item.min &&
                quantity <= item.max
        );


    return slab
        ? Number(slab.percent) || 0
        : 0;

}


/* =========================================================
   GET DELIVERY
========================================================= */

function getDelivery(quantity) {

    quantity =
        Number(quantity);


    if (
        !Number.isFinite(quantity) ||
        quantity < 1
    ) {

        return 0;

    }


    const slab =
        CONFIG.deliverySlabs.find(
            item =>
                quantity >= item.min &&
                quantity <= item.max
        );


    return slab
        ? Number(slab.fee) || 0
        : 0;

}


/* =========================================================
   PRICE CALCULATION
========================================================= */

function calculatePrice(quantity) {

    quantity =
        Number(quantity);


    if (
        !Number.isInteger(quantity) ||
        quantity < 1
    ) {

        return {

            quantity: 0,

            regularPricePerUnit: 0,
            regularProductCost: 0,

            pricePerUnit: 0,
            productCost: 0,

            delivery: 0,
            platformFee: 0,

            discount: 0,
            discountPerUnit: 0,
            discountPercent: 0,

            total: 0

        };

    }


    /* =====================================================
       1. REGULAR PRICE PER KG
    ===================================================== */

    const regularPricePerUnit =
        getPricePerUnit(
            quantity
        );


    /* =====================================================
       2. REGULAR PRODUCT COST

       Example:
       50 Kg × ₹100
       = ₹5,000
    ===================================================== */

    const regularProductCost =
        quantity *
        regularPricePerUnit;


    /* =====================================================
       3. DISCOUNT PERCENT
    ===================================================== */

    const discountPercent =
        getDiscountPercent(
            quantity
        );


    /* =====================================================
       4. SAVING PER KG

       Example:
       ₹100 × 30%
       = ₹30/Kg
    ===================================================== */

    const discountPerUnit =
        Math.round(
            regularPricePerUnit *
            discountPercent /
            100
        );


    /* =====================================================
       5. TOTAL SAVING

       Example:
       50 Kg × ₹30
       = ₹1,500
    ===================================================== */

    const discount =
        quantity *
        discountPerUnit;


    /* =====================================================
       6. DISCOUNTED PRODUCT COST

       Example:
       ₹5,000 - ₹1,500
       = ₹3,500
    ===================================================== */

    const productCost =
        Math.max(
            0,
            regularProductCost -
            discount
        );


    /* =====================================================
       7. FINAL PRICE PER KG

       Example:
       ₹100 - ₹30
       = ₹70/Kg
    ===================================================== */

    const pricePerUnit =
        Math.max(
            0,
            regularPricePerUnit -
            discountPerUnit
        );


    /* =====================================================
       8. DELIVERY
    ===================================================== */

    const delivery =
        getDelivery(
            quantity
        );


    /* =====================================================
       9. PLATFORM FEE

       Platform fee is calculated on
       the discounted product cost.
    ===================================================== */

    const platformFee =
        Math.round(
            productCost *
            (
                Number(
                    CONFIG.platformFeePercent
                ) || 0
            ) /
            100
        );


    /* =====================================================
       10. FINAL TOTAL

       IMPORTANT:

       productCost is ALREADY DISCOUNTED.

       Therefore:

       TOTAL =
       Discounted Product Cost
       + Delivery
       + Platform Fee

       DO NOT subtract discount again.

       Example for 50 Kg:

       ₹3,500
       + ₹200
       + ₹0
       = ₹3,700
    ===================================================== */

    const total =
        Math.max(
            0,
            productCost +
            delivery +
            platformFee
        );


    return {

        quantity,

        regularPricePerUnit,

        regularProductCost,

        pricePerUnit,

        productCost,

        delivery,

        platformFee,

        discount,

        discountPerUnit,

        discountPercent,

        total

    };

}


/* =========================================================
   UPDATE PRICE
========================================================= */

function updatePrice() {

    const input =
        $("quantityInput");


    if (!input) return;


    const raw =
        input.value.trim();


    /* -----------------------------------------------------
       EMPTY
    ----------------------------------------------------- */

    if (raw === "") {

        orderData = {

            ...orderData,

            quantity: 0,

            regularPricePerUnit: 0,

            regularProductCost: 0,

            pricePerUnit: 0,

            productCost: 0,

            delivery: 0,

            platformFee: 0,

            discount: 0,

            discountPerUnit: 0,

            discountPercent: 0,

            total: 0

        };


        updatePriceDisplay();

        setActiveQuantityButton(0);

        return;

    }


    const quantity =
        Number(raw);


    /* -----------------------------------------------------
       INVALID
    ----------------------------------------------------- */

    if (
        !Number.isInteger(quantity) ||
        quantity < 1
    ) {

        return;

    }


    /* -----------------------------------------------------
       CALCULATE
    ----------------------------------------------------- */

    const calculated =
        calculatePrice(
            quantity
        );


    /* -----------------------------------------------------
       UPDATE STATE
    ----------------------------------------------------- */

    orderData = {

        ...orderData,

        ...calculated,

        product:
            PRODUCT.name

    };


    /* -----------------------------------------------------
       UPDATE UI
    ----------------------------------------------------- */

    updatePriceDisplay();


    setActiveQuantityButton(
        quantity
    );


    /* -----------------------------------------------------
       SAVE QUANTITY
    ----------------------------------------------------- */

    localStorage.setItem(
        "savedQuantity",
        String(quantity)
    );

}


/* =========================================================
   PRICE DISPLAY
========================================================= */

function updatePriceDisplay() {

    const quantity =
        Number(
            orderData.quantity
        ) || 0;


    const regularPricePerUnit =
        Number(
            orderData.regularPricePerUnit
        ) || 0;


    const regularProductCost =
        Number(
            orderData.regularProductCost
        ) || 0;


    const pricePerUnit =
        Number(
            orderData.pricePerUnit
        ) || 0;


    const discountedProductCost =
        Number(
            orderData.productCost
        ) || 0;


    const discountPerUnit =
        Number(
            orderData.discountPerUnit
        ) || 0;


    const totalSaving =
        Number(
            orderData.discount
        ) || 0;


    const delivery =
        Number(
            orderData.delivery
        ) || 0;


    const platformFee =
        Number(
            orderData.platformFee
        ) || 0;


    const total =
        Number(
            orderData.total
        ) || 0;


    /* =====================================================
       MAIN DISCOUNTED PRICE
    ===================================================== */

    setText(
        "pricePerUnit",
        formatCurrency(
            pricePerUnit
        )
    );


    /* =====================================================
       REGULAR PRICE / KG
    ===================================================== */

    setText(
        "regularPricePerUnit",
        formatCurrency(
            regularPricePerUnit
        ) + " / Kg"
    );


    /* =====================================================
       SAVING PER KG
    ===================================================== */

    const savingText =
        formatCurrency(
            discountPerUnit
        );


    setText(
        "savingPerUnit",
        savingText + " / Kg"
    );


    /* =====================================================
       TOTAL SAVING
    ===================================================== */

    setText(
        "youSave",
        formatCurrency(
            totalSaving
        )
    );


    setText(
        "yourSavings",
        formatCurrency(
            totalSaving
        )
    );


    setText(
        "savingAmount",
        formatCurrency(
            totalSaving
        )
    );


    setText(
        "savingsAmount",
        formatCurrency(
            totalSaving
        )
    );


    /* =====================================================
       SAVING PER UNIT
    ===================================================== */

    setText(
        "discountPerUnit",
        savingText
    );


    /* =====================================================
       DISCOUNTED PRODUCT COST
    ===================================================== */

    setText(
        "discountedProductCost",
        formatCurrency(
            discountedProductCost
        )
    );


    setText(
        "discountedCost",
        formatCurrency(
            discountedProductCost
        )
    );


    setText(
        "finalProductCost",
        formatCurrency(
            discountedProductCost
        )
    );


    setText(
        "comparisonProductCost",
        formatCurrency(
            discountedProductCost
        )
    );


    /* =====================================================
       PRICE BREAKDOWN PRODUCT COST

       This remains REGULAR PRODUCT COST.

       Discount is shown separately.

       Example:

       Product Cost = ₹5,000
       Discount     = - ₹1,500
       Delivery     = ₹200

       Total        = ₹3,700
    ===================================================== */

    setText(
        "productCost",
        formatCurrency(
            regularProductCost
        )
    );


    /* =====================================================
       QUANTITY
    ===================================================== */

    setText(
        "summaryQuantity",
        quantity
    );


    setText(
        "customerQuantity",
        quantity > 0
            ? `${quantity} Kg`
            : "—"
    );


    /* =====================================================
       TOTAL SAVING
    ===================================================== */

    setText(
        "totalSaving",
        formatCurrency(
            totalSaving
        )
    );


    setText(
        "customerSavings",
        formatCurrency(
            totalSaving
        )
    );


    setText(
        "yourTotalSaving",
        formatCurrency(
            totalSaving
        )
    );


    setText(
        "totalSavings",
        formatCurrency(
            totalSaving
        )
    );


    /* =====================================================
       DELIVERY
    ===================================================== */

    setText(
        "deliveryCost",
        formatCurrency(
            delivery
        )
    );


    setText(
        "delivery",
        formatCurrency(
            delivery
        )
    );


    /* =====================================================
       PLATFORM FEE
    ===================================================== */

    setText(
        "platformFee",
        formatCurrency(
            platformFee
        )
    );


    /* =====================================================
       DISCOUNT
    ===================================================== */

    setText(
        "discount",
        "- " +
        formatCurrency(
            totalSaving
        )
    );


    /* =====================================================
       TOTAL
    ===================================================== */

    setText(
        "totalPrice",
        formatCurrency(
            total
        )
    );


    setText(
        "customerTotal",
        formatCurrency(
            total
        )
    );


    /* =====================================================
       PRICING MESSAGE
    ===================================================== */

    if ($("pricingMessage")) {

        if (quantity < 1) {

            $("pricingMessage").textContent =
                "Enter your quantity to calculate the price.";

            $("pricingMessage")
                .classList
                .remove(
                    "success"
                );

        }

        else {

            const discountPercent =
                Number(
                    orderData.discountPercent
                ) || 0;


            if (discountPercent > 0) {

                $("pricingMessage").textContent =
                    `${discountPercent}% quantity discount applied. You save ${formatCurrency(totalSaving)}.`;

                $("pricingMessage")
                    .classList
                    .add(
                        "success"
                    );

            }

            else {

                $("pricingMessage").textContent =
                    `Price calculated for ${quantity} Kg.`;

                $("pricingMessage")
                    .classList
                    .remove(
                        "success"
                    );

            }

        }

    }

}


/* =========================================================
   TEXT HELPER
========================================================= */

function setText(
    id,
    value
) {

    const element =
        $(id);


    if (element) {

        element.textContent =
            value ?? "";

    }

}


/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(
    amount
) {

    return new Intl.NumberFormat(
        "en-IN",
        {

            style: "currency",

            currency: "INR",

            maximumFractionDigits: 0

        }
    ).format(
        Number(amount) || 0
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    $("buyNowButton")?.addEventListener(
        "click",
        () => {

            const quantity =
                getValidQuantity();


            if (
                quantity < 1 ||
                !$("quantityInput")?.value
            ) {

                showAlert(
                    "Please enter your quantity first."
                );

                $("quantityInput")?.focus();

                return;

            }


            updatePrice();

            updateCustomerPreview();

            showStep(2);

        }
    );


    $("backToProduct")?.addEventListener(
        "click",
        () => {

            showStep(1);

        }
    );


    $("customerNextButton")?.addEventListener(
        "click",
        () => {

            if (
                !validateCustomerForm()
            ) {

                return;

            }


            saveCustomerData();

            createOrderDetails();

            updatePaymentScreen();

            showStep(3);

        }
    );


    $("backToCustomer")?.addEventListener(
        "click",
        () => {

            showStep(2);

        }
    );


    $("paymentNextButton")?.addEventListener(
        "click",
        () => {

            /*
               Make absolutely sure the latest quantity
               is used before entering Step 4.
            */

            updatePrice();

            createOrderDetails();

            updateFinalSummary();

            showStep(4);

            setText(
                "finalProductCost",
                formatCurrency(
                    orderData.regularProductCost
                )
            );

        }
    );


    $("backToPayment")?.addEventListener(
        "click",
        () => {

            showStep(3);

        }
    );


    $("newOrderButton")?.addEventListener(
        "click",
        resetOrder
    );

}


/* =========================================================
   SHOW STEP
========================================================= */

function showStep(
    stepNumber
) {

    const steps = {

        1: "productStep",
        2: "customerStep",
        3: "paymentStep",
        4: "summaryStep"

    };


    Object.values(steps)
        .forEach(id => {

            $(id)?.classList.remove(
                "active"
            );

        });


    $(steps[stepNumber])
        ?.classList.add(
            "active"
        );


    updateStepIndicator(
        stepNumber
    );


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   STEP INDICATOR
========================================================= */

function updateStepIndicator(
    currentStep
) {

    for (
        let i = 1;
        i <= 4;
        i++
    ) {

        const indicator =
            $(`stepIndicator${i}`);


        if (!indicator) continue;


        indicator.classList.remove(
            "active",
            "completed"
        );


        if (
            i === currentStep
        ) {

            indicator.classList.add(
                "active"
            );

        }


        if (
            i < currentStep
        ) {

            indicator.classList.add(
                "completed"
            );

        }

    }

}


/* =========================================================
   FORMS
========================================================= */

function setupForms() {

    $("customerForm")?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            if (
                validateCustomerForm()
            ) {

                saveCustomerData();

                createOrderDetails();

                updatePaymentScreen();

                showStep(3);

            }

        }
    );

}


/* =========================================================
   VALIDATE CUSTOMER
========================================================= */

function validateCustomerForm() {

    const name =
        $("customerName")?.value.trim();


    const phone =
        $("customerPhone")?.value.trim();


    const place =
        $("customerPlace")?.value.trim();


    const address =
        $("customerAddress")?.value.trim();


    const requestedDate =
        $("requestedDate")?.value;


    const requestedTime =
        $("requestedTime")?.value;


    if (!name) {

        showAlert(
            "Please enter your full name."
        );

        $("customerName")?.focus();

        return false;

    }


    if (!phone) {

        showAlert(
            "Please enter your phone number."
        );

        $("customerPhone")?.focus();

        return false;

    }


    const phoneDigits =
        phone.replace(
            /\D/g,
            ""
        );


    if (
        phoneDigits.length < 10 ||
        phoneDigits.length > 15
    ) {

        showAlert(
            "Please enter a valid phone number."
        );

        $("customerPhone")?.focus();

        return false;

    }


    if (!place) {

        showAlert(
            "Please enter your place or city."
        );

        $("customerPlace")?.focus();

        return false;

    }


    if (!address) {

        showAlert(
            "Please enter your complete address."
        );

        $("customerAddress")?.focus();

        return false;

    }


    if (!requestedDate) {

        showAlert(
            "Please select your required date."
        );

        $("requestedDate")?.focus();

        return false;

    }


    if (!requestedTime) {

        showAlert(
            "Please select your required time."
        );

        $("requestedTime")?.focus();

        return false;

    }


    return true;

}


/* =========================================================
   SAVE CUSTOMER
========================================================= */

function saveCustomerData() {

    orderData.customer = {

        name:
            $("customerName")?.value.trim() || "",

        phone:
            $("customerPhone")?.value.trim() || "",

        place:
            $("customerPlace")?.value.trim() || "",

        address:
            $("customerAddress")?.value.trim() || "",

        placeUrl:
            $("AddressUrl")?.value.trim() || "",

        requestedDate:
            $("requestedDate")?.value || "",

        requestedTime:
            $("requestedTime")?.value || ""

    };


    localStorage.setItem(
        "customerInformation",
        JSON.stringify(
            orderData.customer
        )
    );

}


/* =========================================================
   LOAD SAVED CUSTOMER
========================================================= */

function loadSavedCustomer() {

    try {

        const saved =
            localStorage.getItem(
                "customerInformation"
            );


        if (!saved) return;


        const customer =
            JSON.parse(
                saved
            );


        if ($("customerName"))
            $("customerName").value =
                customer.name || "";


        if ($("customerPhone"))
            $("customerPhone").value =
                customer.phone || "";


        if ($("customerPlace"))
            $("customerPlace").value =
                customer.place || "";


        if ($("customerAddress"))
            $("customerAddress").value =
                customer.address || "";


        if ($("AddressUrl"))
            $("AddressUrl").value =
                customer.placeUrl || "";


        if ($("requestedDate"))
            $("requestedDate").value =
                customer.requestedDate || "";


        if ($("requestedTime"))
            $("requestedTime").value =
                customer.requestedTime || "";

    }

    catch (error) {

        console.error(
            "Unable to load saved customer data:",
            error
        );

    }

}


/* =========================================================
   MINIMUM DATE
========================================================= */

function setMinimumDate() {

    const input =
        $("requestedDate");


    if (!input) return;


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    input.min =
        `${year}-${month}-${day}`;

}


/* =========================================================
   CUSTOMER PREVIEW
========================================================= */

function updateCustomerPreview() {

    setText(
        "customerProductName",
        PRODUCT.name
    );


    setText(
        "customerQuantity",
        orderData.quantity > 0
            ? `${orderData.quantity} Kg`
            : "—"
    );


    setText(
        "customerTotal",
        formatCurrency(
            orderData.total
        )
    );

}


/* =========================================================
   ORDER DETAILS
========================================================= */

function createOrderDetails() {

    if (!orderData.orderId) {

        orderData.orderId =
            generateOrderId();


        const now =
            new Date();


        orderData.date =
            now.toLocaleDateString(
                "en-IN",
                {

                    day: "2-digit",

                    month: "short",

                    year: "numeric"

                }
            );


        orderData.time =
            now.toLocaleTimeString(
                "en-IN",
                {

                    hour: "2-digit",

                    minute: "2-digit",

                    second: "2-digit",

                    hour12: true

                }
            );

    }


    orderData.product =
        PRODUCT.name;


    saveCustomerData();

}


/* =========================================================
   ORDER ID
========================================================= */

function generateOrderId() {

    const now =
        new Date();


    const datePart =
        now.getFullYear().toString() +

        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        ) +

        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    const randomPart =
        Math.floor(
            1000 +
            Math.random() *
            9000
        );


    return `ORD-${datePart}-${randomPart}`;

}


/* =========================================================
   PAYMENT SCREEN
========================================================= */

function updatePaymentScreen() {

    setText(
        "paymentTotal",
        formatCurrency(
            orderData.total
        )
    );


    setText(
        "paymentOrderId",
        `Order ID: ${orderData.orderId}`
    );


    setText(
        "paymentOrderIdDuplicate",
        orderData.orderId
    );


    setText(
        "paymentDate",
        orderData.date
    );


    setText(
        "paymentTime",
        orderData.time
    );


    setText(
        "paymentAmount",
        formatCurrency(
            orderData.total
        )
    );


    if ($("scannerImage")) {

        $("scannerImage").src =
            PRODUCT.scanner;

    }


    if ($("downloadScanner")) {

        $("downloadScanner").href =
            PRODUCT.scanner;

    }

}


/* =========================================================
   FINAL SUMMARY
========================================================= */

function updateFinalSummary() {

    /*
       IMPORTANT:

       Recalculate pricing one final time from the
       current quantity before displaying Step 4.

       This prevents Step 4 from using old/stale values.
    */

    const quantity =
        getValidQuantity();


    const calculated =
        calculatePrice(
            quantity
        );


    orderData = {

        ...orderData,

        ...calculated,

        product:
            PRODUCT.name

    };


    const customer =
        orderData.customer;


    /* =====================================================
       ORDER INFORMATION
    ===================================================== */

    setText(
        "finalOrderId",
        orderData.orderId
    );


    setText(
        "finalDate",
        orderData.date
    );


    setText(
        "finalTime",
        orderData.time
    );


    /* =====================================================
       CUSTOMER INFORMATION
    ===================================================== */

    setText(
        "finalName",
        customer.name
    );


    setText(
        "finalPhone",
        customer.phone
    );


    setText(
        "finalPlace",
        customer.place
    );


    setText(
        "finalAddress",
        customer.address
    );


    setText(
        "finalPlaceUrl",
        customer.placeUrl ||
        "Not provided"
    );


    setText(
        "finalRequestedDate",
        formatDisplayDate(
            customer.requestedDate
        )
    );


    setText(
        "finalRequestedTime",
        formatDisplayTime(
            customer.requestedTime
        )
    );


    /* =====================================================
       PRODUCT INFORMATION
    ===================================================== */

    setText(
        "finalProduct",
        PRODUCT.name
    );


    /*
       Quantity

       Example:
       50 Kg
    */

    setText(
        "finalQuantity",
        `${orderData.quantity} Kg`
    );


    /*
       Regular Price Per Kg

       Example:
       ₹100
    */

    setText(
        "finalRegularPricePerKg",
        formatCurrency(
            orderData.regularPricePerUnit
        )
    );


    /*
       Your / Discounted Price Per Kg

       Example:
       ₹70
    */

    setText(
        "finalPricePerKg",
        formatCurrency(
            orderData.pricePerUnit
        )
    );


    /*
       Saving Per Kg

       Example:
       ₹30
    */

    setText(
        "finalSavingPerKg",
        formatCurrency(
            orderData.discountPerUnit
        )
    );


    /* =====================================================
       IMPORTANT STEP 4 TOTAL VALUES
    ===================================================== */

    /*
       REGULAR PRODUCT COST

       Quantity × Regular Price

       50 × ₹100
       = ₹5,000

       This is NOT ₹100.
    */

    setText(
        "finalRegularProductCost",
        formatCurrency(
            orderData.regularProductCost
        )
    );


    /*
       DISCOUNTED PRODUCT COST

       Regular Product Cost - Total Saving

       ₹5,000 - ₹1,500
       = ₹3,500

       This is NOT ₹70.
    */

    setText(
        "finalDiscountedProductCost",
        formatCurrency(
            orderData.productCost
        )
    );


    /*
       TOTAL SAVING

       Quantity × Saving Per Kg

       50 × ₹30
       = ₹1,500

       This is NOT ₹30.
    */

    setText(
        "finalTotalSaving",
        formatCurrency(
            orderData.discount
        )
    );


    /*
       Also update alternate IDs if the HTML uses them.
       These do not interfere with anything if they don't exist.
    */

    setText(
        "finalSavings",
        formatCurrency(
            orderData.discount
        )
    );


    setText(
        "finalSaving",
        formatCurrency(
            orderData.discount
        )
    );


    setText(
        "finalDiscountAmount",
        formatCurrency(
            orderData.discount
        )
    );


    /* =====================================================
       FINAL PAYMENT BREAKDOWN
    ===================================================== */

    /*
       Final Product Cost

       This is the DISCOUNTED product cost.

       Example:
       ₹3,500
    */

    setText(
        "finalProductCost",
        formatCurrency(
            orderData.productCost
        )
    );


    /*
       Delivery

       Example:
       50 Kg → ₹0
       10 Kg → ₹100
       1 Kg  → ₹200

       This comes directly from the same
       calculation used in Step 1.
    */

    setText(
        "finalDelivery",
        formatCurrency(
            orderData.delivery
        )
    );


    /*
       Platform Fee

       Example:
       ₹0
    */

    setText(
        "finalPlatformFee",
        formatCurrency(
            orderData.platformFee
        )
    );


    /*
       Discount display

       IMPORTANT:

       This is DISPLAY ONLY.

       It must NOT be subtracted from finalTotal
       because orderData.productCost is already discounted.
    */

    setText(
        "finalDiscount",
        "- " +
        formatCurrency(
            orderData.discount
        )
    );


    /*
       FINAL TOTAL

       Formula:

       Discounted Product Cost
       + Delivery
       + Platform Fee

       Example:

       ₹3,500
       + ₹200
       + ₹0
       = ₹3,700
    */

    setText(
        "finalTotal",
        formatCurrency(
            orderData.total
        )
    );


    /* =====================================================
       PAYMENT STATUS
    ===================================================== */

    setText(
        "finalPaymentStatus",
        "Payment in verification"
    );


    setText(
        "finalPaymentStatusBottom",
        "Payment in verification"
    );

}


/* =========================================================
   SHARING
========================================================= */

function setupSharing() {

    $("downloadPdfButton")?.addEventListener(
        "click",
        downloadOrderPDF
    );


    $("shareButton")?.addEventListener(
        "click",
        shareOrderPDF
    );


    $("submitButton")?.addEventListener(
        "click",
        submit
    );


    $("whatsappButton")?.addEventListener(
        "click",
        shareOnWhatsApp
    );

}


/* =========================================================
   LOAD jsPDF
========================================================= */

function loadJsPDF() {

    return new Promise(
        (resolve, reject) => {

            if (
                window.jspdf &&
                window.jspdf.jsPDF
            ) {

                resolve(
                    window.jspdf.jsPDF
                );

                return;

            }


            const existing =
                document.querySelector(
                    'script[data-jspdf="true"]'
                );


            if (existing) {

                existing.addEventListener(
                    "load",
                    () => {

                        if (
                            window.jspdf &&
                            window.jspdf.jsPDF
                        ) {

                            resolve(
                                window.jspdf.jsPDF
                            );

                        }

                        else {

                            reject(
                                new Error(
                                    "jsPDF could not be loaded."
                                )
                            );

                        }

                    }
                );


                existing.addEventListener(
                    "error",
                    () => {

                        reject(
                            new Error(
                                "Unable to load jsPDF."
                            )
                        );

                    }
                );


                return;

            }


            const script =
                document.createElement(
                    "script"
                );


            script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";


            script.async = true;


            script.dataset.jspdf =
                "true";


            script.onload =
                () => {

                    if (
                        window.jspdf &&
                        window.jspdf.jsPDF
                    ) {

                        resolve(
                            window.jspdf.jsPDF
                        );

                    }

                    else {

                        reject(
                            new Error(
                                "jsPDF loaded but is unavailable."
                            )
                        );

                    }

                };


            script.onerror =
                () => {

                    reject(
                        new Error(
                            "Unable to load jsPDF."
                        )
                    );

                };


            document.head.appendChild(
                script
            );

        }
    );

}


/* =========================================================
   CREATE PDF
========================================================= */

async function createOrderPDF() {

    updatePrice();

    createOrderDetails();

    updateFinalSummary();


    const JsPDF =
        await loadJsPDF();


    const doc =
        new JsPDF({

            orientation: "portrait",

            unit: "mm",

            format: "a4"

        });


    const pageWidth =
        doc.internal.pageSize.getWidth();


    const pageHeight =
        doc.internal.pageSize.getHeight();


    const margin = 16;


    let y = 18;


    /* =====================================================
       HEADER
    ===================================================== */

    doc.setFillColor(
        242,
        246,
        252
    );


    doc.roundedRect(
        margin,
        y,
        pageWidth - margin * 2,
        30,
        4,
        4,
        "F"
    );


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.setFontSize(20);


    doc.setTextColor(
        23,
        32,
        51
    );


    doc.text(
        "ARUN DRY ICE",
        pageWidth / 2,
        y + 10,
        {
            align: "center"
        }
    );


    doc.setFontSize(11);


    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.text(
        "ORDER SUMMARY",
        pageWidth / 2,
        y + 17,
        {
            align: "center"
        }
    );


    doc.setFontSize(9);


    doc.setTextColor(
        102,
        112,
        133
    );


    doc.text(
        `Order ID: ${orderData.orderId}`,
        margin + 7,
        y + 19
    );


    doc.text(
        `${orderData.date} • ${orderData.time}`,
        margin + 7,
        y + 25
    );


    y += 38;


    /* =====================================================
       SECTION HELPER
    ===================================================== */

    function sectionTitle(title) {

        if (
            y > pageHeight - 35
        ) {

            doc.addPage();

            y = 18;

        }


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(11);


        doc.setTextColor(
            23,
            32,
            51
        );


        doc.text(
            title.toUpperCase(),
            margin,
            y
        );


        y += 6;

    }


    /* =====================================================
       ROW HELPER
    ===================================================== */

    function addRow(
        label,
        value
    ) {

        const labelWidth = 43;


        const valueWidth =
            pageWidth -
            margin * 2 -
            labelWidth -
            4;


        const text =
            String(
                value ??
                ""
            );


        const lines =
            doc.splitTextToSize(
                text,
                valueWidth
            );


        const rowHeight =
            Math.max(
                6,
                lines.length * 4.5
            );


        if (
            y + rowHeight >
            pageHeight - 18
        ) {

            doc.addPage();

            y = 18;

        }


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(9);


        doc.setTextColor(
            102,
            112,
            133
        );


        doc.text(
            label,
            margin,
            y
        );


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setTextColor(
            23,
            32,
            51
        );


        doc.text(
            lines,
            margin + labelWidth,
            y
        );


        y +=
            rowHeight + 1;

    }


    /* =====================================================
       CUSTOMER
    ===================================================== */

    sectionTitle(
        "Customer Information"
    );


    const customer =
        orderData.customer;


    addRow(
        "Customer",
        customer.name
    );


    addRow(
        "Phone",
        customer.phone
    );


    addRow(
        "Place",
        customer.place
    );


    addRow(
        "Address",
        customer.address
    );


    addRow(
        "Address URL",
        customer.placeUrl ||
        "Not provided"
    );


    addRow(
        "Required Date",
        formatDisplayDate(
            customer.requestedDate
        )
    );


    addRow(
        "Required Time",
        formatDisplayTime(
            customer.requestedTime
        )
    );


    y += 5;


    /* =====================================================
       PRODUCT
    ===================================================== */

    sectionTitle(
        "Product Information"
    );


    addRow(
        "Product",
        PRODUCT.name
    );


    addRow(
        "Quantity",
        `${orderData.quantity} Kg`
    );


    addRow(
        "Regular Price / Kg",
        formatPDFCurrency(
            orderData.regularPricePerUnit
        )
    );


    addRow(
        "Saving / Kg",
        formatPDFCurrency(
            orderData.discountPerUnit
        )
    );


    addRow(
        "Price / Kg",
        formatPDFCurrency(
            orderData.pricePerUnit
        )
    );


    y += 5;


    /* =====================================================
       PAYMENT
    ===================================================== */

    sectionTitle(
        "Payment Details"
    );


    /* -----------------------------------------------------
       REGULAR COST
    ----------------------------------------------------- */

    addRow(
        "Regular Product Cost",
        formatPDFCurrency(
            orderData.regularProductCost
        )
    );


    /* -----------------------------------------------------
       TOTAL DISCOUNT
    ----------------------------------------------------- */

    addRow(
        "Total Saving",
        `- ${formatPDFCurrency(
            orderData.discount
        )}`
    );


    /* -----------------------------------------------------
       DISCOUNTED COST
    ----------------------------------------------------- */

    addRow(
        "Discounted Product Cost",
        formatPDFCurrency(
            orderData.productCost
        )
    );


    addRow(
        "Delivery",
        formatPDFCurrency(
            orderData.delivery
        )
    );


    addRow(
        "Platform Fee",
        formatPDFCurrency(
            orderData.platformFee
        )
    );


    addRow(
        "Payment Status",
        "Payment in verification"
    );


    y += 7;


    /* =====================================================
       TOTAL BOX
    ===================================================== */

    if (
        y > pageHeight - 35
    ) {

        doc.addPage();

        y = 18;

    }


    doc.setFillColor(
        245,
        247,
        251
    );


    doc.roundedRect(
        margin,
        y,
        pageWidth - margin * 2,
        20,
        4,
        4,
        "F"
    );


    doc.setFont(
        "helvetica",
        "bold"
    );


    doc.setFontSize(11);


    doc.setTextColor(
        23,
        32,
        51
    );


    doc.text(
        "TOTAL",
        margin + 7,
        y + 12
    );


    doc.setFontSize(18);


    doc.text(
        formatPDFCurrency(
            orderData.total
        ),
        pageWidth - margin - 7,
        y + 12,
        {
            align: "right"
        }
    );


    y += 29;


    /* =====================================================
       FOOTER
    ===================================================== */

    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.setFontSize(8);


    doc.setTextColor(
        152,
        162,
        179
    );


    doc.text(
        "Please share this order information along with your payment screenshot.",
        pageWidth / 2,
        pageHeight - 12,
        {
            align: "center"
        }
    );


    /* =====================================================
       PAGE NUMBERS
    ===================================================== */

    const totalPages =
        doc.getNumberOfPages();


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        doc.setPage(
            page
        );


        doc.setFontSize(7);


        doc.setTextColor(
            152,
            162,
            179
        );


        doc.text(
            `Page ${page} of ${totalPages}`,
            pageWidth - margin,
            pageHeight - 6,
            {
                align: "right"
            }
        );

    }


    return doc;

}


/* =========================================================
   PDF CURRENCY
========================================================= */

function formatPDFCurrency(
    amount
) {

    const number =
        Number(amount) || 0;


    return `INR ${number.toLocaleString(
        "en-IN"
    )}`;

}


/* =========================================================
   DOWNLOAD PDF
========================================================= */

async function downloadOrderPDF() {

    try {

        showAlert(
            "Creating PDF..."
        );


        const doc =
            await createOrderPDF();


        const fileName =
            `${orderData.orderId}-Order-Summary.pdf`;


        doc.save(
            fileName
        );

    }

    catch (error) {

        console.error(
            "PDF creation failed:",
            error
        );


        showAlert(
            "Unable to create PDF. Please check your internet connection and try again."
        );

    }

}


/* =========================================================
   SHARE PDF
========================================================= */

async function shareOrderPDF() {

    try {

        const doc =
            await createOrderPDF();


        const pdfBlob =
            doc.output(
                "blob"
            );


        const fileName =
            `${orderData.orderId}-Order-Summary.pdf`;


        const pdfFile =
            new File(
                [pdfBlob],
                fileName,
                {
                    type:
                        "application/pdf"
                }
            );


        if (
            navigator.share &&
            navigator.canShare
        ) {

            const canShareFiles =
                navigator.canShare({
                    files: [pdfFile]
                });


            if (canShareFiles) {

                try {

                    await navigator.share({

                        title:
                            `Order ${orderData.orderId}`,

                        text:
                            `Order Summary - ${orderData.orderId}`,

                        files: [pdfFile]

                    });


                    showAlert(
                        "PDF shared successfully."
                    );


                    return;

                }

                catch (error) {

                    if (
                        error.name ===
                        "AbortError"
                    ) {

                        console.log(
                            "PDF sharing cancelled."
                        );

                        return;

                    }

                }

            }

        }


        doc.save(
            fileName
        );


        showAlert(
            "This browser does not support PDF file sharing. The PDF has been downloaded instead."
        );

    }

    catch (error) {

        console.error(
            "PDF sharing failed:",
            error
        );


        showAlert(
            "Unable to create or share the PDF."
        );

    }

}


/* =========================================================
   SUBMIT ORDER
========================================================= */

async function submit() {

    try {

        if (
            !validateCustomerForm()
        ) {

            return;

        }


        /* =================================================
           RECALCULATE EVERYTHING BEFORE SUBMIT
        ================================================= */

        const quantity =
            getValidQuantity();


        const calculated =
            calculatePrice(
                quantity
            );


        orderData = {

            ...orderData,

            ...calculated,

            product:
                PRODUCT.name

        };


        updatePriceDisplay();


        saveCustomerData();


        createOrderDetails();


        updateFinalSummary();


        saveOrderToLocalStorage();


        const adminNumber =
            CONFIG.adminWhatsApp;


        if (adminNumber) {

            const whatsappMessage =
                createWhatsAppMessage();


            const whatsappUrl =
                `https://wa.me/${adminNumber}?text=${encodeURIComponent(
                    whatsappMessage
                )}`;


            window.open(
                whatsappUrl,
                "_blank",
                "noopener,noreferrer"
            );

        }


        markOrderCompleted();


        showAlert(
            "Order submitted successfully. WhatsApp is opening."
        );

    }

    catch (error) {

        console.error(
            "Order submission failed:",
            error
        );


        showAlert(
            "Unable to submit the order. Please try again."
        );

    }

}


/* =========================================================
   SAVE ORDER
========================================================= */

function saveOrderToLocalStorage() {

    try {

        const savedOrders =
            JSON.parse(
                localStorage.getItem(
                    "arunDryIceOrders"
                )
            ) || [];


        const orderToSave = {

            ...orderData,

            savedAt:
                new Date().toISOString()

        };


        savedOrders.push(
            orderToSave
        );


        localStorage.setItem(
            "arunDryIceOrders",
            JSON.stringify(
                savedOrders
            )
        );


        console.log(
            "Order saved successfully:",
            orderToSave
        );

    }

    catch (error) {

        console.error(
            "Unable to save order:",
            error
        );

    }

}


/* =========================================================
   WHATSAPP SHARE
========================================================= */

function shareOnWhatsApp() {

    createOrderDetails();

    updateFinalSummary();


    const input =
        $("whatsappUrl");


    let target =
        input?.value.trim() || "";


    let whatsappUrl;


    if (
        target.startsWith(
            "http://"
        ) ||
        target.startsWith(
            "https://"
        )
    ) {

        whatsappUrl =
            target;


        const separator =
            target.includes("?")
                ? "&"
                : "?";


        whatsappUrl +=
            `${separator}text=${encodeURIComponent(
                createWhatsAppMessage()
            )}`;

    }

    else {

        const phone =
            target.replace(
                /\D/g,
                ""
            );


        if (!phone) {

            showAlert(
                "Please enter a WhatsApp number or WhatsApp link."
            );

            input?.focus();

            return;

        }


        whatsappUrl =
            `https://wa.me/${phone}` +
            `?text=${encodeURIComponent(
                createWhatsAppMessage()
            )}`;

    }


    window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   WHATSAPP MESSAGE
========================================================= */

function createWhatsAppMessage() {

    const customer =
        orderData.customer;


    return `❄️ *ARUN DRY ICE — NEW ORDER*

━━━━━━━━━━━━━━━━━━━━
📋 *ORDER INFORMATION*
━━━━━━━━━━━━━━━━━━━━

*Order ID:* ${orderData.orderId}
*Order Created:* ${orderData.date}, ${orderData.time}

━━━━━━━━━━━━━━━━━━━━
👤 *CUSTOMER DETAILS*
━━━━━━━━━━━━━━━━━━━━

*Name:* ${customer.name}
*Phone:* ${customer.phone}
*Place:* ${customer.place}
*Address:* ${customer.address}
*Address URL:* ${customer.placeUrl || "Not provided"}

━━━━━━━━━━━━━━━━━━━━
📅 *DELIVERY REQUIREMENT*
━━━━━━━━━━━━━━━━━━━━

*Required Date:* ${formatDisplayDate(
        customer.requestedDate
    )}

*Required Time:* ${formatDisplayTime(
        customer.requestedTime
    )}

━━━━━━━━━━━━━━━━━━━━
📦 *PRODUCT DETAILS*
━━━━━━━━━━━━━━━━━━━━

*Product:* ${PRODUCT.name}
*Quantity:* ${orderData.quantity} Kg

*Regular Price:* ${formatCurrency(
        orderData.regularPricePerUnit
    )} / Kg

*Discount:* ${orderData.discountPercent}% OFF

*Saving:* ${formatCurrency(
        orderData.discountPerUnit
    )} / Kg

*Final Price:* ${formatCurrency(
        orderData.pricePerUnit
    )} / Kg

━━━━━━━━━━━━━━━━━━━━
💰 *PRICE BREAKDOWN*
━━━━━━━━━━━━━━━━━━━━

*Regular Product Cost:* ${formatCurrency(
        orderData.regularProductCost
    )}

*Discount:* - ${formatCurrency(
        orderData.discount
    )}

*Discounted Product Cost:* ${formatCurrency(
        orderData.productCost
    )}

*Delivery:* ${formatCurrency(
        orderData.delivery
    )}

*Platform Fee:* ${formatCurrency(
        orderData.platformFee
    )}

━━━━━━━━━━━━━━━━━━━━
💳 *TOTAL AMOUNT: ${formatCurrency(
        orderData.total
    )}*
━━━━━━━━━━━━━━━━━━━━

*Payment Status:* Payment in verification

━━━━━━━━━━━━━━━━━━━━
⚠️ *PAYMENT VERIFICATION*
━━━━━━━━━━━━━━━━━━━━

Please share the payment screenshot for verification.

Thank you for choosing *ARUN DRY ICE*. `;
}


/* =========================================================
   NORMAL SHARE TEXT
========================================================= */

function createOrderText() {

    const customer =
        orderData.customer;


    return `ORDER SUMMARY

Order ID:
${orderData.orderId}

Customer:
${customer.name}

Phone:
${customer.phone}

Place:
${customer.place}

Address:
${customer.address}

Address URL:
${customer.placeUrl || "Not provided"}

Required Date:
${formatDisplayDate(
        customer.requestedDate
    )}

Required Time:
${formatDisplayTime(
        customer.requestedTime
    )}

Product:
${PRODUCT.name}

Quantity:
${orderData.quantity} Kg

Regular Price / Kg:
${formatCurrency(
        orderData.regularPricePerUnit
    )}

Saving / Kg:
${formatCurrency(
        orderData.discountPerUnit
    )}

Final Price / Kg:
${formatCurrency(
        orderData.pricePerUnit
    )}

Regular Product Cost:
${formatCurrency(
        orderData.regularProductCost
    )}

Total Saving:
- ${formatCurrency(
        orderData.discount
    )}

Discounted Product Cost:
${formatCurrency(
        orderData.productCost
    )}

Delivery:
${formatCurrency(
        orderData.delivery
    )}

Platform Fee:
${formatCurrency(
        orderData.platformFee
    )}

TOTAL:
${formatCurrency(
        orderData.total
    )}

Payment Status:
Payment in verification

Order Date:
${orderData.date}

Order Time:
${orderData.time}`;

}


/* =========================================================
   CLIPBOARD
========================================================= */

async function copyToClipboard(
    text
) {

    try {

        await navigator.clipboard.writeText(
            text
        );

    }

    catch (error) {

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            text;


        document.body.appendChild(
            textarea
        );


        textarea.select();


        document.execCommand(
            "copy"
        );


        textarea.remove();

    }

}


/* =========================================================
   RESET ORDER
========================================================= */

function resetOrder() {

    orderData =
        createEmptyOrder();


    const input =
        $("quantityInput");


    if (input) {

        input.value = 1;

    }


    loadSavedCustomer();

    updatePrice();

    showStep(1);

}


/* =========================================================
   DATE DISPLAY
========================================================= */

function formatDisplayDate(
    dateString
) {

    if (!dateString) {

        return "Not selected";

    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Not selected";

    }


    return date.toLocaleDateString(
        "en-IN",
        {

            day: "2-digit",

            month: "long",

            year: "numeric"

        }
    );

}


/* =========================================================
   TIME DISPLAY
========================================================= */

function formatDisplayTime(
    timeString
) {

    if (!timeString) {

        return "Not selected";

    }


    const parts =
        timeString.split(":");


    const hours =
        Number(parts[0]);


    const minutes =
        Number(parts[1]);


    if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes)
    ) {

        return "Not selected";

    }


    const date =
        new Date();


    date.setHours(
        hours,
        minutes,
        0,
        0
    );


    return date.toLocaleTimeString(
        "en-IN",
        {

            hour: "2-digit",

            minute: "2-digit",

            hour12: true

        }
    );

}


/* =========================================================
   ALERT
========================================================= */

function showAlert(
    message
) {

    alert(message);

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   MARK ORDER AS COMPLETED
========================================================= */

function markOrderCompleted() {

    const indicator =
        $("stepIndicator4");


    if (!indicator) return;


    indicator.classList.remove(
        "active"
    );


    indicator.classList.add(
        "completed"
    );


    for (
        let i = 1;
        i <= 3;
        i++
    ) {

        const previousIndicator =
            $(`stepIndicator${i}`);


        if (!previousIndicator) continue;


        previousIndicator.classList.remove(
            "active"
        );


        previousIndicator.classList.add(
            "completed"
        );

    }

}