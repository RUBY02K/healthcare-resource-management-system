package com.bloodbank.bloodbank.service;

import com.bloodbank.bloodbank.entity.DonationStatus;
import com.bloodbank.bloodbank.entity.OrganDonation;
import com.bloodbank.bloodbank.entity.OrganType;
import com.bloodbank.bloodbank.repository.OrganDonationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class OrganDonationService {

    private OrganDonationRepository organDonationRepository;

    public OrganDonationService(OrganDonationRepository organDonationRepository) {
        this.organDonationRepository = organDonationRepository;
    }

    // Naya organ donation register karo
    public OrganDonation registerDonation(OrganDonation organDonation) {
        // Status REGISTERED set karo
        organDonation.setStatus(DonationStatus.REGISTERED);
        // Aaj ki date set karo
        organDonation.setRegistrationDate(LocalDate.now());
        return organDonationRepository.save(organDonation);
    }

    // Saare donations dekho
    public List<OrganDonation> getAllDonations() {
        return organDonationRepository.findAll();
    }

    // Organ type se donors dhundo
    public List<OrganDonation> findByOrganType(OrganType organType) {
        return organDonationRepository.findByOrganType(organType);
    }

    // Id se donation dhundo
    public Optional<OrganDonation> findById(Long id) {
        return organDonationRepository.findById(id);
    }

    // Status se donations dhundo
    public List<OrganDonation> findByStatus(DonationStatus status) {
        return organDonationRepository.findByStatus(status);
    }

    // Donor id se donations dhundo
    public List<OrganDonation> findByDonorId(Long donorId) {
        return organDonationRepository.findByDonorId(donorId);
    }

    // =====================
    // MATCHING LOGIC
    // Sabse important business logic!
    // =====================

    public List<OrganDonation> findMatchingDonors(
            String bloodGroup, OrganType organType) {

        // Blood group aur organ type se
        // REGISTERED donors dhundo
        List<OrganDonation> matches = organDonationRepository
                .findByBloodGroupAndOrganType(bloodGroup, organType);

        // Sirf REGISTERED wale return karo
        // MATCHED ya COMPLETED wale nahi
        return matches.stream()
                .filter(donation ->
                        donation.getStatus() == DonationStatus.REGISTERED)
                .toList();
    }

    // Donation status MATCHED karo
    public String markAsMatched(Long donationId) {

        Optional<OrganDonation> donationOpt =
                organDonationRepository.findById(donationId);

        if (donationOpt.isEmpty()) {
            return "Donation not found!";
        }

        OrganDonation donation = donationOpt.get();
        donation.setStatus(DonationStatus.MATCHED);
        organDonationRepository.save(donation);

        return "Donor matched successfully!";
    }
}