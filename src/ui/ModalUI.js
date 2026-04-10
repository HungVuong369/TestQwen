/**
 * Modal UI Service
 * Handles event modal display, form management, and user input
 * Follows SRP - Only responsible for modal UI interactions
 * Follows ISP - Provides focused interface for modal operations
 */

import { CONSTANTS } from '../utils/constants.js';

export class ModalUI {
    constructor(modalElement, formElement, options = {}) {
        this.modal = modalElement;
        this.form = formElement;
        this.options = {
            onClose: options.onClose || (() => {}),
            onSubmit: options.onSubmit || (() => {}),
            onDelete: options.onDelete || (() => {})
        };
        
        this.currentEventId = null;
        this.selectedColor = CONSTANTS.COLORS[0];
        
        this.initEventListeners();
    }

    /**
     * Initialize event listeners for modal interactions
     */
    initEventListeners() {
        // Close modal button
        const closeBtn = document.getElementById('closeModalBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Color picker buttons
        const colorButtons = this.modal.querySelectorAll('.color-option');
        colorButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.selectColor(button.dataset.color, button);
            });
        });

        // Delete button
        const deleteBtn = document.getElementById('deleteEventBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (this.currentEventId && confirm('Are you sure you want to delete this event?')) {
                    this.options.onDelete(this.currentEventId);
                }
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    /**
     * Select a color from the color picker
     * @param {string} color - Selected color
     * @param {HTMLElement} button - Selected button element
     */
    selectColor(color, button) {
        this.selectedColor = color;
        
        // Update visual selection
        const buttons = this.modal.querySelectorAll('.color-option');
        buttons.forEach(btn => {
            btn.classList.remove('active', 'ring-2', 'ring-offset-2', 'ring-indigo-500');
        });
        
        button.classList.add('active', 'ring-2', 'ring-offset-2', 'ring-indigo-500');
        
        // Update hidden input
        const colorInput = document.getElementById('eventColor');
        if (colorInput) {
            colorInput.value = color;
        }
    }

    /**
     * Open modal for creating a new event
     * @param {number} day - Pre-selected day (0-6)
     * @param {number} hour - Pre-selected hour (0-23)
     */
    openForNew(day = 1, hour = 9) {
        this.resetForm();
        
        // Set pre-selected values
        const daySelect = document.getElementById('eventDay');
        const timeInput = document.getElementById('eventTime');
        
        if (daySelect) daySelect.value = day;
        if (timeInput) timeInput.value = `${hour.toString().padStart(2, '0')}:00`;
        
        // Set default color
        const firstColorBtn = this.modal.querySelector('.color-option');
        if (firstColorBtn) {
            this.selectColor(CONSTANTS.COLORS[0], firstColorBtn);
        }
        
        // Update title
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) modalTitle.textContent = 'Add Event';
        
        // Hide delete button
        const deleteBtn = document.getElementById('deleteEventBtn');
        if (deleteBtn) deleteBtn.classList.add('hidden');
        
        this.currentEventId = null;
        this.show();
    }

    /**
     * Open modal for editing an existing event
     * @param {Event} event - Event to edit
     */
    openForEdit(event) {
        this.resetForm();
        
        // Populate form with event data
        const fields = {
            eventTitle: event.title,
            eventDescription: event.description,
            eventDay: event.day.toString(),
            eventTime: event.time,
            eventAlarm: event.alarmEnabled,
            eventRepeat: event.repeatWeekly
        };
        
        Object.entries(fields).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
            }
        });
        
        // Select color
        const colorInput = document.getElementById('eventColor');
        if (colorInput) {
            colorInput.value = event.color;
        }
        
        const colorButton = this.modal.querySelector(`.color-option[data-color="${event.color}"]`);
        if (colorButton) {
            this.selectColor(event.color, colorButton);
        }
        
        // Update title
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) modalTitle.textContent = 'Edit Event';
        
        // Show delete button
        const deleteBtn = document.getElementById('deleteEventBtn');
        if (deleteBtn) deleteBtn.classList.remove('hidden');
        
        this.currentEventId = event.id;
        this.show();
    }

    /**
     * Handle form submission
     */
    handleSubmit() {
        const formData = {
            title: document.getElementById('eventTitle').value.trim(),
            description: document.getElementById('eventDescription').value.trim(),
            day: parseInt(document.getElementById('eventDay').value),
            time: document.getElementById('eventTime').value,
            color: document.getElementById('eventColor').value,
            alarmEnabled: document.getElementById('eventAlarm').checked,
            repeatWeekly: document.getElementById('eventRepeat').checked
        };

        // Validate required fields
        if (!formData.title) {
            alert('Please enter a title for the event.');
            return;
        }

        if (!formData.time) {
            alert('Please select a time for the event.');
            return;
        }

        this.options.onSubmit(formData, this.currentEventId);
    }

    /**
     * Reset form to default state
     */
    resetForm() {
        this.form.reset();
        this.currentEventId = null;
        
        // Reset color selection
        const firstColorBtn = this.modal.querySelector('.color-option');
        if (firstColorBtn) {
            this.selectColor(CONSTANTS.COLORS[0], firstColorBtn);
        }
    }

    /**
     * Show the modal
     */
    show() {
        this.modal.classList.remove('hidden');
        this.modal.classList.add('flex');
        
        // Focus on title input
        setTimeout(() => {
            const titleInput = document.getElementById('eventTitle');
            if (titleInput) titleInput.focus();
        }, 100);
    }

    /**
     * Hide the modal
     */
    close() {
        this.modal.classList.add('hidden');
        this.modal.classList.remove('flex');
        this.options.onClose();
    }

    /**
     * Check if modal is currently open
     * @returns {boolean} True if modal is open
     */
    isOpen() {
        return !this.modal.classList.contains('hidden');
    }

    /**
     * Show error message in modal
     * @param {string} message - Error message to display
     */
    showError(message) {
        alert(message);
    }
}

export default ModalUI;
