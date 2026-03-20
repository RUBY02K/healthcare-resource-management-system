package com.bloodbank.bloodbank.service;

import com.bloodbank.bloodbank.entity.BloodRequest;
import com.bloodbank.bloodbank.entity.RequestStatus;
import com.bloodbank.bloodbank.repository.BloodRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BloodRequestService {

    private BloodRequestRepository bloodRequestRepository;
    private BloodInventoryService bloodInventoryService;

    public BloodRequestService(BloodRequestRepository bloodRequestRepository,
                               BloodInventoryService bloodInventoryService) {
        this.bloodRequestRepository = bloodRequestRepository;
        this.bloodInventoryService = bloodInventoryService;
    }

    // Naya blood request banao
    public BloodRequest createRequest(BloodRequest bloodRequest) {
        // Status PENDING set karo
        // Aaj ki date set karo
        bloodRequest.setStatus(RequestStatus.PENDING);
        bloodRequest.setRequestDate(LocalDate.now());
        return bloodRequestRepository.save(bloodRequest);
    }

    // Saari requests dekho
    public List<BloodRequest> getAllRequests() {
        return bloodRequestRepository.findAll();
    }

    // Status se requests dhundo
    // "Saari PENDING requests dikhao"
    public List<BloodRequest> getRequestsByStatus(RequestStatus status) {
        return bloodRequestRepository.findByStatus(status);
    }

    // Hospital ki requests dekho
    public List<BloodRequest> getRequestsByHospital(Long hospitalId) {
        return bloodRequestRepository.findByHospitalId(hospitalId);
    }

    // Id se request dhundo
    public Optional<BloodRequest> findById(Long id) {
        return bloodRequestRepository.findById(id);
    }

    // =====================
    // APPROVE REQUEST
    // Sabse important business logic!
    // =====================
    public String approveRequest(Long requestId) {

        // Request dhundo
        Optional<BloodRequest> requestOpt = bloodRequestRepository.findById(requestId);

        if (requestOpt.isEmpty()) {
            return "Request not found!";
        }

        BloodRequest request = requestOpt.get();

        // Pehle check karo — kya itni units available hain?
        int availableUnits = bloodInventoryService
                .getTotalValidUnits(request.getBloodGroup());

        if (availableUnits < request.getUnits()) {
            // Units nahi hain → reject karo
            request.setStatus(RequestStatus.REJECTED);
            bloodRequestRepository.save(request);
            return "Not enough units available! Request rejected.";
        }

        // Units available hain → approve karo
        request.setStatus(RequestStatus.APPROVED);
        bloodRequestRepository.save(request);

        return "Request approved successfully!";
    }

    // REJECT REQUEST
    public String rejectRequest(Long requestId) {

        Optional<BloodRequest> requestOpt = bloodRequestRepository.findById(requestId);

        if (requestOpt.isEmpty()) {
            return "Request not found!";
        }

        BloodRequest request = requestOpt.get();
        request.setStatus(RequestStatus.REJECTED);
        bloodRequestRepository.save(request);

        return "Request rejected!";
    }
}
