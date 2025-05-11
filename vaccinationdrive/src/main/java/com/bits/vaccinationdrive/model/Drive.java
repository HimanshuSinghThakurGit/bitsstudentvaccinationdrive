package com.bits.vaccinationdrive.model;


import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "drives")
public class Drive {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @Column(name = "name")
    private String name;

    @Column(name = "vaccine_id")
    private Long vaccineId;

    @Transient
    private String vaccineName; // Populated in service layer

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "available_doses")
    private int availableDoses;

    @ElementCollection
    @CollectionTable(name = "drive_applicable_classes", joinColumns = @JoinColumn(name = "drive_id"))
    @Column(name = "applicable_class")
    private List<String> applicableClasses;

    @Column(name = "location")
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private DriveStatus status;
  
    @Column(name = "year")
    private int year;
    
    public enum DriveStatus {
        UPCOMING, COMPLETED, CANCELLED
    }
        

	public Drive() {
		super();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getVaccineId() {
		return vaccineId;
	}

	public void setVaccineId(Long vaccineId) {
		this.vaccineId = vaccineId;
	}

	public String getVaccineName() {
		return vaccineName;
	}

	public void setVaccineName(String vaccineName) {
		this.vaccineName = vaccineName;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public int getAvailableDoses() {
		return availableDoses;
	}

	public void setAvailableDoses(int availableDoses) {
		this.availableDoses = availableDoses;
	}

	public List<String> getApplicableClasses() {
		return applicableClasses;
	}

	public void setApplicableClasses(List<String> applicableClasses) {
		this.applicableClasses = applicableClasses;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public DriveStatus getStatus() {
		return status;
	}

	public void setStatus(DriveStatus status) {
		this.status = status;
	}

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}
    
    
}