// Schedule Model - SRP: Define schedule data structure and validation
class Schedule {
    constructor(data) {
        this.id = data.id || generateId();
        this.name = data.name;
        this.dayOfWeek = data.dayOfWeek; // 'mon', 'tue', etc.
        this.startTime = data.startTime; // HH:MM format
        this.endTime = data.endTime;     // HH:MM format
        this.tagColor = data.tagColor || 'blue';
        this.notes = data.notes || '';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    /**
     * Validate schedule data
     * @returns {Object} Validation result with isValid and errors
     */
    validate() {
        const errors = [];

        if (!this.name || this.name.trim() === '') {
            errors.push('Name is required');
        }

        if (!this.dayOfWeek || !CONSTANTS.DAYS_OF_WEEK.includes(this.dayOfWeek)) {
            errors.push('Invalid day of week');
        }

        if (!this.startTime || !this.endTime) {
            errors.push('Start time and end time are required');
        }

        if (this.startTime && this.endTime && this.startTime >= this.endTime) {
            errors.push('End time must be after start time');
        }

        if (this.tagColor && !CONSTANTS.TAG_COLORS[this.tagColor]) {
            errors.push('Invalid tag color');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Get schedule duration in minutes
     * @returns {number} Duration in minutes
     */
    getDuration() {
        const startMinutes = DateTimeHelper.timeToMinutes(this.startTime);
        const endMinutes = DateTimeHelper.timeToMinutes(this.endTime);
        return endMinutes - startMinutes;
    }

    /**
     * Convert to plain object
     * @returns {Object} Plain object representation
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            dayOfWeek: this.dayOfWeek,
            startTime: this.startTime,
            endTime: this.endTime,
            tagColor: this.tagColor,
            notes: this.notes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
