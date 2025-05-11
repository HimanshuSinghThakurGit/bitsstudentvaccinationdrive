package com.bits.vaccinationdrive.dto;

import java.time.LocalDate;


public class DriveConflictRequest {
	
	 	private LocalDate startDate;
	    private LocalDate endDate;
	    private Long excludeId;
	    	    	    
		public DriveConflictRequest() {
			super();
		}
		
		public LocalDate getStartDate() {
			return startDate;
		}
		public void setStartDate(LocalDate startDate) {
			this.startDate = startDate;
		}
		public LocalDate getEndDate() {
			return endDate;
		}
		public void setEndDate(LocalDate endDate) {
			this.endDate = endDate;
		}
		public Long getExcludeId() {
			return excludeId;
		}
		public void setExcludeId(Long excludeId) {
			this.excludeId = excludeId;
		}	    
	    
}
