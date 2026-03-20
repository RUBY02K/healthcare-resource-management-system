package com.bloodbank.bloodbank.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "organ_donations")
public class OrganDonation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Kaun donate kar raha hai
    // ManyToOne → ek donor many organs donate kar sakta hai
    @ManyToOne
    @JoinColumn(name = "donor_id")
    private User donor;

    // Kaun sa organ donate karega
    @Enumerated(EnumType.STRING)
    private OrganType organType;

    // Donor ka blood group
    // Matching ke liye zaroori hai
    private String bloodGroup;

    // Donation status
    @Enumerated(EnumType.STRING)
    private DonationStatus status;

    // Kab register kiya
    @Column(name = "registration_date")
    private LocalDate registrationDate;

    // Koi additional note
    private String note;

    // Default Constructor
    public OrganDonation() {
    }

    // Getters
    public Long getId() {
        return id;
    }

    public User getDonor() {
        return donor;
    }

    public OrganType getOrganType() {
        return organType;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public DonationStatus getStatus() {
        return status;
    }

    public LocalDate getRegistrationDate() {
        return registrationDate;
    }

    public String getNote() {
        return note;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setDonor(User donor) {
        this.donor = donor;
    }

    public void setOrganType(OrganType organType) {
        this.organType = organType;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public void setStatus(DonationStatus status) {
        this.status = status;
    }

    public void setRegistrationDate(LocalDate registrationDate) {
        this.registrationDate = registrationDate;
    }

    public void setNote(String note) {
        this.note = note;
    }
}