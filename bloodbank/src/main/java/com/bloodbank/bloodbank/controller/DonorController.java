package com.bloodbank.bloodbank.controller;

import com.bloodbank.bloodbank.entity.DonorProfile;
import com.bloodbank.bloodbank.entity.User;
import com.bloodbank.bloodbank.service.DonorService;
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
@RequestMapping("/api/donor")
public class DonorController {

    private DonorService donorService;
    private UserService userService;

    public DonorController(DonorService donorService, UserService userService) {
        this.donorService = donorService;
        this.userService = userService;
    }

    // POST → /api/donor/profile/{userId}
    // Donor apni profile banaye
    @PostMapping("/profile/{userId}")
    public ResponseEntity<Map<String, String>> createProfile(
            @PathVariable Long userId,
            @RequestBody DonorProfile donorProfile) {

        Map<String, String> response = new HashMap<>();

        // Pehle check karo user exist karta hai?
        Optional<User> user = userService.findById(userId);

        if (user.isEmpty()) {
            response.put("message", "User not found!");
            return ResponseEntity.badRequest().body(response);
        }

        // Profile mein user set karo
        donorProfile.setUser(user.get());

        // Profile save karo
        donorService.saveProfile(donorProfile);

        response.put("message", "Donor profile created successfully!");
        return ResponseEntity.ok(response);
    }

    // GET → /api/donor/all
    // Saare donors dekho
    @GetMapping("/all")
    public ResponseEntity<List<DonorProfile>> getAllDonors() {
        return ResponseEntity.ok(donorService.getAllDonors());
    }

    // GET → /api/donor/bloodgroup/{bloodGroup}
    // Blood group se donors dhundo
    @GetMapping("/bloodgroup/{bloodGroup}")
    public ResponseEntity<List<DonorProfile>> getByBloodGroup(
            @PathVariable String bloodGroup) {
        return ResponseEntity.ok(donorService.findByBloodGroup(bloodGroup));
    }

    // GET → /api/donor/eligible/{userId}
    // Check karo donor eligible hai ya nahi
    @GetMapping("/eligible/{userId}")
    public ResponseEntity<Map<String, Object>> checkEligibility(
            @PathVariable Long userId) {

        Map<String, Object> response = new HashMap<>();

        // User ki profile dhundo
        Optional<DonorProfile> profile = donorService.findByUserId(userId);

        if (profile.isEmpty()) {
            response.put("message", "Donor profile not found!");
            return ResponseEntity.badRequest().body(response);
        }

        // Eligibility check karo
        boolean eligible = donorService.isEligible(profile.get());

        response.put("eligible", eligible);

        if (eligible) {
            response.put("message", "Donor is eligible to donate!");
        } else {
            response.put("message", "Donor is not eligible yet. 90 days not completed!");
        }

        return ResponseEntity.ok(response);
    }
}
