package com.bits.vaccinationdrive.dto;

public class DashboardStats {

	 	private long totalStudents;
	    private long vaccinatedCount;
	    private long upcomingDrives;
	    
	    
		public DashboardStats() {
			super();
		}
		public DashboardStats(long totalStudents, long vaccinatedCount, long upcomingDrives) {
			super();
			this.totalStudents = totalStudents;
			this.vaccinatedCount = vaccinatedCount;
			this.upcomingDrives = upcomingDrives;
		}
		public long getTotalStudents() {
			return totalStudents;
		}
		public void setTotalStudents(long totalStudents) {
			this.totalStudents = totalStudents;
		}
		public long getVaccinatedCount() {
			return vaccinatedCount;
		}
		public void setVaccinatedCount(long vaccinatedCount) {
			this.vaccinatedCount = vaccinatedCount;
		}
		public long getUpcomingDrives() {
			return upcomingDrives;
		}
		public void setUpcomingDrives(long upcomingDrives) {
			this.upcomingDrives = upcomingDrives;
		}
	    
	    
	    
}
