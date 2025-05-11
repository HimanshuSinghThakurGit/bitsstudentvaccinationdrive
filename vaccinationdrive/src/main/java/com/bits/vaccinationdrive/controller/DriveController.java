package com.bits.vaccinationdrive.controller;


import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bits.vaccinationdrive.dto.DriveConflictRequest;
import com.bits.vaccinationdrive.dto.DriveConflictResponse;
import com.bits.vaccinationdrive.model.Drive;
import com.bits.vaccinationdrive.model.Student;
import com.bits.vaccinationdrive.service.DriveService;

@RestController
@RequestMapping("/api")
public class DriveController {
    @Autowired
    private DriveService driveService;

    @GetMapping("/drives")
    public List<Drive> getAllDrives() {
        return driveService.getAllDrives();
    }
    
    @GetMapping("/upcomingdrives")
    public List<Drive> getUpcomingDrivesWithin15Days() {
        return driveService.getUpcomingDrivesWithin15Days();
    }

    @GetMapping("/drives/{driveId}/students")
    public List<Student> getStudentsForDrive(@PathVariable Long driveId) {
        return driveService.getStudentsForDrive(driveId);
    }

    @PatchMapping("/vaccination-drives/{driveId}/students/{studentId}")
    public void updateVaccinationStatus(
            @PathVariable Long driveId,
            @PathVariable Long studentId,
            @RequestBody Map<String, Boolean> updates) {
        boolean vaccinated = updates.get("vaccinationStatus");
        driveService.updateVaccinationStatus(driveId, studentId, vaccinated);
    }

    @GetMapping("/drives/{id}")
    public ResponseEntity<Drive> getDriveById(@PathVariable Long id) {
        Drive drive = driveService.getDriveById(id);
        return ResponseEntity.ok(drive);
    }

    @PostMapping("/drives")
    public ResponseEntity<Drive> createDrive( @RequestBody Drive drive) {
        Drive savedDrive = driveService.createDrive(drive);
        return ResponseEntity.ok(savedDrive);
    }

    @PutMapping("/drives/{id}")
    public ResponseEntity<Drive> updateDrive(@PathVariable Long id,  @RequestBody Drive driveDetails) {
        Drive updatedDrive = driveService.updateDrive(id, driveDetails);
        return ResponseEntity.ok(updatedDrive);
    }

    @PutMapping("/drives/{id}/cancel")
    public ResponseEntity<Drive> cancelDrive(@PathVariable Long id) {
        Drive cancelledDrive = driveService.cancelDrive(id);
        return ResponseEntity.ok(cancelledDrive);
    }

    @DeleteMapping("/drives/{id}")
    public ResponseEntity<Void> deleteDrive(@PathVariable Long id) {
        driveService.deleteDrive(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/drives/check-conflict")
    public ResponseEntity<DriveConflictResponse> checkConflict(@RequestBody DriveConflictRequest request) {
        DriveConflictResponse response = driveService.checkConflict(request);
        return ResponseEntity.ok(response);
    }

//    @GetMapping("/vaccines")
//    public List<Vaccine> getAllVaccines() {
//        return driveService.getAllVaccines();
//    }
}