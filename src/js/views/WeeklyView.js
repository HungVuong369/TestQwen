// Weekly View - SRP: Render and manage the weekly grid view
class WeeklyView {
    constructor(scheduleService, settingsService) {
        this.scheduleService = scheduleService;
        this.settingsService = settingsService;
        this.gridElement = document.getElementById('weeklyGrid');
        this.currentSchedule = null; // For click handling
    }

    /**
     * Initialize the view
     */
    async init() {
        await this.render();
        this.setupEventListeners();
    }

    /**
     * Render the weekly grid
     */
    async render() {
        const schedulesByDay = await this.scheduleService.getSchedulesByDay();
        const translations = this.settingsService.getTranslations();
        const startHour = CONSTANTS.DEFAULT_START_HOUR;
        const endHour = CONSTANTS.DEFAULT_END_HOUR;
        const hoursCount = endHour - startHour + 1;

        // Clear existing grid (keep header row)
        const headerRow = Array.from(this.gridElement.children).slice(0, 8);
        this.gridElement.innerHTML = '';
        headerRow.forEach(el => this.gridElement.appendChild(el));

        // Update header labels with translations
        const dayHeaders = this.gridElement.querySelectorAll('.bg-gray-100 span');
        const dayKeys = ['time', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        dayHeaders.forEach((el, index) => {
            if (translations.grid[dayKeys[index]]) {
                el.textContent = translations.grid[dayKeys[index]];
            }
        });

        // Create time slots
        for (let hour = startHour; hour <= endHour; hour++) {
            // Time label column
            const timeCell = document.createElement('div');
            timeCell.className = 'bg-white dark:bg-gray-800 p-1 text-center border-r border-gray-200 dark:border-gray-700';
            timeCell.style.fontSize = `${CONSTANTS.COMPACT_GRID.FONT_SIZE}px`;
            timeCell.textContent = DateTimeHelper.formatTime(hour);
            this.gridElement.appendChild(timeCell);

            // Day columns
            CONSTANTS.DAYS_OF_WEEK.forEach(day => {
                const cell = document.createElement('div');
                cell.className = 'bg-white dark:bg-gray-800 p-px relative border-r border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors';
                cell.style.height = `${CONSTANTS.COMPACT_GRID.ROW_HEIGHT}px`;
                cell.dataset.day = day;
                cell.dataset.hour = hour;

                // Render schedules that start at this hour
                const daySchedules = schedulesByDay[day] || [];
                const startingSchedules = daySchedules.filter(s => {
                    const startHourInt = parseInt(s.startTime.split(':')[0]);
                    return startHourInt === hour;
                });

                startingSchedules.forEach(schedule => {
                    const duration = schedule.getDuration();
                    const rowspan = Math.max(1, Math.ceil(duration / 60));

                    const scheduleEl = document.createElement('div');
                    scheduleEl.className = 'absolute left-0 right-0 rounded px-1 py-px text-white overflow-hidden text-xs leading-tight';
                    scheduleEl.style.backgroundColor = CONSTANTS.TAG_COLORS[schedule.tagColor] || CONSTANTS.TAG_COLORS.blue;
                    scheduleEl.style.top = '1px';
                    scheduleEl.style.height = `calc(${rowspan} * ${CONSTANTS.COMPACT_GRID.ROW_HEIGHT}px - 2px)`;
                    scheduleEl.style.fontSize = `${CONSTANTS.COMPACT_GRID.FONT_SIZE - 1}px`;
                    scheduleEl.innerHTML = `<div class="font-semibold truncate">${schedule.name}</div>`;
                    scheduleEl.dataset.scheduleId = schedule.id;

                    cell.appendChild(scheduleEl);
                });

                // Click handler for adding/editing schedule
                cell.addEventListener('click', (e) => {
                    if (!e.target.closest('[data-schedule-id]')) {
                        this.handleCellClick(day, hour);
                    }
                });

                this.gridElement.appendChild(cell);
            });
        }

        // Setup schedule click handlers
        this.gridElement.querySelectorAll('[data-schedule-id]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleScheduleClick(el.dataset.scheduleId);
            });
        });
    }

    /**
     * Handle clicking on an empty cell
     * @param {string} day - Day of week
     * @param {number} hour - Hour
     */
    handleCellClick(day, hour) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;

        window.app.openScheduleModal({
            dayOfWeek: day,
            startTime: startTime,
            endTime: endTime
        });
    }

    /**
     * Handle clicking on a schedule
     * @param {string} scheduleId - Schedule ID
     */
    async handleScheduleClick(scheduleId) {
        const schedule = await this.scheduleService.repository.getById(scheduleId);
        if (schedule) {
            window.app.openScheduleModal(schedule, true);
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Refresh on language change
        document.addEventListener('languageChanged', () => this.render());
    }

    /**
     * Refresh the view
     */
    async refresh() {
        await this.render();
    }
}
