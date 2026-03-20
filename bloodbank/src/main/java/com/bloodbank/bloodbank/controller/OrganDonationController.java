package com.bloodbank.bloodbank.controller;

import com.bloodbank.bloodbank.entity.OrganDonation;
import com.bloodbank.bloodbank.entity.OrganType;
import com.bloodbank.bloodbank.entity.User;
import com.bloodbank.bloodbank.service.OrganDonationService;
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
@RequestMapping("/api/organ")
public class OrganDonationController {

    private OrganDonationService organDonationService;
    private UserService userService;

    public OrganDonationController(OrganDonationService organDonationService,
                                   UserService userService) {
        this.organDonationService = organDonationService;
        this.userService = userService;
    }

    // POST → /api/organ/register/{donorId}
    // Donor organ register karega
    @PostMapping("/register/{donorId}")
    public ResponseEntity<Map<String, String>> registerDonation(
            @PathVariable Long donorId,
            @RequestBody OrganDonation organDonation) {

        Map<String, String> response = new HashMap<>();

        // Donor dhundo
        Optional<User> donor = userService.findById(donorId);

        if (donor.isEmpty()) {
            response.put("message", "Donor not found!");
            return ResponseEntity.badRequest().body(response);
        }

        // Donation mein donor set karo
        organDonation.setDonor(donor.get());

        // Register karo
        organDonationService.registerDonation(organDonation);

        response.put("message", "Organ donation registered successfully!");
        return ResponseEntity.ok(response);
    }

    // GET → /api/organ/all
    // Saare donations dekho
    @GetMapping("/all")
    public ResponseEntity<List<OrganDonation>> getAllDonations() {
        return ResponseEntity.ok(organDonationService.getAllDonations());
    }

    // GET → /api/organ/type/KIDNEY
    // Organ type se donors dhundo
    @GetMapping("/type/{organType}")
    public ResponseEntity<List<OrganDonation>> getByOrganType(
            @PathVariable OrganType organType) {
        return ResponseEntity.ok(
                organDonationService.findByOrganType(organType));
    }

    // GET → /api/organ/match/{bloodGroup}/{organType}
    // Matching donors dhundo
    // Hospital use karega
    @GetMapping("/match/{bloodGroup}/{organType}")
    public ResponseEntity<List<OrganDonation>> findMatches(
            @PathVariable String bloodGroup,
            @PathVariable OrganType organType) {
        return ResponseEntity.ok(
                organDonationService.findMatchingDonors(bloodGroup, organType));
    }

    // POST → /api/organ/matched/{donationId}
    // Donation status MATCHED karo
    @PostMapping("/matched/{donationId}")
    public ResponseEntity<Map<String, String>> markAsMatched(
            @PathVariable Long donationId) {

        Map<String, String> response = new HashMap<>();
        String result = organDonationService.markAsMatched(donationId);
        response.put("message", result);
        return ResponseEntity.ok(response);
    }

    // GET → /api/organ/donor/{donorId}
    // Donor ke saare registered organs dekho
    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<OrganDonation>> getDonorOrgans(
            @PathVariable Long donorId) {
        return ResponseEntity.ok(
                organDonationService.findByDonorId(donorId));
    }
}
