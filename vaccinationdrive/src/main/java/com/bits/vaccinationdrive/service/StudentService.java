package com.bits.vaccinationdrive.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.bits.vaccinationdrive.dto.DashboardStats;
import com.bits.vaccinationdrive.model.Student;
import com.bits.vaccinationdrive.repository.DriveRepository;
import com.bits.vaccinationdrive.repository.StudentRepository;

@Service
public class StudentService {
	@Autowired
	private StudentRepository studentRepository;

	@Autowired
	private DriveRepository driveRepository;

	public List<Student> getAllStudents() {
		return studentRepository.findAll();
	}

	public Student getStudentById(Long id) {
		return studentRepository.findById(id).orElse(null);
	}

	public Student createStudent(Student student) {
		student.setCreatedAt(LocalDateTime.now());
		student.setUpdatedAt(LocalDateTime.now());
		student.setYear(LocalDate.now().getYear());
		return studentRepository.save(student);
	}

	public Student updateStudent(Long id, Student studentDetails) {
		Student student = studentRepository.findById(id).orElse(null);
		if (student != null) {
			student.setName(studentDetails.getName());
			student.setClassGrade(studentDetails.getClassGrade());
			student.setVaccinationStatus(studentDetails.getVaccinationStatus());
			student.setVaccineType(studentDetails.getVaccineType());
			student.setLastVaccinatedDate(studentDetails.getLastVaccinatedDate());
			student.setUpdatedAt(LocalDateTime.now());
			return studentRepository.save(student);
		}
		return null;
	}

	public void deleteStudent(Long id) {
		studentRepository.deleteById(id);
	}

	public ResponseEntity<?> bulkUpload(MultipartFile file) throws Exception {

		List<Student> savedStudents = new ArrayList<>();
		try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
			String line;
			boolean isFirstLine = true;
			while ((line = reader.readLine()) != null) {
				// Skip header line
				if (isFirstLine) {
					isFirstLine = false;
					continue;
				}

				String[] data = line.split(",");
				if (data.length < 4)
					continue; // Skip incomplete rows

				Student student = new Student();
				student.setStudentId(data[0].trim());
				student.setName(data[1].trim());
				student.setClassGrade(data[2].trim());
				student.setVaccinationStatus(data[3].trim());

				// Optional fields
				if (data.length > 4)
					student.setVaccineType(data[4].trim());
				if (data.length > 5 && !data[5].trim().isEmpty()) {
//	    	           
					String dateStr = data[5].trim();
					LocalDate parsedDate = null;

					DateTimeFormatter[] formatters = { DateTimeFormatter.ofPattern("yyyy-MM-dd"),
							DateTimeFormatter.ofPattern("d/M/yyyy"), // 12/8/2023 → 12 Aug 2023
							DateTimeFormatter.ofPattern("M/d/yyyy") // 8/12/2023 → 12 Aug 2023 (US format)
					};

					for (DateTimeFormatter fmt : formatters) {
						try {
							parsedDate = LocalDate.parse(dateStr, fmt);
							break; // success
						} catch (DateTimeParseException e) {
							// Try next format
						}
					}

					if (parsedDate != null) {
						student.setLastVaccinatedDate(parsedDate.atStartOfDay());
					} else {
						System.out.println("Invalid date format for student ID: " + data[0]);
						continue;
					}

				}
				student.setYear(Integer.parseInt(data[6].trim()));
				student.setCreatedAt(LocalDateTime.now());
				student.setUpdatedAt(LocalDateTime.now());
				savedStudents.add(studentRepository.save(student));				
			}
	    	return ResponseEntity.ok(savedStudents);
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to read CSV: " + e.getMessage());
		}


	}


	
	public List<Student> searchStudents(String query) {
		return studentRepository.findByNameContainingIgnoreCase(query);
	}

	public List<Student> filterStudents(String classGrade, String vaccinationStatus) {
		if (classGrade != null && vaccinationStatus != null) {
			return studentRepository.findByClassGradeAndVaccinationStatus(classGrade, vaccinationStatus);
		} else if (classGrade != null) {
			return studentRepository.findByClassGrade(classGrade);
		} else if (vaccinationStatus != null) {
			return studentRepository.findByVaccinationStatus(vaccinationStatus);
		}
		return studentRepository.findAll();
	}

	public DashboardStats getStats() {
		// 1) Total students
		long totalStudents = studentRepository.count();

		// 2) Vaccinated count (assuming vaccinationStatus = "true")
		long vaccinatedCount = studentRepository.countByVaccinationStatus("true");

		// 3) Upcoming drives in next 15 days
		LocalDate now = LocalDate.now();
		LocalDate in30 = now.plusDays(30);
		long upcomingDrives = driveRepository.countByStartDateBetween(now, in30);

		return new DashboardStats(totalStudents, vaccinatedCount, upcomingDrives);
	}

}
