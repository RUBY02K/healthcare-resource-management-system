package com.bloodbank.bloodbank.repository;

import com.bloodbank.bloodbank.entity.BloodInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
@Repository
public interface BloodInventoryRepository extends JpaRepository <BloodInventory , Long> {
    // Blood group se saari entries dhundo
    // "O+ ki kitni units hain?"
  List<BloodInventory> findByBloodGroup(String bloodgroup);

    // Expire ho chuki blood units dhundo
    // Aaj se pehle ki expiry date wali
    List <BloodInventory> findByExpiryDateBefore(LocalDate date );

    //valid blood units dhondo
    // aaj ke baad expire hongi
    List<BloodInventory> findByExpiryDateAfter(LocalDate date );

    // Blood group ki valid units dhundo
    // Dono condition ek saath
    List<BloodInventory> findByBloodGroupAndExpiryDateAfter(
            String bloodGroup, LocalDate date);

}
