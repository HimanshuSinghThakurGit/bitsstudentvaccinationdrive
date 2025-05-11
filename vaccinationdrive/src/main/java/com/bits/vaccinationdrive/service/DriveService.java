package com.bits.vaccinationdrive.service;


import com.bits.vaccinationdrive.dto.DriveConflictRequest;
import com.bits.vaccinationdrive.dto.DriveConflictResponse;
import com.bits.vaccinationdrive.model.Drive;
import com.bits.vaccinationdrive.model.Student;
import com.bits.vaccinationdrive.model.Vaccine;
import com.bits.vaccinationdrive.repository.DriveRepository;
import com.bits.vaccinationdrive.repository.StudentRepository;
import com.bits.vaccinationdrive.repository.VaccineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DriveService {
    @Autowired
    private DriveRepository driveRepository;

    @Autowired
    private VaccineRepository vaccineRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    public List<Drive> getAllDrives() {
        List<Drive> drives = driveRepository.findAll();
        return drives.stream()
                .map(this::populateVaccineName)
                .map(this::computeStatus)
                .collect(Collectors.toList());
    }

    public Drive getDriveById(Long id) {
        Drive drive = driveRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Drive not found with id: " + id));
        return computeStatus(populateVaccineName(drive));
    }

    public Drive createDrive(Drive drive) {
        validateDrive(drive);
        drive.setStatus(Drive.DriveStatus.UPCOMING); // Set initial status
        drive.setYear(LocalDate.now().getYear());
        return driveRepository.save(drive);
    }

    public Drive updateDrive(Long id, Drive driveDetails) {
        Drive drive = driveRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Drive not found with id: " + id));
        if (drive.getStatus() == Drive.DriveStatus.COMPLETED || drive.getStatus() == Drive.DriveStatus.CANCELLED) {
            throw new IllegalStateException("Cannot update a completed or cancelled drive");
        }
        drive.setName(driveDetails.getName());
        drive.setVaccineId(driveDetails.getVaccineId());
        drive.setStartDate(driveDetails.getStartDate());
        drive.setEndDate(driveDetails.getEndDate());
        drive.setAvailableDoses(driveDetails.getAvailableDoses());
        drive.setApplicableClasses(driveDetails.getApplicableClasses());
        drive.setLocation(driveDetails.getLocation());
        drive.setYear(LocalDate.now().getYear());
        validateDrive(drive);
        return driveRepository.save(drive);
    }

    public Drive cancelDrive(Long id) {
        Drive drive = driveRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Drive not found with id: " + id));
        if (drive.getStatus() == Drive.DriveStatus.COMPLETED) {
            throw new IllegalStateException("Cannot cancel a completed drive");
        }
        if (drive.getStatus() == Drive.DriveStatus.CANCELLED) {
            throw new IllegalStateException("Drive is already cancelled");
        }
        drive.setStatus(Drive.DriveStatus.CANCELLED);
        return driveRepository.save(drive);
    }

    public void deleteDrive(Long id) {
        if (!driveRepository.existsById(id)) {
            throw new EntityNotFoundException("Drive not found with id: " + id);
        }
        driveRepository.deleteById(id);
    }

    public DriveConflictResponse checkConflict(DriveConflictRequest request) {
        List<Drive> overlappingDrives = driveRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(
                request.getEndDate(), request.getStartDate());
        boolean hasConflict = overlappingDrives.stream()
                .filter(drive -> drive.getStatus() != Drive.DriveStatus.CANCELLED) // Ignore cancelled drives
                .anyMatch(drive -> request.getExcludeId() == null || !drive.getId().equals(request.getExcludeId()));
        DriveConflictResponse response = new DriveConflictResponse();
        response.setHasConflict(hasConflict);
        return response;
    }

//    public List<Vaccine> getAllVaccines() {
//        return vaccineRepository.findAll();
//    }

    private Drive populateVaccineName(Drive drive) {
        Optional<Vaccine> vaccine = vaccineRepository.findById(drive.getVaccineId());
        if (vaccine.isPresent()) {
            drive.setVaccineName(vaccine.get().getName());
        } else {
            drive.setVaccineName("Unknown");
        }
        return drive;
    }

    private Drive computeStatus(Drive drive) {
        if (drive.getStatus() == Drive.DriveStatus.CANCELLED) {
            return drive; // Status is manually set to CANCELLED
        }
        LocalDate today = LocalDate.now();
        if (drive.getEndDate().isBefore(today)) {
            drive.setStatus(Drive.DriveStatus.COMPLETED);
        } else {
            drive.setStatus(Drive.DriveStatus.UPCOMING);
        }
        return drive;
    }

    private void validateDrive(Drive drive) {
        // Check if vaccine exists
        if (!vaccineRepository.existsById(drive.getVaccineId())) {
            throw new IllegalArgumentException("Vaccine with ID " + drive.getVaccineId() + " does not exist");
        }
        // Check if start date is at least 15 days from today
        LocalDate today = LocalDate.now();
        LocalDate minStartDate = today.plusDays(15);
        if (drive.getStartDate().isBefore(minStartDate)) {
            throw new IllegalArgumentException("Drive must be scheduled at least 15 days in advance");
        }
        // Check if end date is after start date
        if (drive.getEndDate().isBefore(drive.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }
        // Check if duration is within 7 days
        long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(drive.getStartDate(), drive.getEndDate());
        if (daysBetween > 7) {
            throw new IllegalArgumentException("Drive cannot exceed 7 days");
        }
    }
    
    
    public List<Drive> getUpcomingDrivesWithin15Days() {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(30);
        return driveRepository.findDrivesWithinDateRange(today, endDate);
    }

    // New method to get students for a specific drive
    public List<Student> getStudentsForDrive(Long driveId) {
        Drive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new RuntimeException("Drive not found"));
        List<String> applicableClasses = drive.getApplicableClasses();
        if (applicableClasses == null || applicableClasses.isEmpty()) {
            return List.of();
        }
        return studentRepository.findByClassGradeIn(applicableClasses);
    }

    // Method to update a student's vaccination status
    public void updateVaccinationStatus(Long driveId, Long studentId, boolean vaccinated) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Drive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new EntityNotFoundException("Drive not found with id: " + driveId));
        Long vaccineid=drive.getVaccineId();
        Vaccine vaccine = vaccineRepository.findById(vaccineid)
                .orElseThrow(() -> new RuntimeException("Vaccine not found"));
        if(vaccinated)
        {
        	student.setVaccinationStatus("true");
        	student.setVaccineType(vaccine.getName());
        	student.setLastVaccinatedDate(LocalDateTime.now());
        }
        else
        {
        	student.setVaccinationStatus("false");
        }
        studentRepository.save(student);
    }
    
}