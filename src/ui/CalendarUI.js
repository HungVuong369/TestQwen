/**
 * Calendar UI Service
 * Handles rendering and interaction with the calendar grid
 * Follows SRP - Only responsible for calendar UI rendering
 * Follows DIP - Depends on abstractions for data and events
 */

import { CONSTANTS } from '../utils/constants.js';

export class CalendarUI {
    constructor(containerElement, onCellClick, onEventClick) {
        this.container = containerElement;
        this.onCellClick = onCellClick;
        this.onEventClick = onEventClick;
        this.currentWeekStart = this.getWeekStart(new Date());
    }

    /**
     * Get the Monday of the week for a given date
     * @param {Date} date - Input date
     * @returns {Date} Monday of that week
     */
    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    /**
     * Render the calendar grid
     * @param {Event[]} events - Array of events to display
     */
    render(events = []) {
        this.container.innerHTML = '';
        
        const grid = document.createElement('div');
        grid.className = 'calendar-grid';
        
        // Render time column header (empty)
        const timeHeader = document.createElement('div');
        timeHeader.className = 'calendar-header bg-gray-100 dark:bg-gray-800';
        timeHeader.textContent = 'Time';
        grid.appendChild(timeHeader);
        
        // Render day headers
        for (let i = 0; i < 7; i++) {
            const date = new Date(this.currentWeekStart);
            date.setDate(this.currentWeekStart.getDate() + i);
            
            const header = document.createElement('div');
            header.className = 'calendar-header';
            
            const dayName = CONSTANTS.DAY_NAMES[i];
            const dayNum = date.getDate();
            const month = date.getMonth() + 1;
            
            header.innerHTML = `
                <div class="text-xs text-gray-500 dark:text-gray-400">${dayName}</div>
                <div class="text-lg font-bold">${dayNum}/${month}</div>
            `;
            
            grid.appendChild(header);
        }
        
        // Render time slots and cells
        for (let hour = CONSTANTS.TIME.START_HOUR; hour <= CONSTANTS.TIME.END_HOUR; hour++) {
            // Time label
            const timeLabel = document.createElement('div');
            timeLabel.className = 'time-slot';
            timeLabel.textContent = `${hour.toString().padStart(2, '0')}:00`;
            grid.appendChild(timeLabel);
            
            // Cells for each day
            for (let day = 0; day < 7; day++) {
                const cell = document.createElement('div');
                cell.className = 'calendar-cell';
                cell.dataset.day = day;
                cell.dataset.hour = hour;
                
                // Find events for this day and hour
                const dayEvents = events.filter(event => 
                    event.day === day && 
                    parseInt(event.time.split(':')[0]) === hour
                );
                
                // Sort events by time
                dayEvents.sort((a, b) => a.time.localeCompare(b.time));
                
                // Render events
                dayEvents.forEach(event => {
                    const eventCard = this.createEventCard(event);
                    cell.appendChild(eventCard);
                });
                
                // Click handler for adding new event
                cell.addEventListener('click', (e) => {
                    if (e.target === cell || e.target.classList.contains('calendar-cell')) {
                        this.onCellClick(day, hour);
                    }
                });
                
                grid.appendChild(cell);
            }
        }
        
        this.container.appendChild(grid);
    }

    /**
     * Create an event card element
     * @param {Event} event - Event to create card for
     * @returns {HTMLElement} Event card element
     */
    createEventCard(event) {
        const card = document.createElement('div');
        card.className = 'event-card event-card-new';
        card.style.backgroundColor = event.color;
        card.style.color = this.getContrastColor(event.color);
        card.dataset.eventId = event.id;
        
        const minutes = parseInt(event.time.split(':')[1]);
        const topOffset = (minutes / 60) * 20; // 20px per hour segment
        
        card.style.marginTop = `${topOffset}px`;
        
        card.innerHTML = `
            <div class="event-title">${this.escapeHtml(event.title)}</div>
            <div class="event-time">${event.getFormattedTime()}</div>
        `;
        
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onEventClick(event);
        });
        
        return card;
    }

    /**
     * Get contrasting text color for background
     * @param {string} hexColor - Background color in hex
     * @returns {string} Contrasting color (black or white)
     */
    getContrastColor(hexColor) {
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return yiq >= 128 ? '#000000' : '#ffffff';
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Navigate to previous week
     */
    prevWeek() {
        this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
        this.render();
    }

    /**
     * Navigate to next week
     */
    nextWeek() {
        this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
        this.render();
    }

    /**
     * Navigate to current week
     */
    goToCurrentWeek() {
        this.currentWeekStart = this.getWeekStart(new Date());
        this.render();
    }

    /**
     * Get current week label
     * @returns {string} Formatted week label
     */
    getWeekLabel() {
        const endDate = new Date(this.currentWeekStart);
        endDate.setDate(endDate.getDate() + 6);
        
        const startMonth = this.currentWeekStart.toLocaleString('en-US', { month: 'short' });
        const startDay = this.currentWeekStart.getDate();
        const endMonth = endDate.toLocaleString('en-US', { month: 'short' });
        const endDay = endDate.getDate();
        const year = this.currentWeekStart.getFullYear();
        
        return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    }

    /**
     * Refresh calendar with new events
     * @param {Event[]} events - New array of events
     */
    refresh(events) {
        this.render(events);
    }
}

export default CalendarUI;
