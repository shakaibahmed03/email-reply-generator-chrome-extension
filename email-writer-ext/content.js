console.log("Email Writer Extension Loaded");

// -----------------------------
// Create AI Button
// -----------------------------
function createAIButton() {
    const button = document.createElement("div");
    button.className = "T-I J-J5-Ji T-I-ax7 L3";  // safe Gmail button style
    button.style.marginRight = "8px";
    button.textContent = "AI Reply";

    button.setAttribute("role", "button");
    button.setAttribute("tabindex", "0");
    button.classList.add("ai-reply-button");

    return button;
}

// -----------------------------
// Find Gmail Compose Toolbar
// -----------------------------
function findComposeToolbar() {
    const selectors = [
        ".btC",              // Main compose footer
        ".aDh",              // Row with send button
        "[aria-label='Send (Ctrl-Enter)']", // In case Gmail changes class names
        "[role='toolbar']",
        ".gU.Up"
    ];

    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) return element;
    }

    return null;
}

// -----------------------------
// Extract Content User Typed
// -----------------------------
function getEmailContent() {
    // Gmail editable compose box
    const box = document.querySelector('[role="textbox"][g_editable="true"]');

    if (!box) {
        console.log("Compose box not found");
        return "";
    }

    return box.innerText.trim();
}

// -----------------------------
// Inject the AI Button
// -----------------------------
function injectButton() {
    // Remove old button to prevent duplicates
    const oldButton = document.querySelector(".ai-reply-button");
    if (oldButton) oldButton.remove();

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("Toolbar not found yet");
        return;
    }

    console.log("Toolbar found. Injecting AI Reply button…");

    const button = createAIButton();

    button.addEventListener("click", async () => {
        try {
            button.textContent = "Generating…";
            button.disabled = true;

            const emailContent = getEmailContent();

            const response = await fetch("http://localhost:8080/api/email/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emailcontent: emailContent,   // MATCHES Spring Boot
                    tone: "professional"
                })
            });

            if (!response.ok) throw new Error("API request failed");

            const generatedReply = await response.text();

            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

            if (composeBox) {
                composeBox.focus();
                document.execCommand("insertText", false, generatedReply);
            } else {
                console.error("Compose box missing");
            }
        } catch (error) {
            console.error(error);
            alert("AI Reply generation failed.");
        } finally {
            button.textContent = "AI Reply";
            button.disabled = false;
        }
    });

    // Insert button to the LEFT side
    toolbar.insertBefore(button, toolbar.firstChild);
}

// -----------------------------
// Detect Compose Windows
// -----------------------------
console.log("Setting up Gmail MutationObserver…");

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = [...mutation.addedNodes];

        const composeAppeared = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (
                node.matches?.(".aDh, .btC, [role='dialog']") ||
                node.querySelector?.(".aDh, .btC, [role='dialog']")
            )
        );

        if (composeAppeared) {
            console.log("Compose window detected!");
            setTimeout(injectButton, 400); // short delay for DOM to settle
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
