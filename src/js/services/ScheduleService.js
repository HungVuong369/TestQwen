// Schedule Service - SRP: Business logic for schedule management
class ScheduleService {
    constructor(repository) {
        this.repository = repository || new ScheduleRepository();
    }

    /**
     * Get all schedules
     * @returns {Promise<Array>} Array of schedules
     */
    async getAllSchedules() {
        return await this.repository.getAll();
    }

    /**
     * Get schedules grouped by day
     * @returns {Promise<Object>} Schedules grouped by day of week
     */
    async getSchedulesByDay() {
        const allSchedules = await this.getAllSchedules();
        const grouped = {};

        CONSTANTS.DAYS_OF_WEEK.forEach(day => {
            grouped[day] = [];
        });

        allSchedules.forEach(schedule => {
            if (grouped[schedule.dayOfWeek]) {
                grouped[schedule.dayOfWeek].push(schedule);
            }
        });

        // Sort each day's schedules by start time
        Object.keys(grouped).forEach(day => {
            grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
        });

        return grouped;
    }

    /**
     * Create a new schedule
     * @param {Object} scheduleData - Schedule data
     * @returns {Promise<string>} New schedule ID
     */
    async createSchedule(scheduleData) {
        return await this.repository.add(scheduleData);
    }

    /**
     * Update an existing schedule
     * @param {string} id - Schedule ID
     * @param {Object} updates - Fields to update
     * @returns {Promise<void>}
     */
    async updateSchedule(id, updates) {
        const existing = await this.repository.getById(id);
        if (!existing) {
            throw new Error('Schedule not found');
        }

        const updatedData = { ...existing, ...updates };
        await this.repository.update(updatedData);
    }

    /**
     * Delete a schedule
     * @param {string} id - Schedule ID
     * @returns {Promise<void>}
     */
    async deleteSchedule(id) {
        await this.repository.delete(id);
    }

    /**
     * Export all schedules
     * @returns {Promise<string>} JSON string
     */
    async exportSchedules() {
        return await this.repository.export();
    }

    /**
     * Import schedules from JSON
     * @param {string} jsonString - JSON string
     * @returns {Promise<number>} Number of imported schedules
     */
    async importSchedules(jsonString) {
        return await this.repository.import(jsonString);
    }

    /**
     * Clear all schedules
     * @returns {Promise<void>}
     */
    async clearAllSchedules() {
        await this.repository.clearAll();
    }
}
