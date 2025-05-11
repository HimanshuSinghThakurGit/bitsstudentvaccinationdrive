package com.bits.vaccinationdrive.dto;

import java.util.List;

import com.bits.vaccinationdrive.model.Student;

public class BulkUploadResponse {
	private List<Student> savedStudents;
	private List<String> validationErrors;

	// Constructor
	public BulkUploadResponse(List<Student> savedStudents, List<String> validationErrors) {
		this.savedStudents = savedStudents;
		this.validationErrors = validationErrors;
	}
}
