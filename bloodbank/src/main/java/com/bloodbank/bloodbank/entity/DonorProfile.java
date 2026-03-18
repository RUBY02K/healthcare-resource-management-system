package com.bloodbank.bloodbank.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "donor_profiles")
public class DonorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // OneToOne → ek User ka ek hi DonorProfile hoga
    // Jaise ek aadmi ka ek hi Aadhar card hota hai
    @OneToOne
    @JoinColumn(name = "user_id")
    // user_id column banega donor_profiles table mein
    // Yeh users table se connected hoga
    private User user;

    // Blood group store karega
    // A+, A-, B+, B-, O+, O-, AB+, AB-
    @Column(name = "blood_group")
    private String bloodGroup;

    // Aakhri baar kab donate kiya
    // Null hoga agar pehli baar donate kiya
    @Column(name = "last_donation_date")
    private LocalDate lastDonationDate;

    // Donor ka phone number
    private String phone;

    // Donor ka city
    private String city;

    // Default Constructor
    public DonorProfile() {
    }

    // Getters
    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public LocalDate getLastDonationDate() {
        return lastDonationDate;
    }

    public String getPhone() {
        return phone;
    }

    public String getCity() {
        return city;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public void setLastDonationDate(LocalDate lastDonationDate) {
        this.lastDonationDate = lastDonationDate;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setCity(String city) {
        this.city = city;
    }
}