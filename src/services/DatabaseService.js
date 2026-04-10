/**
 * Database Service
 * Handles all IndexedDB operations for event storage
 * Follows SRP - Only responsible for database operations
 * Follows DIP - Depends on abstractions (idb library)
 */

import { CONSTANTS } from '../utils/constants.js';
import { Event } from '../models/Event.js';

export class DatabaseService {
    constructor(dbName = CONSTANTS.DB.NAME, dbVersion = CONSTANTS.DB.VERSION) {
        this.dbName = dbName;
        this.dbVersion = dbVersion;
        this.storeName = CONSTANTS.DB.STORE_NAME;
        this.db = null;
    }

    /**
     * Initialize database connection
     * @returns {Promise<void>}
     */
    async init() {
        if (this.db) {
            return;
        }

        try {
            this.db = await idb.openDB(this.dbName, this.dbVersion, {
                upgrade: (db) => {
                    if (!db.objectStoreNames.contains(this.storeName)) {
                        const store = db.createObjectStore(this.storeName, {
                            keyPath: 'id',
                            autoIncrement: true
                        });
                        store.createIndex('day', 'day', { unique: false });
                        store.createIndex('time', 'time', { unique: false });
                        store.createIndex('alarmEnabled', 'alarmEnabled', { unique: false });
                    }
                }
            });
        } catch (error) {
            console.error('Failed to initialize database:', error);
            throw new Error('Database initialization failed');
        }
    }

    /**
     * Get all events from database
     * @returns {Promise<Event[]>} Array of events
     */
    async getAllEvents() {
        await this.init();
        const events = await this.db.getAll(this.storeName);
        return events.map(event => Event.fromJSON(event));
    }

    /**
     * Get events for a specific day
     * @param {number} day - Day of week (0-6)
     * @returns {Promise<Event[]>} Array of events for the day
     */
    async getEventsByDay(day) {
        await this.init();
        const index = this.db.transaction(this.storeName).store.index('day');
        const events = await index.getAll(day);
        return events.map(event => Event.fromJSON(event));
    }

    /**
     * Get a single event by ID
     * @param {number} id - Event ID
     * @returns {Promise<Event|null>} Event or null if not found
     */
    async getEventById(id) {
        await this.init();
        const event = await this.db.get(this.storeName, id);
        return event ? Event.fromJSON(event) : null;
    }

    /**
     * Add a new event
     * @param {Event} event - Event to add
     * @returns {Promise<number>} ID of the newly created event
     */
    async addEvent(event) {
        await this.init();
        
        if (!(event instanceof Event)) {
            throw new Error('Invalid event object');
        }

        const eventData = event.toJSON();
        delete eventData.id; // Remove ID to let autoIncrement work
        
        return await this.db.add(this.storeName, eventData);
    }

    /**
     * Update an existing event
     * @param {Event} event - Updated event
     * @returns {Promise<void>}
     */
    async updateEvent(event) {
        await this.init();
        
        if (!(event instanceof Event)) {
            throw new Error('Invalid event object');
        }

        if (!event.id) {
            throw new Error('Event ID is required for update');
        }

        await this.db.put(this.storeName, event.toJSON());
    }

    /**
     * Delete an event
     * @param {number} id - Event ID to delete
     * @returns {Promise<void>}
     */
    async deleteEvent(id) {
        await this.init();
        await this.db.delete(this.storeName, id);
    }

    /**
     * Get events with alarms enabled
     * @returns {Promise<Event[]>} Array of events with alarms
     */
    async getAlarmEvents() {
        await this.init();
        const allEvents = await this.getAllEvents();
        return allEvents.filter(event => event.alarmEnabled);
    }

    /**
     * Clear all events (for testing/debugging)
     * @returns {Promise<void>}
     */
    async clearAll() {
        await this.init();
        await this.db.clear(this.storeName);
    }

    /**
     * Close database connection
     * @returns {void}
     */
    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}

export default DatabaseService;
