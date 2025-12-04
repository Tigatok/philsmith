// Helper function to fill a field within the iframe
function fillField(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.value = value;
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    // A keydown/keyup event can help trigger validation and formatting
    element.dispatchEvent(new Event("keydown", { bubbles: true }));
    element.dispatchEvent(new Event("keyup", { bubbles: true }));
  }
}

// Listen for messages from the parent page's content script
window.addEventListener("message", (event) => {
  // Basic security check: ensure the message is from a trusted origin if needed
  // For now, we just check the message type
  if (event.data.type === "FILL_PAYMENT_FORM") {
    const data = event.data.payload;

    // Use the selectors from the HTML you provided
    fillField("#number", data.number);
    fillField("#name", data.name);
    fillField("#expiry", data.expiry);
    fillField("#verification_value", data.cvv);
  }
});
