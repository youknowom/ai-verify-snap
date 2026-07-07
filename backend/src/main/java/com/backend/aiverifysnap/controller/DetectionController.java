package com.backend.aiverifysnap.controller;

import com.backend.aiverifysnap.model.DetectionHistory;
import com.backend.aiverifysnap.service.DetectionService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/detection")
@Tag(name = "Detection", description = "Deepfake detection API")
public class DetectionController {

    private static final Logger log = LoggerFactory.getLogger(DetectionController.class);

    private final DetectionService detectionService;

    public DetectionController(DetectionService detectionService) {
        this.detectionService = detectionService;
    }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> analyzeImage(
            @Parameter(description = "Image file to analyze") @RequestParam("file") MultipartFile file,
            @Parameter(description = "User ID (optional)") @RequestParam(value = "userId", required = false) Long userId) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }

        // Validate file content type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "File must be an image (JPEG, PNG, or WEBP)"));
        }

        Map<String, Object> result = detectionService.detectDeepfake(file);
        if (result.containsKey("error")) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(result);
        }
        String imagePath = file.getOriginalFilename();
        try {
            DetectionHistory saved = detectionService.saveDetection(result, imagePath, userId);
            result.put("scan_id", saved.getScanId());
        } catch (Exception e) {
            log.warn("Failed to persist detection history: {}", e.toString());
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getAllDetections(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        // Cap page size to prevent abuse
        int cappedSize = Math.min(size, 100);
        Pageable pageable = PageRequest.of(page, cappedSize);
        Page<DetectionHistory> detections = detectionService.getAllDetections(pageable);
        return ResponseEntity.ok(detections);
    }

    @GetMapping("/history/{scanId}")
    public ResponseEntity<DetectionHistory> getDetectionById(
            @Parameter(description = "Scan ID of the detection") @PathVariable Long scanId) {
        // EntityNotFoundException → 404 handled by GlobalExceptionHandler
        DetectionHistory detection = detectionService.getDetectionById(scanId);
        return ResponseEntity.ok(detection);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(detectionService.getStats());
    }
}
