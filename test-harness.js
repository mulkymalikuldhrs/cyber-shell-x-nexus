import express from "express";
import { registerRoutes } from "./server/routes.js";
import { CyberShellAI } from "./server/cybershell-ai.js";

async function runTest() {
    console.log("Starting test harness...");

    // 1. Inisialisasi AI
    const ai = new CyberShellAI();
    console.log("AI Initialized.");

    // 2. Mockup server Express
    const app = express();
    app.use(express.json());
    await registerRoutes(app);
    console.log("Routes registered.");

    // 3. Uji fungsi inti AI secara langsung
    console.log("\n--- Testing AI command processing ---");
    const nmapResponse = ai.processCommand("nmap -sV localhost");
    console.log("Nmap command processed. Response category:", nmapResponse.category);
    if (nmapResponse.content.includes("Network Scanning with Nmap")) {
        console.log("✓ Test passed: Nmap explanation is correct.");
    } else {
        console.error("✗ Test failed: Nmap explanation is incorrect.");
    }

    // 4. Uji otomatisasi AI
    console.log("\n--- Testing AI automation planning ---");
    try {
        const automationPlan = await ai.runAutomation("example.com", ["scan for web vulnerabilities"]);
        console.log("Automation plan generated:", automationPlan.plan);
        if (automationPlan.plan && automationPlan.plan.length > 0) {
            console.log("✓ Test passed: Automation plan generated successfully.");
        } else {
            console.error("✗ Test failed: Automation plan generation failed.");
        }
    } catch (e) {
        console.error("✗ Test failed: Automation planning threw an error:", e.message);
    }

    console.log("\nTest harness finished.");
}

runTest();
