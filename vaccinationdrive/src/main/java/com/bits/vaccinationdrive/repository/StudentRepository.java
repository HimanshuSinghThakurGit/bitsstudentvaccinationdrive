package com.bits.vaccinationdrive.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bits.vaccinationdrive.model.Student;

public interface StudentRepository  extends JpaRepository<Student, Long> {
    List<Student> findByClassGrade(String classGrade);
    List<Student> findByClassGradeIn(List<String> classNames);
    List<Student> findByVaccinationStatus(String vaccinationStatus);
    Student findByStudentId(String studentId);
    List<Student> findByNameContainingIgnoreCase(String name);
	List<Student> findByClassGradeAndVaccinationStatus(String classGrade, String vaccinationStatus);
	long countByVaccinationStatus(String string);
}