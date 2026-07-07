package com.backend.aiverifysnap.controller;

import com.backend.aiverifysnap.service.UserService;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class StripeWebhookController {

    private final UserService userService;

    @Value("${stripe.webhook-secret}")
    private String endpointSecret;

    public StripeWebhookController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        
        Event event;
        try {
            // Verify webhook signature for production grade security
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        // checkout.session.completed event indicates payment completion
        if ("checkout.session.completed".equals(event.getType())) {
            EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();
            if (deserializer.getObject().isPresent()) {
                Session session = (Session) deserializer.getObject().get();
                
                String userIdStr = session.getMetadata().get("userId");
                if (userIdStr != null) {
                    try {
                        userService.upgradeUserToPro(userIdStr);
                        System.out.println("Stripe Webhook: User " + userIdStr + " successfully upgraded to PRO!");
                    } catch (Exception e) {
                        System.err.println("Failed to upgrade user: " + e.getMessage());
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Database update failed");
                    }
                }
            }
        }

        return ResponseEntity.ok("Success");
    }
}
