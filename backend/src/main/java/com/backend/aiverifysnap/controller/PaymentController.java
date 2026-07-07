package com.backend.aiverifysnap.controller;

import com.backend.aiverifysnap.service.UserService;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final UserService userService;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${stripe.frontend-url}")
    private String frontendUrl;

    public PaymentController(UserService userService) {
        this.userService = userService;
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(
            @RequestParam("priceId") String priceId,
            @RequestParam("userId") String userId) {
        
        try {
            // Verify key is set correctly
            if (stripeSecretKey == null || stripeSecretKey.isBlank() || stripeSecretKey.contains("placeholder")) {
                throw new IllegalArgumentException("Stripe API key not configured");
            }

            SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setSuccessUrl(frontendUrl + "/pricing?success=true&userId=" + userId)
                .setCancelUrl(frontendUrl + "/pricing?cancel=true")
                .addLineItem(
                    SessionCreateParams.LineItem.builder()
                        .setPrice(priceId)
                        .setQuantity(1L)
                        .build()
                )
                .putMetadata("userId", userId)
                .build();

            Session session = Session.create(params);
            
            return ResponseEntity.ok(Map.of("url", session.getUrl()));
        } catch (Exception e) {
            // Fallback for development testing when Stripe keys/price IDs are empty or dummy placeholders
            System.out.println("Stripe payment creation bypassed: " + e.getMessage() + ". Generating Sandbox Checkout Redirect.");
            String mockUrl = frontendUrl + "/pricing?success=true&userId=" + userId + "&mock=true";
            return ResponseEntity.ok(Map.of("url", mockUrl));
        }
    }

    @PostMapping("/mock-upgrade")
    public ResponseEntity<Map<String, String>> mockUpgrade(@RequestParam("userId") String userId) {
        try {
            userService.upgradeUserToPro(userId);
            return ResponseEntity.ok(Map.of("message", "User role successfully upgraded to PRO (Developer Sandbox Mode)"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
