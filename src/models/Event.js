/**
 * Event Model
 * Represents a schedule event with all its properties
 * Follows SRP - Only responsible for event data structure and validation
 */

import { CONSTANTS } from '../utils/constants.js';

export class Event {
    constructor({
        id = null,
        title,
        description = '',
        day,
        time,
        color = CONSTANTS.COLORS[0],
        alarmEnabled = true,
        repeatWeekly = false,
        createdAt = new Date().toISOString(),
        updatedAt = new Date().toISOString()
    }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.day = day;
        this.time = time;
        this.color = color;
        this.alarmEnabled = alarmEnabled;
        this.repeatWeekly = repeatWeekly;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        
        this.validate();
    }

    /**
     * Validate event data
     * @throws {Error} If validation fails
     */
    validate() {
        if (!this.title || this.title.trim().length === 0) {
            throw new Error('Event title is required');
        }

        if (this.day < 0 || this.day > 6) {
            throw new Error('Invalid day value. Must be between 0 (Sunday) and 6 (Saturday)');
        }

        if (!this.time || !/^\d{2}:\d{2}$/.test(this.time)) {
            throw new Error('Invalid time format. Must be HH:MM');
        }

        if (!CONSTANTS.COLORS.includes(this.color)) {
            throw new Error('Invalid color value');
        }
    }

    /**
     * Convert event to plain object for storage
     * @returns {Object} Plain object representation
     */
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            day: this.day,
            time: this.time,
            color: this.color,
            alarmEnabled: this.alarmEnabled,
            repeatWeekly: this.repeatWeekly,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Create event from plain object
     * @param {Object} data - Plain object with event data
     * @returns {Event} New Event instance
     */
    static fromJSON(data) {
        return new Event(data);
    }

    /**
     * Update event properties
     * @param {Object} updates - Properties to update
     * @returns {Event} Updated event instance (for method chaining)
     */
    update(updates) {
        const updatedData = { ...this.toJSON(), ...updates, updatedAt: new Date().toISOString() };
        return new Event(updatedData);
    }

    /**
     * Get formatted time display
     * @returns {string} Formatted time (e.g., "09:30 AM")
     */
    getFormattedTime() {
        const [hours, minutes] = this.time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }

    /**
     * Get day name
     * @returns {string} Day name (e.g., "Monday")
     */
    getDayName() {
        return CONSTANTS.DAY_NAMES_FULL[this.day];
    }
}

export default Event;
