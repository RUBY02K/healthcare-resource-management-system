package com.bloodbank.bloodbank.controller;

import com.bloodbank.bloodbank.entity.BloodInventory;
import com.bloodbank.bloodbank.service.BloodInventoryService;
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

// Mistake 1 fix → @Controller ki jagah @RestController
// @Controller → sirf HTML pages return karta hai
// @RestController → JSON return karta hai (hamein yahi chahiye)
@RestController

// Mistake 2 fix → @RequestMapping class pe hona chahiye
// Constructor pe nahi!
@RequestMapping("/api/inventory")
public class BloodInventoryController {

    private BloodInventoryService bloodInventoryService;

    // Mistake 3 fix → Constructor clean hai ab
    // @RequestMapping yahan nahi hoga
    public BloodInventoryController(BloodInventoryService bloodInventoryService) {
        this.bloodInventoryService = bloodInventoryService;
    }

    // POST → /api/inventory/add
    // Admin blood units add kare
    @PostMapping("/add")
    public ResponseEntity<Map<String, String>> addBloodUnits(
            @RequestBody BloodInventory bloodInventory) {

        Map<String, String> response = new HashMap<>();
        bloodInventoryService.addBloodUnits(bloodInventory);
        response.put("message", "Blood units added successfully!");
        return ResponseEntity.ok(response);
    }

    // GET → /api/inventory/all
    // Saara inventory dekho
    @GetMapping("/all")
    public ResponseEntity<List<BloodInventory>> getAllInventory() {
        return ResponseEntity.ok(bloodInventoryService.getAllInventory());
    }

    // GET → /api/inventory/available/O+
    // Blood group ki valid units dekho
    @GetMapping("/available/{bloodGroup}")
    public ResponseEntity<List<BloodInventory>> getAvailableUnits(
            @PathVariable String bloodGroup) {
        return ResponseEntity.ok(
                bloodInventoryService.getValidUnitsByBloodGroup(bloodGroup));
    }

    // GET → /api/inventory/total/O+
    // Blood group ki total units count karo
    @GetMapping("/total/{bloodGroup}")
    public ResponseEntity<Map<String, Object>> getTotalUnits(
            @PathVariable String bloodGroup) {

        Map<String, Object> response = new HashMap<>();

        int total = bloodInventoryService.getTotalValidUnits(bloodGroup);
        boolean lowStock = bloodInventoryService.isLowStock(bloodGroup);

        response.put("bloodGroup", bloodGroup);
        response.put("totalUnits", total);
        response.put("lowStock", lowStock);

        // Low stock hai toh warning bhi bhejo
        if (lowStock) {
            response.put("warning", "Low stock! Please arrange more units!");
        }

        return ResponseEntity.ok(response);
    }

    // GET → /api/inventory/expired
    // Expire ho chuki units dekho
    @GetMapping("/expired")
    public ResponseEntity<List<BloodInventory>> getExpiredUnits() {
        return ResponseEntity.ok(bloodInventoryService.getExpiredUnits());
    }
}