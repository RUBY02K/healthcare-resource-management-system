package com.bloodbank.bloodbank.repository;

import com.bloodbank.bloodbank.entity.DonorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonorRepository extends JpaRepository<DonorProfile, Long> {

    // User id se donor profile dhundo
    // Jab koi donor apni profile dekhna chahe
    Optional<DonorProfile> findByUserId(Long userId);

    // Blood group se saare donors dhundo
    // Emergency mein kaam aayega
    // "Mujhe saare O+ donors chahiye"
    List<DonorProfile> findByBloodGroup(String bloodGroup);

    // City aur blood group se donors dhundo
    // "Mumbai mein saare A+ donors"
    List<DonorProfile> findByCityAndBloodGroup(String city, String bloodGroup);
}
