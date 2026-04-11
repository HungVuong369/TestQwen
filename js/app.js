// Main Application Entry Point
class App {
    constructor() {
        this.settingsService = null;
        this.scheduleService = null;
        this.notificationService = null;
        this.weeklyView = null;
        this.initialized = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Initialize services
            this.settingsService = new SettingsService();
            this.settingsService.load();

            const repository = new ScheduleRepository();
            this.scheduleService = new ScheduleService(repository);

            this.notificationService = new NotificationService(this.settingsService);
            this.weeklyView = new WeeklyView(this.scheduleService, this.settingsService);

            // Apply initial settings
            this.applySettings();

            // Render UI
            await this.weeklyView.init();

            // Setup UI event listeners
            this.setupUIListeners();

            // Update week display
            this.updateWeekDisplay();

            // Request notification permission if enabled
            if (this.settingsService.settings.notificationEnabled) {
                await this.notificationService.requestPermission();
                this.notificationService.startMonitoring(this.scheduleService);
            }

            this.initialized = true;
            console.log('Weekly Schedule Manager initialized');
        } catch (error) {
            console.error('Failed to initialize app:', error);
        }
    }

    /**
     * Apply current settings to UI
     */
    applySettings() {
        // Apply theme
        this.settingsService.applyTheme();

        // Apply language
        this.applyLanguage();

        // Update language switcher
        const langSwitcher = document.getElementById('languageSwitcher');
        if (langSwitcher) {
            langSwitcher.value = this.settingsService.getLanguage();
        }
    }

    /**
     * Apply language translations to UI
     */
    applyLanguage() {
        const translations = this.settingsService.getTranslations();

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const keys = key.split('.');
            let value = translations;

            for (const k of keys) {
                value = value?.[k];
            }

            if (typeof value === 'string') {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = value;
                } else {
                    el.textContent = value;
                }
            }
        });
    }

    /**
     * Update week display in header
     */
    updateWeekDisplay() {
        const weekInfo = DateTimeHelper.getCurrentWeekInfo();
        const translations = this.settingsService.getTranslations();
        const display = document.getElementById('currentWeekDisplay');

        if (display && translations.week.currentWeek) {
            display.textContent = translations.week.currentWeek
                .replace('{week}', weekInfo.weekNumber)
                .replace('{year}', weekInfo.year);
        }
    }

    /**
     * Setup UI event listeners
     */
    setupUIListeners() {
        // Language switcher
        document.getElementById('languageSwitcher').addEventListener('change', (e) => {
            this.settingsService.setLanguage(e.target.value);
            this.applyLanguage();
            this.weeklyView.refresh();
            this.updateWeekDisplay();
            document.dispatchEvent(new CustomEvent('languageChanged'));
        });

        // Dark mode toggle
        document.getElementById('darkModeToggle').addEventListener('click', () => {
            this.settingsService.toggleDarkMode();
            this.settingsService.applyTheme();
        });

        // Add schedule FAB
        document.getElementById('addScheduleFab').addEventListener('click', () => {
            this.openScheduleModal();
        });

        // Modal cancel button
        document.getElementById('cancelScheduleBtn').addEventListener('click', () => {
            this.closeScheduleModal();
        });

        // Schedule form submit
        document.getElementById('scheduleForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveSchedule();
        });

        // Close modal on backdrop click
        document.getElementById('scheduleModal').addEventListener('click', (e) => {
            if (e.target.id === 'scheduleModal') {
                this.closeScheduleModal();
            }
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', async () => {
            await this.exportData();
        });

        // Import button
        document.getElementById('importBtn').addEventListener('click', () => {
            this.importData();
        });

        // Setup tag color picker
        this.setupTagColorPicker();

        // Setup time input sync
        this.setupTimeInputSync();
    }

    /**
     * Open schedule modal
     * @param {Object} schedule - Schedule data (optional for edit mode)
     * @param {boolean} isEdit - Whether in edit mode
     */
    openScheduleModal(schedule = null, isEdit = false) {
        const modal = document.getElementById('scheduleModal');
        const title = document.getElementById('modalTitle');
        const translations = this.settingsService.getTranslations();

        // Reset form
        document.getElementById('scheduleForm').reset();
        document.getElementById('scheduleId').value = '';
        document.getElementById('scheduleTag').value = 'blue';
        this.updateTagColorSelection('blue');

        if (isEdit && schedule) {
            title.textContent = translations.modal.editTitle;
            document.getElementById('scheduleId').value = schedule.id;
            document.getElementById('scheduleName').value = schedule.name;
            document.getElementById('scheduleTag').value = schedule.tagColor || 'blue';
            this.updateTagColorSelection(schedule.tagColor || 'blue');
            document.getElementById('scheduleNotes').value = schedule.notes || '';
            document.getElementById('scheduleDay').value = schedule.dayOfWeek;
            document.getElementById('startTimeDisplay').value = schedule.startTime;
            document.getElementById('endTimeDisplay').value = schedule.endTime;
        } else {
            title.textContent = translations.modal.addTitle;
            document.getElementById('scheduleDay').value = schedule?.dayOfWeek || 'mon';
            document.getElementById('startTimeDisplay').value = schedule?.startTime || '09:00';
            document.getElementById('endTimeDisplay').value = schedule?.endTime || '10:00';
        }

        modal.classList.remove('hidden');
    }

    /**
     * Update tag color button selection UI
     * @param {string} selectedColor - The color to mark as selected
     */
    updateTagColorSelection(selectedColor) {
        document.querySelectorAll('.tag-color-btn').forEach(btn => {
            const color = btn.dataset.color;
            if (color === selectedColor) {
                btn.classList.add('border-gray-800', 'dark:border-white');
                btn.classList.remove('border-transparent');
            } else {
                btn.classList.remove('border-gray-800', 'dark:border-white');
                btn.classList.add('border-transparent');
            }
        });
    }

    /**
     * Setup tag color picker event listeners
     */
    setupTagColorPicker() {
        document.querySelectorAll('.tag-color-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.dataset.color;
                document.getElementById('scheduleTag').value = color;
                this.updateTagColorSelection(color);
            });
        });
    }

    /**
     * Setup time input sync
     */
    setupTimeInputSync() {
        const startTimeInput = document.getElementById('startTimeDisplay');
        const endTimeInput = document.getElementById('endTimeDisplay');
        const hiddenStartInput = document.getElementById('scheduleStartTime');

        // Sync start time to hidden input and auto-adjust end time
        startTimeInput.addEventListener('change', (e) => {
            hiddenStartInput.value = e.target.value;
            // Auto-set end time to 1 hour later if not set or before start
            const [hours, minutes] = e.target.value.split(':').map(Number);
            const endHours = hours + 1;
            const newEndTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            if (!endTimeInput.value || endTimeInput.value <= e.target.value) {
                endTimeInput.value = newEndTime;
            }
        });

        // Sync end time changes
        endTimeInput.addEventListener('change', (e) => {
            // Ensure end time is after start time
            if (e.target.value <= startTimeInput.value) {
                const [hours, minutes] = startTimeInput.value.split(':').map(Number);
                const endHours = hours + 1;
                e.target.value = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            }
        });
    }

    /**
     * Close schedule modal
     */
    closeScheduleModal() {
        document.getElementById('scheduleModal').classList.add('hidden');
    }

    /**
     * Save schedule from modal
     */
    async saveSchedule() {
        try {
            const id = document.getElementById('scheduleId').value;
            const scheduleData = {
                name: document.getElementById('scheduleName').value,
                tagColor: document.getElementById('scheduleTag').value,
                notes: document.getElementById('scheduleNotes').value,
                dayOfWeek: document.getElementById('scheduleDay').value,
                startTime: document.getElementById('startTimeDisplay').value,
                endTime: document.getElementById('endTimeDisplay').value
            };

            if (id) {
                await this.scheduleService.updateSchedule(id, scheduleData);
            } else {
                await this.scheduleService.createSchedule(scheduleData);
            }

            await this.weeklyView.refresh();
            this.closeScheduleModal();

            // Show success message
            const translations = this.settingsService.getTranslations();
            alert(translations.alerts.scheduleSaved);
        } catch (error) {
            console.error('Failed to save schedule:', error);
            alert(error.message);
        }
    }

    /**
     * Export data
     */
    async exportData() {
        try {
            const data = await this.scheduleService.exportSchedules();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `weekly-schedule-${new Date().toISOString().split('T')[0]}.json`;
            a.click();

            URL.revokeObjectURL(url);

            const translations = this.settingsService.getTranslations();
            alert(translations.alerts.dataExported);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed: ' + error.message);
        }
    }

    /**
     * Import data
     */
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            try {
                const file = e.target.files[0];
                const reader = new FileReader();

                reader.onload = async (event) => {
                    try {
                        const count = await this.scheduleService.importSchedules(event.target.result);
                        await this.weeklyView.refresh();

                        const translations = this.settingsService.getTranslations();
                        alert(`${translations.alerts.dataImported} (${count} schedules)`);
                    } catch (error) {
                        alert(translations.alerts.invalidFile);
                    }
                };

                reader.readAsText(file);
            } catch (error) {
                console.error('Import failed:', error);
                alert('Import failed: ' + error.message);
            }
        };

        input.click();
    }
}

// Initialize app when DOM is ready
window.app = new App();
document.addEventListener('DOMContentLoaded', () => window.app.init());
