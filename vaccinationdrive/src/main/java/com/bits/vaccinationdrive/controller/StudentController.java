package com.bits.vaccinationdrive.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bits.vaccinationdrive.dto.DashboardStats;
import com.bits.vaccinationdrive.model.Student;
import com.bits.vaccinationdrive.service.StudentService;

@RestController
@RequestMapping("/api/students")
public class StudentController {
	@Autowired
    private StudentService studentService;

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        return student != null ? ResponseEntity.ok(student) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentService.createStudent(student);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
        Student updatedStudent = studentService.updateStudent(id, studentDetails);
        return updatedStudent != null ? ResponseEntity.ok(updatedStudent) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/upload")
    public ResponseEntity<?> bulkUpload(@RequestParam("file") MultipartFile file) throws Exception {
        return studentService.bulkUpload(file);
    }

    @GetMapping("/search")
    public List<Student> searchStudents(@RequestParam String query) {
        return studentService.searchStudents(query);
    }

    @GetMapping("/filter")
    public List<Student> filterStudents(
            @RequestParam(required = false) String classGrade,
            @RequestParam(required = false) String vaccinationStatus) {
        return studentService.filterStudents(classGrade, vaccinationStatus);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        DashboardStats stats = studentService.getStats();
        return ResponseEntity.ok(stats);
    }
}
