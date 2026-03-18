package com.bloodbank.bloodbank.service;

import com.bloodbank.bloodbank.entity.DonorProfile;
import com.bloodbank.bloodbank.repository.DonorRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DonorService {

    private DonorRepository donorRepository;

    public DonorService(DonorRepository donorRepository){
        this.donorRepository = donorRepository;
    }

    //donor  profile save karo
    public DonorProfile saveProfile (DonorProfile donorProfile){
        return donorRepository.save(donorProfile);
    }

    //user id se profile dhundo
    public Optional<DonorProfile> findByUserId(Long userId){
        return  donorRepository.findByUserId(userId);
    }
    // blood group se donor dhundo
    public List<DonorProfile> findByBloodGroup(String bloodGroup){
        return donorRepository.findByBloodGroup(bloodGroup);
    }
    // City aur blood group se donors dhundo
    public List<DonorProfile> findByCityAndBloodGroup(String city, String bloodGroup) {
        return donorRepository.findByCityAndBloodGroup(city, bloodGroup);
    }

    // Saare donors lao
    public List<DonorProfile> getAllDonors() {
        return donorRepository.findAll();
    }

    // =====================
    // ELIGIBILITY CHECK
    // Yeh sabse important business logic hai!
    // =====================

    public boolean isEligible(DonorProfile donorProfile) {

        // Agar pehli baar donate kar raha hai →
        // lastDonationDate null hoga → eligible hai!
        if (donorProfile.getLastDonationDate() == null) {
            return true;
        }

        // Aaj ki date lo
        LocalDate today = LocalDate.now();

        // Last donation ke baad kitne din hue?
        long daysSinceLastDonation = today.toEpochDay()
                - donorProfile.getLastDonationDate().toEpochDay();

        // 90 din se zyada hue hain?
        // Haan → eligible
        // Nahi → not eligible
        return daysSinceLastDonation >= 90;
    }
}
