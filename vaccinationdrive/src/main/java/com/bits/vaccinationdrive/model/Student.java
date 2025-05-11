package com.bits.vaccinationdrive.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "students")
public class Student {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="student_id", nullable = false, unique = true)
    private String studentId;

    @Column(name="name", nullable = false)
    private String name;

    @Column(name="class_grade", nullable = false)
    private String classGrade;
    
    @Column(name="vaccination_status", nullable = true)
    private String vaccinationStatus;
    
    @Column(name="vaccine_type")
    private String vaccineType;
    
    @Column(name="last_vaccinated_date")
    private LocalDateTime lastVaccinatedDate;
    
    @Column(name="created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name="updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "year")
    private int year;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getClassGrade() {
		return classGrade;
	}

	public void setClassGrade(String classGrade) {
		this.classGrade = classGrade;
	}

	public String getVaccinationStatus() {
		return vaccinationStatus;
	}

	public void setVaccinationStatus(String vaccinationStatus) {
		this.vaccinationStatus = vaccinationStatus;
	}

	public String getVaccineType() {
		return vaccineType;
	}

	public void setVaccineType(String vaccineType) {
		this.vaccineType = vaccineType;
	}

	public LocalDateTime getLastVaccinatedDate() {
		return lastVaccinatedDate;
	}

	public void setLastVaccinatedDate(LocalDateTime lastVaccinatedDate) {
		this.lastVaccinatedDate = lastVaccinatedDate;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}
    	
    
}
