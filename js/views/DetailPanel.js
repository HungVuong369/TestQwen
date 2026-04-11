/**
 * DetailPanel View
 * Displays detailed information about a schedule item in a slide-in panel
 * Follows SOLID principles: Single Responsibility, Open/Closed
 */
class DetailPanel {
  constructor(i18n) {
    this.i18n = i18n;
    this.panel = null;
    this.currentSchedule = null;
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const template = `
      <div id="detailPanel" class="fixed top-0 right-0 h-full w-full sm:w-[350px] bg-white dark:bg-gray-800 shadow-2xl transform translate-x-full transition-transform duration-300 ease-in-out z-50 overflow-y-auto">
        <!-- Close Button -->
        <button id="closeDetailPanel" class="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <!-- Content Container -->
        <div class="p-6 pt-16">
          <!-- Color Bar -->
          <div id="detailColorBar" class="w-full h-3 rounded mb-6"></div>

          <!-- Schedule Name -->
          <h2 id="detailName" class="text-2xl font-bold text-gray-900 dark:text-white mb-4"></h2>

          <!-- Time Information -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div class="flex items-center mb-3">
              <svg class="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400" data-i18n="startTime">Start Time</p>
                <p id="detailStartTime" class="font-semibold text-gray-900 dark:text-white"></p>
              </div>
            </div>
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400" data-i18n="endTime">End Time</p>
                <p id="detailEndTime" class="font-semibold text-gray-900 dark:text-white"></p>
              </div>
            </div>
          </div>

          <!-- Day Information -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2" data-i18n="day">Day</h3>
            <p id="detailDay" class="text-lg text-gray-900 dark:text-white"></p>
          </div>

          <!-- Notes Section -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2" data-i18n="notes">Notes</h3>
            <p id="detailNotes" class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap min-h-[80px] p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"></p>
          </div>

          <!-- Duration -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2" data-i18n="duration">Duration</h3>
            <p id="detailDuration" class="text-lg text-gray-900 dark:text-white"></p>
          </div>

          <!-- Tag Information -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2" data-i18n="category">Category</h3>
            <div id="detailTag" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"></div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button id="editDetailBtn" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <span data-i18n="edit">Edit</span>
            </button>
            <button id="deleteDetailBtn" class="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span data-i18n="delete">Delete</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Overlay -->
      <div id="detailOverlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 hidden"></div>
    `;

    document.body.insertAdjacentHTML('beforeend', template);
    this.panel = document.getElementById('detailPanel');
  }

  attachEventListeners() {
    // Close button
    document.getElementById('closeDetailPanel').addEventListener('click', () => this.close());
    
    // Overlay click
    document.getElementById('detailOverlay').addEventListener('click', () => this.close());
    
    // Edit button
    document.getElementById('editDetailBtn').addEventListener('click', () => {
      if (this.onEdit && this.currentSchedule) {
        this.onEdit(this.currentSchedule);
      }
    });
    
    // Delete button
    document.getElementById('deleteDetailBtn').addEventListener('click', () => {
      if (this.onDelete && this.currentSchedule) {
        this.onDelete(this.currentSchedule);
      }
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  show(schedule) {
    this.currentSchedule = schedule;
    
    // Update content
    document.getElementById('detailColorBar').style.backgroundColor = schedule.color;
    document.getElementById('detailName').textContent = schedule.name;
    document.getElementById('detailStartTime').textContent = schedule.startTime;
    document.getElementById('detailEndTime').textContent = schedule.endTime;
    document.getElementById('detailDay').textContent = this.getDayName(schedule.dayOfWeek);
    document.getElementById('detailNotes').textContent = schedule.notes || this.i18n.translate('noNotes') || 'No notes';
    document.getElementById('detailDuration').textContent = this.calculateDuration(schedule.startTime, schedule.endTime);
    
    // Update tag
    const tagElement = document.getElementById('detailTag');
    tagElement.style.backgroundColor = schedule.color + '20'; // 20% opacity
    tagElement.style.color = schedule.color;
    tagElement.textContent = this.getTagLabel(schedule.color);

    // Update i18n for static elements
    this.updateI18n();

    // Show panel
    this.panel.classList.remove('translate-x-full');
    document.getElementById('detailOverlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  close() {
    this.panel.classList.add('translate-x-full');
    document.getElementById('detailOverlay').classList.add('hidden');
    document.body.style.overflow = '';
    this.currentSchedule = null;
  }

  isOpen() {
    return !this.panel.classList.contains('translate-x-full');
  }

  getDayName(dayIndex) {
    const days = [
      this.i18n.translate('monday'),
      this.i18n.translate('tuesday'),
      this.i18n.translate('wednesday'),
      this.i18n.translate('thursday'),
      this.i18n.translate('friday'),
      this.i18n.translate('saturday'),
      this.i18n.translate('sunday')
    ];
    return days[dayIndex] || '';
  }

  calculateDuration(startTime, endTime) {
    const start = DateTimeHelper.timeToMinutes(startTime);
    const end = DateTimeHelper.timeToMinutes(endTime);
    const diff = end - start;
    
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  }

  getTagLabel(color) {
    const colorMap = {
      '#3B82F6': this.i18n.translate('work') || 'Work',
      '#10B981': this.i18n.translate('study') || 'Study',
      '#EF4444': this.i18n.translate('urgent') || 'Urgent',
      '#F59E0B': this.i18n.translate('meeting') || 'Meeting',
      '#8B5CF6': this.i18n.translate('personal') || 'Personal',
      '#F97316': this.i18n.translate('other') || 'Other'
    };
    return colorMap[color] || 'Category';
  }

  updateI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.i18n.translate(key);
    });
  }

  setCallbacks(onEdit, onDelete) {
    this.onEdit = onEdit;
    this.onDelete = onDelete;
  }
}
