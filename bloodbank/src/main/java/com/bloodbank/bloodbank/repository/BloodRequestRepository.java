package com.bloodbank.bloodbank.repository;

import com.bloodbank.bloodbank.entity.BloodRequest;
import com.bloodbank.bloodbank.entity.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {

    // Hospital id se requests dhundo
    // "Is hospital ki saari requests"
    List<BloodRequest> findByHospitalId(Long hospitalId);

    // Status se requests dhundo
    // "Saari pending requests dikhao"
    List<BloodRequest> findByStatus(RequestStatus status);

    // Blood group se requests dhundo
    List<BloodRequest> findByBloodGroup(String bloodGroup);
}