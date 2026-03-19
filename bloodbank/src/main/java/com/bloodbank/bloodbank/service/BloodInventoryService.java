package com.bloodbank.bloodbank.service;

import com.bloodbank.bloodbank.entity.BloodInventory;
import com.bloodbank.bloodbank.repository.BloodInventoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BloodInventoryService {

    private BloodInventoryRepository bloodInventoryRepository;

    public BloodInventoryService(BloodInventoryRepository bloodInventoryRepository) {
        this.bloodInventoryRepository = bloodInventoryRepository;
    }

    // Naya blood stock add karo
    public BloodInventory addBloodUnits(BloodInventory bloodInventory) {
        // Automatically aaj ki date set karo
        bloodInventory.setAddedDate(LocalDate.now());
        return bloodInventoryRepository.save(bloodInventory);
    }

    // Saara inventory dekho
    public List<BloodInventory> getAllInventory() {
        return bloodInventoryRepository.findAll();
    }

    // Blood group se valid units dhundo
    // Expired units nahi aayengi
    public List<BloodInventory> getValidUnitsByBloodGroup(String bloodGroup) {
        return bloodInventoryRepository
                .findByBloodGroupAndExpiryDateAfter(bloodGroup, LocalDate.now());
    }

    // Expire ho chuki units dhundo
    // Admin ko dikhao ki kya discard karna hai
    public List<BloodInventory> getExpiredUnits() {
        return bloodInventoryRepository
                .findByExpiryDateBefore(LocalDate.now());
    }

    // Blood group ki total valid units count karo
    // "O+ ki kitni units available hain abhi?"
    public int getTotalValidUnits(String bloodGroup) {

        // Valid units ki list lo
        List<BloodInventory> validUnits = getValidUnitsByBloodGroup(bloodGroup);

        // Saari units add karo
        int total = 0;
        for (BloodInventory inventory : validUnits) {
            total = total + inventory.getUnits();
        }
        return total;
    }

    // Low stock check karo
    // 10 se kam units hain toh low stock!
    public boolean isLowStock(String bloodGroup) {
        int total = getTotalValidUnits(bloodGroup);
        return total < 10;
    }
}