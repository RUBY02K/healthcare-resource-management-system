package com.bloodbank.bloodbank.repository;

import com.bloodbank.bloodbank.entity.DonationStatus;
import com.bloodbank.bloodbank.entity.OrganDonation;
import com.bloodbank.bloodbank.entity.OrganType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganDonationRepository extends JpaRepository<OrganDonation, Long> {

    // Organ type se dhundo
    // "Kidney donate karne wale saare donors"
    List<OrganDonation> findByOrganType(OrganType organType);

    // Blood group aur organ type se dhundo
    // Matching ke liye use hoga
    // "O+ blood group wale kidney donors"
    List<OrganDonation> findByBloodGroupAndOrganType(
            String bloodGroup, OrganType organType);

    // Status se dhundo
    // "Saare registered donors"
    List<OrganDonation> findByStatus(DonationStatus status);

    // Donor id se dhundo
    // "Is donor ne kaun kaun se organs register kiye"
    List<OrganDonation> findByDonorId(Long donorId);
}