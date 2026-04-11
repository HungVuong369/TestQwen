// DateTime Helper - SRP: Handle all date/time operations
class DateTimeHelper {
    /**
     * Get current week info
     * @returns {Object} Week info with monday date and week number
     */
    static getCurrentWeekInfo() {
        const monday = this.getMondayOfWeek();
        const weekNumber = this.getWeekNumber(monday);
        return { monday, weekNumber, year: monday.getFullYear() };
    }

    /**
     * Get week number from date
     */
    static getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    /**
     * Get Monday of current week
     */
    static getMondayOfWeek() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(now);
        monday.setDate(diff);
        monday.setHours(0, 0, 0, 0);
        return monday;
    }

    /**
     * Format time for display
     */
    static formatTime(hour) {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h = hour % 12 || 12;
        return `${h}:00 ${ampm}`;
    }

    /**
     * Convert minutes to time string
     */
    static minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    /**
     * Convert time string to minutes
     */
    static timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    /**
     * Get day index (0-6) from day name
     */
    static getDayIndex(dayName) {
        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        return days.indexOf(dayName.toLowerCase());
    }

    /**
     * Get day name from index
     */
    static getDayName(index) {
        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        return days[index];
    }
}
