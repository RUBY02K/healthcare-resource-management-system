package com.bloodbank.bloodbank.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "blood_inventory")
public class BloodInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Blood group → A+, A-, B+, B-, O+, O-, AB+, AB-
    // bloodGroup → camelCase hona chahiye
    // Taaki Repository mein findByBloodGroup kaam kare
    private String bloodGroup;

    // Kitni units available hain
    private int units;

    // Blood kab expire hoga
    // Blood 35-42 din tak valid hota hai
    private LocalDate expiryDate;

    // Kisne add kiya → Admin ka naam
    private String addedBy;

    // Kab add kiya
    private LocalDate addedDate;

    // Default Constructor
    public BloodInventory() {
    }

    // Getters
    public Long getId() {
        return id;
    }

    // bloodGroup → capital G
    public String getBloodGroup() {
        return bloodGroup;
    }

    public int getUnits() {
        return units;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public String getAddedBy() {
        return addedBy;
    }

    public LocalDate getAddedDate() {
        return addedDate;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    // bloodGroup → capital G
    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public void setUnits(int units) {
        this.units = units;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public void setAddedBy(String addedBy) {
        this.addedBy = addedBy;
    }

    public void setAddedDate(LocalDate addedDate) {
        this.addedDate = addedDate;
    }
}