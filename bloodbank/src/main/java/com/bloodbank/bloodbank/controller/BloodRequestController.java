package com.bloodbank.bloodbank.controller;

import com.bloodbank.bloodbank.entity.BloodRequest;
import com.bloodbank.bloodbank.entity.RequestStatus;
import com.bloodbank.bloodbank.entity.User;
import com.bloodbank.bloodbank.service.BloodRequestService;
import com.bloodbank.bloodbank.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/request")
public class BloodRequestController {

    private BloodRequestService bloodRequestService;
    private UserService userService;

    public BloodRequestController(BloodRequestService bloodRequestService,
                                  UserService userService) {
        this.bloodRequestService = bloodRequestService;
        this.userService = userService;
    }

    // POST → /api/request/create/{hospitalId}
    // Hospital blood request karega
    @PostMapping("/create/{hospitalId}")
    public ResponseEntity<Map<String, String>> createRequest(
            @PathVariable Long hospitalId,
            @RequestBody BloodRequest bloodRequest) {

        Map<String, String> response = new HashMap<>();

        // Hospital user dhundo
        Optional<User> hospital = userService.findById(hospitalId);

        if (hospital.isEmpty()) {
            response.put("message", "Hospital not found!");
            return ResponseEntity.badRequest().body(response);
        }

        // Request mein hospital set karo
        bloodRequest.setHospital(hospital.get());

        // Request save karo
        bloodRequestService.createRequest(bloodRequest);

        response.put("message", "Blood request created successfully!");
        return ResponseEntity.ok(response);
    }

    // GET → /api/request/all
    // Saari requests dekho
    @GetMapping("/all")
    public ResponseEntity<List<BloodRequest>> getAllRequests() {
        return ResponseEntity.ok(bloodRequestService.getAllRequests());
    }

    // GET → /api/request/pending
    // Sirf pending requests dekho
    @GetMapping("/pending")
    public ResponseEntity<List<BloodRequest>> getPendingRequests() {
        return ResponseEntity.ok(
                bloodRequestService.getRequestsByStatus(RequestStatus.PENDING));
    }

    // GET → /api/request/hospital/{hospitalId}
    // Ek hospital ki saari requests
    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<BloodRequest>> getHospitalRequests(
            @PathVariable Long hospitalId) {
        return ResponseEntity.ok(
                bloodRequestService.getRequestsByHospital(hospitalId));
    }

    // POST → /api/request/approve/{requestId}
    // Admin request approve karega
    @PostMapping("/approve/{requestId}")
    public ResponseEntity<Map<String, String>> approveRequest(
            @PathVariable Long requestId) {

        Map<String, String> response = new HashMap<>();
        String result = bloodRequestService.approveRequest(requestId);
        response.put("message", result);
        return ResponseEntity.ok(response);
    }

    // POST → /api/request/reject/{requestId}
    // Admin request reject karega
    @PostMapping("/reject/{requestId}")
    public ResponseEntity<Map<String, String>> rejectRequest(
            @PathVariable Long requestId) {

        Map<String, String> response = new HashMap<>();
        String result = bloodRequestService.rejectRequest(requestId);
        response.put("message", result);
        return ResponseEntity.ok(response);
    }
}