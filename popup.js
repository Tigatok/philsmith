document.getElementById("fill-button").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: fillCheckoutForm,
    });
  });
});

// This function is injected into the content script's scope
function fillCheckoutForm() {
  // This will call the function already defined in content.js
  window.postMessage({ type: "FILL_CHECKOUT_FORM" }, "*");
}
