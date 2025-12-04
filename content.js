// --- Data Pools ---
const FIRST_NAMES = ["Alex", "Jordan", "Taylor", "Casey", "Morgan", "Riley"];
const LAST_NAMES = ["Smith", "Jones", "Williams", "Brown", "Davis", "Miller"];
const STREET_NAMES = [
  "Maple",
  "Oak",
  "Pine",
  "Elm",
  "Cedar",
  "Washington",
];
const STREET_TYPES = ["St", "Ave", "Blvd", "Ln", "Dr"];
const CITIES = ["Springfield", "Fairview", "Riverside", "Madison", "Franklin"];
// NEW: State to Zip Code mapping
const STATE_ZIPS = {
  CA: "90210", // California
  NY: "10001", // New York
  TX: "78701", // Texas
  FL: "33109", // Florida
  IL: "60601", // Illinois
  PA: "19102", // Pennsylvania
  CT: "06484", // Connecticut
};

// Derive the list of states from the keys of our new map
const STATES = Object.keys(STATE_ZIPS);

// --- Helper Functions ---
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fillField(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.value = value;
    // Dispatch events to ensure frameworks like React update their state
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

// --- Main Function to Perform Filling ---
function doFill() {
  const firstName = getRandomItem(FIRST_NAMES);
  const lastName = getRandomItem(LAST_NAMES);
  const randomNum = Math.floor(Math.random() * 999);
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@example.com`;
  const address = `${Math.floor(
    Math.random() * 1500 + 100
  )} ${getRandomItem(STREET_NAMES)} ${getRandomItem(STREET_TYPES)}`;
  const city = getRandomItem(CITIES);
  const state = getRandomItem(STATES);
  const zip = STATE_ZIPS[state]

  console.log("FILLING FORM:", { firstName, lastName, email, address });

  // --- Field Selectors for Shopify Checkout ---
  // Shipping Information
  fillField("#email", email);
  fillField("#TextField0", firstName);
  fillField("#TextField1", lastName);
  fillField("#shipping-address1", address);
  fillField("#TextField3", city);
  fillField("#TextField4", zip);

  // You might need to select the state from a dropdown.
  // This example just sets the value, which may not work for all dropdowns.
  const stateEl = document.querySelector("#Select1");
  if (stateEl) {
    stateEl.value = state;
    stateEl.dispatchEvent(new Event("change", { bubbles: true }));
  }

  // --- NEW: Fill Payment Information via postMessage ---
  const paymentData = {
    number: "1",
    name: `${firstName} ${lastName}`,
    expiry: "12 / 34", // Note: Spacing might matter for formatting
    cvv: "123",
  };

  // Find all payment iframes and post the data to them
  const paymentIframes = document.querySelectorAll(".card-fields-iframe");
  paymentIframes.forEach((iframe) => {
    // The targetOrigin should match the iframe's src for security
    iframe.contentWindow.postMessage(
      { type: "FILL_PAYMENT_FORM", payload: paymentData },
      "https://checkout.pci.shopifyinc.com"
    );
  });
}

// Listen for the message from popup.js
window.addEventListener("message", (event) => {
  if (event.source === window && event.data.type === "FILL_CHECKOUT_FORM") {
    doFill();
  }
});
