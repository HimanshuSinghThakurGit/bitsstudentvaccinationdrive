package com.bits.vaccinationdrive.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bits.vaccinationdrive.model.Drive;

public interface DriveRepository extends JpaRepository<Drive, Long> {
    List<Drive> findByStartDateLessThanEqualAndEndDateGreaterThanEqual(LocalDate endDate, LocalDate startDate);   
//	long countByStartDateBetween(LocalDate now, LocalDate in30);
	
    @Query("SELECT d FROM Drive d WHERE d.status != 'CANCELLED' AND d.startDate BETWEEN :startDate AND :endDate")
    List<Drive> findDrivesWithinDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT count(id) FROM Drive d WHERE d.status != 'CANCELLED' AND d.startDate BETWEEN :startDate AND :endDate")
    Long countByStartDateBetween(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    
}
