/**
 * Alarm Service
 * Manages alarm checking, notifications, and sound playback
 * Follows SRP - Only responsible for alarm-related functionality
 * Follows DIP - Depends on abstractions for database and UI notifications
 */

import { CONSTANTS } from '../utils/constants.js';

export class AlarmService {
    constructor(databaseService, notificationCallback = null) {
        this.databaseService = databaseService;
        this.notificationCallback = notificationCallback;
        this.checkInterval = null;
        this.triggeredAlarms = new Set();
        this.audioElement = null;
    }

    /**
     * Initialize alarm service
     * @param {HTMLAudioElement} audioElement - Audio element for alarm sound
     */
    init(audioElement) {
        this.audioElement = audioElement;
    }

    /**
     * Start checking alarms periodically
     */
    start() {
        if (this.checkInterval) {
            return;
        }

        this.checkInterval = setInterval(() => {
            this.checkAlarms();
        }, CONSTANTS.TIME.CHECK_INTERVAL);

        // Initial check
        this.checkAlarms();
    }

    /**
     * Stop checking alarms
     */
    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    /**
     * Check if any alarms should be triggered
     */
    async checkAlarms() {
        try {
            const now = new Date();
            const currentDay = now.getDay();
            const currentHours = now.getHours().toString().padStart(2, '0');
            const currentMinutes = now.getMinutes().toString().padStart(2, '0');
            const currentTime = `${currentHours}:${currentMinutes}`;

            const alarmEvents = await this.databaseService.getAlarmEvents();

            for (const event of alarmEvents) {
                // Check if event is for today or repeats weekly
                const isToday = event.day === currentDay;
                const isRepeating = event.repeatWeekly;
                
                if ((isToday || isRepeating) && event.time === currentTime) {
                    const alarmKey = `${event.id}-${now.toDateString()}-${event.time}`;
                    
                    // Prevent duplicate triggers for the same event
                    if (!this.triggeredAlarms.has(alarmKey)) {
                        this.triggerAlarm(event);
                        this.triggeredAlarms.add(alarmKey);
                        
                        // Remove from triggered set after 2 minutes
                        setTimeout(() => {
                            this.triggeredAlarms.delete(alarmKey);
                        }, 120000);
                    }
                }
            }
        } catch (error) {
            console.error('Error checking alarms:', error);
        }
    }

    /**
     * Trigger an alarm for an event
     * @param {Event} event - Event to trigger alarm for
     */
    triggerAlarm(event) {
        // Play sound
        if (this.audioElement) {
            this.audioElement.currentTime = 0;
            this.audioElement.play().catch(error => {
                console.warn('Could not play alarm sound:', error);
            });
        }

        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Schedule Alarm', {
                body: `${event.title} - ${event.getFormattedTime()}`,
                icon: '/favicon.ico',
                tag: `alarm-${event.id}`,
                requireInteraction: true
            });
        }

        // Call custom notification callback if provided
        if (this.notificationCallback) {
            this.notificationCallback(event);
        }

        // Show toast notification
        this.showToast(event);
    }

    /**
     * Show toast notification for alarm
     * @param {Event} event - Event to show toast for
     */
    showToast(event) {
        if (typeof Toastify === 'undefined') {
            return;
        }

        Toastify({
            text: `⏰ ${event.title} - ${event.getFormattedTime()}`,
            duration: 10000,
            gravity: 'top',
            position: 'right',
            backgroundColor: event.color,
            stopOnFocus: true,
            onClick: () => {
                // Stop alarm when toast is clicked
                if (this.audioElement) {
                    this.audioElement.pause();
                    this.audioElement.currentTime = 0;
                }
            }
        }).showToast();
    }

    /**
     * Request notification permission
     * @returns {Promise<string>} Permission status
     */
    static async requestPermission() {
        if (!('Notification' in window)) {
            return 'denied';
        }

        if (Notification.permission === 'granted') {
            return 'granted';
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission;
        }

        return Notification.permission;
    }

    /**
     * Check if notifications are supported and granted
     * @returns {boolean} True if notifications are available
     */
    static isNotificationSupported() {
        return 'Notification' in window && Notification.permission === 'granted';
    }

    /**
     * Stop current alarm sound
     */
    stopSound() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }
    }

    /**
     * Clear all triggered alarms (for testing)
     */
    clearTriggeredAlarms() {
        this.triggeredAlarms.clear();
    }
}

export default AlarmService;
