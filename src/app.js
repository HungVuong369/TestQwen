/**
 * Main Application Entry Point
 * Orchestrates all services and UI components
 * Follows SRP - Only responsible for application initialization and coordination
 * Follows DIP - Depends on abstractions, not concrete implementations
 */

import { CONSTANTS } from './utils/constants.js';
import { Event } from './models/Event.js';
import { DatabaseService } from './services/DatabaseService.js';
import { AlarmService } from './services/AlarmService.js';
import { CalendarUI } from './ui/CalendarUI.js';
import { ModalUI } from './ui/ModalUI.js';

class App {
    constructor() {
        this.databaseService = null;
        this.alarmService = null;
        this.calendarUI = null;
        this.modalUI = null;
        this.events = [];
        this.isDarkMode = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Initialize database service
            this.databaseService = new DatabaseService();
            await this.databaseService.init();

            // Load events from database
            await this.loadEvents();

            // Initialize calendar UI
            const calendarContainer = document.getElementById('calendarGrid');
            this.calendarUI = new CalendarUI(
                calendarContainer,
                (day, hour) => this.handleCellClick(day, hour),
                (event) => this.handleEventClick(event)
            );
            this.calendarUI.render(this.events);
            this.updateWeekLabel();

            // Initialize modal UI
            const modal = document.getElementById('eventModal');
            const form = document.getElementById('eventForm');
            this.modalUI = new ModalUI(modal, form, {
                onSubmit: (formData, eventId) => this.handleSubmit(formData, eventId),
                onDelete: (eventId) => this.handleDelete(eventId),
                onClose: () => this.handleModalClose()
            });

            // Initialize alarm service
            const audioElement = document.getElementById('alarmSound');
            this.alarmService = new AlarmService(
                this.databaseService,
                (event) => this.handleAlarmTrigger(event)
            );
            this.alarmService.init(audioElement);
            this.alarmService.start();

            // Setup event listeners
            this.setupEventListeners();

            // Initialize dark mode
            this.initDarkMode();

            // Check notification permission
            this.checkNotificationPermission();

            console.log('Application initialized successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
            alert('Failed to initialize application. Please refresh the page.');
        }
    }

    /**
     * Load events from database
     */
    async loadEvents() {
        try {
            this.events = await this.databaseService.getAllEvents();
        } catch (error) {
            console.error('Failed to load events:', error);
            this.events = [];
        }
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Add event button
        const addEventBtn = document.getElementById('addEventBtn');
        if (addEventBtn) {
            addEventBtn.addEventListener('click', () => {
                this.modalUI.openForNew();
            });
        }

        // Previous week button
        const prevWeekBtn = document.getElementById('prevWeekBtn');
        if (prevWeekBtn) {
            prevWeekBtn.addEventListener('click', () => {
                this.calendarUI.prevWeek();
                this.updateWeekLabel();
            });
        }

        // Next week button
        const nextWeekBtn = document.getElementById('nextWeekBtn');
        if (nextWeekBtn) {
            nextWeekBtn.addEventListener('click', () => {
                this.calendarUI.nextWeek();
                this.updateWeekLabel();
            });
        }

        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }

        // Notification permission button
        const notificationBtn = document.getElementById('notificationPermissionBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', async () => {
                await this.requestNotificationPermission();
            });
        }
    }

    /**
     * Handle calendar cell click
     * @param {number} day - Day of week (0-6)
     * @param {number} hour - Hour (0-23)
     */
    handleCellClick(day, hour) {
        this.modalUI.openForNew(day, hour);
    }

    /**
     * Handle event card click
     * @param {Event} event - Clicked event
     */
    handleEventClick(event) {
        this.modalUI.openForEdit(event);
    }

    /**
     * Handle modal form submission
     * @param {Object} formData - Form data
     * @param {number|null} eventId - Event ID (null for new event)
     */
    async handleSubmit(formData, eventId) {
        try {
            if (eventId) {
                // Update existing event
                const eventIndex = this.events.findIndex(e => e.id === eventId);
                if (eventIndex === -1) {
                    throw new Error('Event not found');
                }

                const updatedEvent = this.events[eventIndex].update(formData);
                await this.databaseService.updateEvent(updatedEvent);
                this.events[eventIndex] = updatedEvent;

                this.showToast('Event updated successfully!', 'success');
            } else {
                // Create new event
                const newEvent = new Event(formData);
                const newId = await this.databaseService.addEvent(newEvent);
                newEvent.id = newId;
                this.events.push(newEvent);

                this.showToast('Event created successfully!', 'success');
            }

            // Refresh calendar
            this.calendarUI.refresh(this.events);
            this.modalUI.close();
        } catch (error) {
            console.error('Failed to save event:', error);
            this.showToast(error.message, 'error');
        }
    }

    /**
     * Handle event deletion
     * @param {number} eventId - Event ID to delete
     */
    async handleDelete(eventId) {
        try {
            await this.databaseService.deleteEvent(eventId);
            this.events = this.events.filter(e => e.id !== eventId);
            this.calendarUI.refresh(this.events);
            this.modalUI.close();
            this.showToast('Event deleted successfully!', 'success');
        } catch (error) {
            console.error('Failed to delete event:', error);
            this.showToast('Failed to delete event', 'error');
        }
    }

    /**
     * Handle modal close
     */
    handleModalClose() {
        // Cleanup if needed
    }

    /**
     * Handle alarm trigger
     * @param {Event} event - Event that triggered the alarm
     */
    handleAlarmTrigger(event) {
        console.log('Alarm triggered:', event.title);
        // Additional handling if needed
    }

    /**
     * Update week label display
     */
    updateWeekLabel() {
        const weekLabel = document.getElementById('currentWeekLabel');
        if (weekLabel) {
            weekLabel.textContent = this.calendarUI.getWeekLabel();
        }
    }

    /**
     * Initialize dark mode from localStorage or system preference
     */
    initDarkMode() {
        const savedMode = localStorage.getItem('darkMode');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedMode === 'true' || (savedMode === null && systemPrefersDark)) {
            this.enableDarkMode();
        }
    }

    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
        if (this.isDarkMode) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }

    /**
     * Enable dark mode
     */
    enableDarkMode() {
        document.documentElement.classList.add('dark');
        this.isDarkMode = true;
        localStorage.setItem('darkMode', 'true');
    }

    /**
     * Disable dark mode
     */
    disableDarkMode() {
        document.documentElement.classList.remove('dark');
        this.isDarkMode = false;
        localStorage.setItem('darkMode', 'false');
    }

    /**
     * Check notification permission and show button if needed
     */
    checkNotificationPermission() {
        const notificationBtn = document.getElementById('notificationPermissionBtn');
        if (notificationBtn) {
            if ('Notification' in window && Notification.permission !== 'granted') {
                notificationBtn.classList.remove('hidden');
            } else {
                notificationBtn.classList.add('hidden');
            }
        }
    }

    /**
     * Request notification permission
     */
    async requestNotificationPermission() {
        const permission = await AlarmService.requestPermission();
        
        if (permission === 'granted') {
            this.showToast('Notification permission granted!', 'success');
            this.checkNotificationPermission();
        } else {
            this.showToast('Notification permission denied', 'error');
        }
    }

    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type of toast (success, error, warning, info)
     */
    showToast(message, type = 'info') {
        if (typeof Toastify === 'undefined') {
            console.log(message);
            return;
        }

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#6366f1'
        };

        Toastify({
            text: message,
            duration: CONSTANTS.UI.TOAST_DURATION,
            gravity: 'top',
            position: 'right',
            backgroundColor: colors[type] || colors.info,
            stopOnFocus: true
        }).showToast();
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
    
    // Expose app instance for debugging (remove in production)
    window.app = app;
});

export default App;
