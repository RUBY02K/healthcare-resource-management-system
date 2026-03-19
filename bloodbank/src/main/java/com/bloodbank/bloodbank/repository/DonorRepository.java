package com.bloodbank.bloodbank.repository;

import com.bloodbank.bloodbank.entity.DonorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonorRepository extends JpaRepository<DonorProfile, Long> {

    // user.id se dhundo
    // "user_id" nahi → "user" object ka "id" hai
    Optional<DonorProfile> findByUserId(Long userId);

    // Blood group se saare donors dhundo
    List<DonorProfile> findByBloodGroup(String bloodGroup);

    // City aur blood group se donors dhundo
    List<DonorProfile> findByCityAndBloodGroup(String city, String bloodGroup);
}