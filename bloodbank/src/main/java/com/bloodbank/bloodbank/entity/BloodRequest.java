package com.bloodbank.bloodbank.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "blood_requests")
public class BloodRequest {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id ;

    // Kis hospital ne request ki
    // ManyToOne → ek hospital many requests kar sakta hai
    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private User hospital;

    // Konsa blood group chahiye
    private String bloodGroup;

    // Kitni units chahiye
    private int units;

    // Request status
    // PENDING → abhi decide nahi hua
    // APPROVED → approve ho gaya
    // REJECTED → reject ho gaya
    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    // Kab request ki
    @Column(name = "request_date")
    private LocalDate requestDate;

    // Koi note ya reason
    private String note;

    // Default Constructor
    public BloodRequest() {
    }

    // Getters
    public Long getId() {
        return id;
    }

    public User getHospital() {
        return hospital;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public int getUnits() {
        return units;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public LocalDate getRequestDate() {
        return requestDate;
    }

    public String getNote() {
        return note;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setHospital(User hospital) {
        this.hospital = hospital;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public void setUnits(int units) {
        this.units = units;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public void setRequestDate(LocalDate requestDate) {
        this.requestDate = requestDate;
    }

    public void setNote(String note) {
        this.note = note;
    }

}
