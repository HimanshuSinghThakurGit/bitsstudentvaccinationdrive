package com.bits.vaccinationdrive.controller;
import com.bits.vaccinationdrive.model.Vaccine;
import com.bits.vaccinationdrive.repository.VaccineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/vaccines")
public class VaccineController {
	@Autowired
    private VaccineRepository vaccineRepository;

    @GetMapping
    public List<Vaccine> getAllVaccines() {
        return vaccineRepository.findAll();
    }

    @PostMapping
    public Vaccine createVaccine(@RequestBody Vaccine vaccine) {
        validateVaccine(vaccine);
        return vaccineRepository.save(vaccine);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vaccine> updateVaccine(
            @PathVariable Long id,
            @RequestBody Vaccine vaccineDetails) {
        
        Vaccine vaccine = vaccineRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vaccine not found"));
        
        vaccine.setName(vaccineDetails.getName());
        vaccine.setBatchNumber(vaccineDetails.getBatchNumber());
        vaccine.setQuantity(vaccineDetails.getQuantity());
        vaccine.setYear(vaccineDetails.getYear());
        vaccine.setManufacturer(vaccineDetails.getManufacturer());
        vaccine.setDescription(vaccineDetails.getDescription());
        
        validateVaccine(vaccine);
        
        Vaccine updatedVaccine = vaccineRepository.save(vaccine);
        return ResponseEntity.ok(updatedVaccine);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVaccine(@PathVariable Long id) {
        vaccineRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void validateVaccine(Vaccine vaccine) {
        if (vaccine.getName() == null || vaccine.getName().trim().isEmpty()) {
            throw new RuntimeException("Vaccine name is required");
        }
        if (vaccine.getBatchNumber() == null || vaccine.getBatchNumber().trim().isEmpty()) {
            throw new RuntimeException("Batch number is required");
        }
        if (vaccine.getQuantity() == null || vaccine.getQuantity() < 0) {
            throw new RuntimeException("Quantity must be a positive number");
        }
        if (vaccine.getYear() == null || vaccine.getYear() < 2000 || vaccine.getYear() > LocalDateTime.now().getYear() + 1) {
            throw new RuntimeException("Invalid year");
        }
    }
}
