package com.bits.vaccinationdrive.repository;
import com.bits.vaccinationdrive.model.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VaccineRepository extends JpaRepository<Vaccine, Long> {
    boolean existsByBatchNumber(String batchNumber);
}