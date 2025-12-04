# PhilSmith

A simple, lightweight Chrome extension designed for e-commerce developers to rapidly fill Shopify checkout forms with random, plausible test data.

## Features

-   **One-Click Fill:** Fills all customer and shipping information with a single button click.
-   **Bogus Payment:** Automatically enters Shopify's Bogus Gateway card details.
-   **Iframe Support:** Correctly handles payment fields that are rendered inside secure `<iframe>` elements.
-   **Valid Data:** Ensures that the generated state and zip code are a valid pair.
-   **Zero Dependencies:** Runs entirely with vanilla JavaScript. - So far....

## Installation

The extension is loaded locally in developer mode.

1.  Download or clone this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Enable **Developer mode** using the toggle in the top-right corner.
4.  Click the **Load unpacked** button.
5.  Select the `PhilSmith` project folder.

The PhilSmith icon will now appear in your browser's extension toolbar.

## Usage

1.  Navigate to a Shopify checkout page.
2.  Click the PhilSmith extension icon in the toolbar to open the popup.
3.  Click the **Fill Form** button. The checkout form will be instantly populated.

## How It Works

Shopify isolates its payment fields in a secure `<iframe>` loaded from a different origin (`checkout.pci.shopifyinc.com`). This prevents a standard content script from accessing and filling the payment inputs directly due to the browser's same-origin policy.

PhilSmith solves this using a two-script approach:

1.  **`content.js`**: This is the main script that runs on the top-level checkout page. It is responsible for:
    -   Generating all the random data (name, address, etc.).
    -   Filling the contact and shipping address fields.
    -   Finding the payment `<iframe>` elements on the page.
    -   Sending the payment data to the iframes using `window.postMessage()`.

2.  **`iframe_content.js`**: This lightweight script is injected directly into the Shopify payment iframes. Its sole purpose is to listen for the `postMessage` event from `content.js` and fill the credit card fields (`number`, `name`, `expiry`, `verification_value`).

This architecture allows for secure, cross-origin communication to automate the entire form.

## Project Structure

```
/PhilSmith
├── manifest.json       # Extension config, permissions, and script declarations
├── popup.html          # The UI for the extension's popup window
├── popup.js            # Handles the "Fill Form" button click event
├── content.js          # Main script for the primary checkout page
├── iframe_content.js   # Script injected into the payment iframes
└── icons/              # Extension icons (16x16, 48x48, 128x128)
```

## Customization

All test data is stored in constant arrays and objects at the top of `content.js`. To modify the data pools (e.g., add new names, cities, or state/zip pairs), simply edit these data structures.

-   **`FIRST_NAMES`**, **`LAST_NAMES`**, etc: Add or remove strings.
-   **`STATE_ZIPS`**: Add new `STATE: "ZIP"` key-value pairs to expand the address generation.

After making changes, remember to reload the extension from the `chrome://extensions` page.

## Limitations

-   **Selector Fragility:** The extension relies on specific element IDs and classes in the Shopify checkout DOM. If Shopify engineers update their checkout page structure, these selectors may break and will need to be updated in `content.js`.
-   **Domain Specificity:** The manifest is hardcoded to run on Shopify-related domains. If Shopify changes its checkout or PCI domains, the `"matches"` array in `manifest.json` will require an update.
