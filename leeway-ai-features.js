/**
 * LEEWAY™ AI-Enhanced Features
 *
 * This file implements AI-enhanced features for the Agent Lee CRM:
 * - AI-Assisted To-Dos
 * - AI-Powered Timeline
 * - AI-Generated Business Card
 * - AI-Optimized Email Signature
 */

// Create namespace
window.LeewayAIFeatures = (function() {
  // Private variables
  let _initialized = false;
  let _aiProvider = null;

  /**
   * Initialize AI Features
   * @param {Object} options - Initialization options
   * @returns {Promise<boolean>} - Initialization success
   */
  async function init(options = {}) {
    try {
      // Check if already initialized
      if (_initialized) {
        console.warn('LeewayAIFeatures already initialized');
        return true;
      }

      console.log('Initializing LEEWAY™ AI Features...');

      // Set AI provider
      _aiProvider = window.LeewayAI;

      if (!_aiProvider) {
        console.error('LeewayAI not available. AI features will be limited.');
      }

      // Initialize features
      await Promise.all([
        initToDos(),
        initTimeline(),
        initBusinessCard(),
        initEmailSignature()
      ]);

      // Add event listeners
      _addEventListeners();

      _initialized = true;
      console.log('LEEWAY™ AI Features initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing LEEWAY™ AI Features:', error);
      return false;
    }
  }

  /**
   * Initialize To-Dos feature
   * @private
   * @returns {Promise<void>}
   */
  async function initToDos() {
    console.log('Initializing AI-Assisted To-Dos...');

    // Load existing to-dos
    await loadToDos();

    // Set up voice dictation for to-dos
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoVoiceBtn = document.getElementById('todo-voice-btn');

    if (todoVoiceBtn && window.LeewayTech?.Voice) {
      todoVoiceBtn.addEventListener('click', function() {
        const statusElement = document.getElementById('todo-voice-status') || document.createElement('div');
        statusElement.id = 'todo-voice-status';
        statusElement.className = 'mt-2 text-sm';

        if (!document.getElementById('todo-voice-status')) {
          this.parentNode.appendChild(statusElement);
        }

        // Initialize dictation
        window.LeewayTech.Voice.initDictation({
          onStart: function() {
            statusElement.textContent = 'Listening...';
            todoVoiceBtn.classList.add('bg-red-500');
            todoVoiceBtn.classList.remove('bg-secondary');
          },
          onResult: function(text) {
            statusElement.textContent = text;
          },
          onFinalResult: async function(text) {
            // Process dictation with AI
            statusElement.textContent = 'Processing with AI...';

            try {
              const todoData = await extractTodoFromText(text);

              // Fill todo form with extracted data
              const taskInput = document.getElementById('todo-task');
              const prioritySelect = document.getElementById('todo-priority');
              const dueDateInput = document.getElementById('todo-due-date');
              const relatedInput = document.getElementById('todo-related');
              const notesInput = document.getElementById('todo-notes');

              if (taskInput) taskInput.value = todoData.task;
              if (prioritySelect) prioritySelect.value = todoData.priority;
              if (dueDateInput && todoData.dueDate) dueDateInput.value = todoData.dueDate;
              if (relatedInput) relatedInput.value = todoData.related || '';
              if (notesInput) notesInput.value = todoData.notes || '';

              statusElement.textContent = 'To-do extracted successfully!';
            } catch (error) {
              console.error('Error processing to-do:', error);
              statusElement.textContent = 'Error processing to-do. Please try again.';

              // Still use the raw text as task
              const taskInput = document.getElementById('todo-task');
              if (taskInput) taskInput.value = text;
            }

            // Stop dictation
            window.LeewayTech.Voice.stopDictation();
            todoVoiceBtn.classList.remove('bg-red-500');
            todoVoiceBtn.classList.add('bg-secondary');
          },
          onError: function(error) {
            statusElement.textContent = `Error: ${error}`;
            todoVoiceBtn.classList.remove('bg-red-500');
            todoVoiceBtn.classList.add('bg-secondary');
          },
          onEnd: function() {
            if (!statusElement.textContent.includes('Processing')) {
              statusElement.textContent = 'Dictation ended';
            }
            todoVoiceBtn.classList.remove('bg-red-500');
            todoVoiceBtn.classList.add('bg-secondary');
          }
        });

        window.LeewayTech.Voice.startDictation();
      });
    }

    // Set up add to-do button
    if (addTodoBtn) {
      addTodoBtn.addEventListener('click', function() {
        const modal = document.getElementById('add-todo-modal');
        if (modal) {
          modal.classList.remove('hidden');

          // Set default due date to tomorrow
          const dueDateInput = document.getElementById('todo-due-date');
          if (dueDateInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const year = tomorrow.getFullYear();
            const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
            const day = String(tomorrow.getDate()).padStart(2, '0');

            dueDateInput.value = `${year}-${month}-${day}`;
          }
        }
      });
    }

    // Set up voice input for to-do
    const todoVoiceBtn = document.getElementById('todo-voice-btn');

    if (todoVoiceBtn && window.LeewayTech?.Voice) {
      todoVoiceBtn.addEventListener('click', function() {
        const statusElement = document.getElementById('todo-voice-status') || document.createElement('div');
        statusElement.id = 'todo-voice-status';
        statusElement.className = 'mt-2 text-sm';

        if (!document.getElementById('todo-voice-status')) {
          this.parentNode.appendChild(statusElement);
        }

        // Initialize dictation
        window.LeewayTech.Voice.initDictation({
          onStart: function() {
            statusElement.textContent = 'Listening...';
            todoVoiceBtn.classList.add('bg-red-500');
            todoVoiceBtn.classList.remove('bg-secondary');
          },
          onResult: function(text) {
            statusElement.textContent = text;
          },
          onFinalResult: async function(text) {
            // Process dictation with AI
            statusElement.textContent = 'Processing with AI...';

            try {
              // Extract to-do from text
              const todoData = await extractTodoFromText(text);

              // Fill form with extracted data
              const taskInput = document.getElementById('todo-task');
              const prioritySelect = document.getElementById('todo-priority');
              const dueDateInput = document.getElementById('todo-due-date');
              const relatedInput = document.getElementById('todo-related');
              const notesInput = document.getElementById('todo-notes');

              if (taskInput && todoData.task) taskInput.value = todoData.task;
              if (prioritySelect && todoData.priority) prioritySelect.value = todoData.priority;
              if (dueDateInput && todoData.dueDate) dueDateInput.value = todoData.dueDate;
              if (relatedInput && todoData.related) relatedInput.value = todoData.related;
              if (notesInput && todoData.notes) notesInput.value = todoData.notes;

              statusElement.textContent = 'To-do extracted successfully!';
            } catch (error) {
              console.error('Error processing to-do text:', error);

              // Just use the text as the task
              const taskInput = document.getElementById('todo-task');
              if (taskInput) taskInput.value = text;

              statusElement.textContent = 'Text added as task.';
            }

            // Stop dictation
            window.LeewayTech.Voice.stopDictation();
            todoVoiceBtn.classList.remove('bg-red-500');
            todoVoiceBtn.classList.add('bg-secondary');
          },
          onError: function(error) {
            statusElement.textContent = `Error: ${error}`;
            todoVoiceBtn.classList.remove('bg-red-500');
            todoVoiceBtn.classList.add('bg-secondary');
          },
          onEnd: function() {
            if (!statusElement.textContent.includes('Processing')) {
              statusElement.textContent = 'Dictation ended';
            }
            todoVoiceBtn.classList.remove('bg-red-500');
            todoVoiceBtn.classList.add('bg-secondary');
          }
        });

        window.LeewayTech.Voice.startDictation();
      });
    }

    // Set up to-do form submission
    const todoForm = document.getElementById('todo-form');
    if (todoForm) {
      todoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveToDo();
      });
    }

    // Set up to-do search
    const todoSearch = document.getElementById('todos-search');
    if (todoSearch) {
      todoSearch.addEventListener('input', function() {
        filterToDos();
      });
    }

    // Set up to-do filter
    const todoFilter = document.getElementById('todos-filter');
    if (todoFilter) {
      todoFilter.addEventListener('change', function() {
        filterToDos();
      });
    }

    // Set up modal close buttons
    const closeTodoModal = document.getElementById('close-todo-modal');
    const cancelTodoBtn = document.getElementById('cancel-todo-btn');
    const todoModalBackdrop = document.getElementById('todo-modal-backdrop');

    [closeTodoModal, cancelTodoBtn, todoModalBackdrop].forEach(element => {
      if (element) {
        element.addEventListener('click', function() {
          const modal = document.getElementById('add-todo-modal');
          if (modal) {
            modal.classList.add('hidden');
          }
        });
      }
    });
  }

  /**
   * Save a to-do
   */
  async function saveToDo() {
    try {
      const taskInput = document.getElementById('todo-task');
      const prioritySelect = document.getElementById('todo-priority');
      const dueDateInput = document.getElementById('todo-due-date');
      const relatedInput = document.getElementById('todo-related');
      const notesInput = document.getElementById('todo-notes');

      if (!taskInput || !prioritySelect) {
        console.error('Missing required form elements');
        return;
      }

      const task = taskInput.value.trim();
      const priority = prioritySelect.value;
      const dueDate = dueDateInput ? dueDateInput.value : '';
      const related = relatedInput ? relatedInput.value.trim() : '';
      const notes = notesInput ? notesInput.value.trim() : '';

      if (!task) {
        alert('Please enter a task');
        return;
      }

      // Create to-do object
      const todo = {
        id: 'todo_' + Date.now(),
        task,
        priority,
        dueDate,
        related,
        notes,
        completed: false,
        createdAt: new Date().toISOString()
      };

      // Save to IndexedDB
      const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
      let todos = await idbKeyval.get('todos', dbPromise) || [];
      todos.push(todo);
      await idbKeyval.set('todos', todos, dbPromise);

      // Close modal
      const modal = document.getElementById('add-todo-modal');
      if (modal) {
        modal.classList.add('hidden');
      }

      // Reset form
      if (taskInput) taskInput.value = '';
      if (notesInput) notesInput.value = '';
      if (relatedInput) relatedInput.value = '';

      // Reload to-dos
      await loadToDos();

      // Add to timeline
      await addToTimeline({
        type: 'note',
        title: 'Added To-Do: ' + task,
        description: `Added a new ${priority} priority to-do${dueDate ? ' due on ' + new Date(dueDate).toLocaleDateString() : ''}.`,
        related: related || 'To-Do Management',
        subtype: 'To-Do Created'
      });
    } catch (error) {
      console.error('Error saving to-do:', error);
    }
  }

  /**
   * Filter to-dos based on search and filter
   */
  async function filterToDos() {
    try {
      const searchInput = document.getElementById('todos-search');
      const filterSelect = document.getElementById('todos-filter');

      if (!searchInput || !filterSelect) return;

      const searchTerm = searchInput.value.toLowerCase();
      const filterValue = filterSelect.value;

      // Get to-dos from IndexedDB
      const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
      let todos = await idbKeyval.get('todos', dbPromise) || [];

      // Filter to-dos
      let filteredTodos = todos;

      // Apply completion filter
      if (filterValue === 'pending') {
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
      } else if (filterValue === 'completed') {
        filteredTodos = filteredTodos.filter(todo => todo.completed);
      }

      // Apply priority filter
      if (filterValue === 'high') {
        filteredTodos = filteredTodos.filter(todo => todo.priority === 'High');
      } else if (filterValue === 'medium') {
        filteredTodos = filteredTodos.filter(todo => todo.priority === 'Medium');
      } else if (filterValue === 'low') {
        filteredTodos = filteredTodos.filter(todo => todo.priority === 'Low');
      }

      // Apply search filter
      if (searchTerm) {
        filteredTodos = filteredTodos.filter(todo =>
          todo.task.toLowerCase().includes(searchTerm) ||
          (todo.notes && todo.notes.toLowerCase().includes(searchTerm)) ||
          (todo.related && todo.related.toLowerCase().includes(searchTerm))
        );
      }

      // Sort filtered to-dos
      filteredTodos.sort((a, b) => {
        // First sort by completion status
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }

        // Then sort by priority
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }

        // Then sort by due date
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }

        // If one has a due date and the other doesn't
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;

        // Finally sort by creation date
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      // Render filtered to-dos
      renderToDos(filteredTodos);
    } catch (error) {
      console.error('Error filtering to-dos:', error);
    }
  }

  /**
   * Toggle to-do completion status
   * @param {string} todoId - The to-do ID
   * @param {boolean} completed - The completion status
   */
  async function toggleTodoCompletion(todoId, completed) {
    try {
      // Get to-dos from IndexedDB
      const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
      let todos = await idbKeyval.get('todos', dbPromise) || [];

      // Find and update the to-do
      const todoIndex = todos.findIndex(todo => todo.id === todoId);

      if (todoIndex !== -1) {
        todos[todoIndex].completed = completed;

        // Save to IndexedDB
        await idbKeyval.set('todos', todos, dbPromise);

        // Reload to-dos
        await loadToDos();

        // Add to timeline
        await addToTimeline({
          type: 'note',
          title: `${completed ? 'Completed' : 'Reopened'} To-Do: ${todos[todoIndex].task}`,
          description: `${completed ? 'Marked as completed' : 'Marked as pending'}: ${todos[todoIndex].task}`,
          related: todos[todoIndex].related || 'To-Do Management',
          subtype: completed ? 'To-Do Completed' : 'To-Do Reopened'
        });
      }
    } catch (error) {
      console.error('Error toggling to-do completion:', error);
    }
  }

  /**
   * Delete a to-do
   * @param {string} todoId - The to-do ID
   */
  async function deleteTodo(todoId) {
    try {
      // Confirm deletion
      if (!confirm('Are you sure you want to delete this to-do?')) {
        return;
      }

      // Get to-dos from IndexedDB
      const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
      let todos = await idbKeyval.get('todos', dbPromise) || [];

      // Find the to-do
      const todoIndex = todos.findIndex(todo => todo.id === todoId);

      if (todoIndex !== -1) {
        const deletedTodo = todos[todoIndex];

        // Remove the to-do
        todos.splice(todoIndex, 1);

        // Save to IndexedDB
        await idbKeyval.set('todos', todos, dbPromise);

        // Reload to-dos
        await loadToDos();

        // Add to timeline
        await addToTimeline({
          type: 'note',
          title: `Deleted To-Do: ${deletedTodo.task}`,
          description: `Deleted to-do: ${deletedTodo.task}`,
          related: deletedTodo.related || 'To-Do Management',
          subtype: 'To-Do Deleted'
        });
      }
    } catch (error) {
      console.error('Error deleting to-do:', error);
    }
  }

  /**
   * Edit a to-do
   * @param {string} todoId - The to-do ID
   */
  async function editTodo(todoId) {
    try {
      // Get to-dos from IndexedDB
      const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
      let todos = await idbKeyval.get('todos', dbPromise) || [];

      // Find the to-do
      const todo = todos.find(todo => todo.id === todoId);

      if (!todo) {
        console.error('To-do not found:', todoId);
        return;
      }

      // Open the modal
      const modal = document.getElementById('add-todo-modal');
      if (!modal) {
        console.error('Modal not found');
        return;
      }

      // Update modal title
      const modalTitle = document.getElementById('todo-modal-title');
      if (modalTitle) {
        modalTitle.textContent = 'Edit To-Do';
      }

      // Fill form with to-do data
      const taskInput = document.getElementById('todo-task');
      const prioritySelect = document.getElementById('todo-priority');
      const dueDateInput = document.getElementById('todo-due-date');
      const relatedInput = document.getElementById('todo-related');
      const notesInput = document.getElementById('todo-notes');

      if (taskInput) taskInput.value = todo.task;
      if (prioritySelect) prioritySelect.value = todo.priority;
      if (dueDateInput) dueDateInput.value = todo.dueDate || '';
      if (relatedInput) relatedInput.value = todo.related || '';
      if (notesInput) notesInput.value = todo.notes || '';

      // Store the to-do ID in a data attribute
      const todoForm = document.getElementById('todo-form');
      if (todoForm) {
        todoForm.dataset.todoId = todoId;
      }

      // Show the modal
      modal.classList.remove('hidden');

      // Update save button handler
      const saveBtn = document.getElementById('save-todo-btn');
      if (saveBtn) {
        // Remove existing event listeners
        const newSaveBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

        // Add new event listener
        newSaveBtn.addEventListener('click', function(e) {
          e.preventDefault();
          updateTodo(todoId);
        });
      }
    } catch (error) {
      console.error('Error editing to-do:', error);
    }
  }

  /**
   * Update a to-do
   * @param {string} todoId - The to-do ID
   */
  async function updateTodo(todoId) {
    try {
      // Get form data
      const taskInput = document.getElementById('todo-task');
      const prioritySelect = document.getElementById('todo-priority');
      const dueDateInput = document.getElementById('todo-due-date');
      const relatedInput = document.getElementById('todo-related');
      const notesInput = document.getElementById('todo-notes');

      if (!taskInput || !prioritySelect) {
        console.error('Missing required form elements');
        return;
      }

      const task = taskInput.value.trim();
      const priority = prioritySelect.value;
      const dueDate = dueDateInput ? dueDateInput.value : '';
      const related = relatedInput ? relatedInput.value.trim() : '';
      const notes = notesInput ? notesInput.value.trim() : '';

      if (!task) {
        alert('Please enter a task');
        return;
      }

      // Get to-dos from IndexedDB
      const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
      let todos = await idbKeyval.get('todos', dbPromise) || [];

      // Find the to-do
      const todoIndex = todos.findIndex(todo => todo.id === todoId);

      if (todoIndex !== -1) {
        // Update to-do
        const updatedTodo = {
          ...todos[todoIndex],
          task,
          priority,
          dueDate,
          related,
          notes,
          updatedAt: new Date().toISOString()
        };

        // Save to IndexedDB
        todos[todoIndex] = updatedTodo;
        await idbKeyval.set('todos', todos, dbPromise);

        // Close modal
        const modal = document.getElementById('add-todo-modal');
        if (modal) {
          modal.classList.add('hidden');
        }

        // Reset form
        if (taskInput) taskInput.value = '';
        if (notesInput) notesInput.value = '';
        if (relatedInput) relatedInput.value = '';

        // Reset modal title
        const modalTitle = document.getElementById('todo-modal-title');
        if (modalTitle) {
          modalTitle.textContent = 'Add New To-Do';
        }

        // Reset save button handler
        const saveBtn = document.getElementById('save-todo-btn');
        if (saveBtn) {
          // Remove existing event listeners
          const newSaveBtn = saveBtn.cloneNode(true);
          saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

          // Add new event listener for adding new to-dos
          const todoForm = document.getElementById('todo-form');
          if (todoForm) {
            todoForm.removeAttribute('data-todo-id');
            todoForm.addEventListener('submit', function(e) {
              e.preventDefault();
              saveToDo();
            });
          }
        }

        // Reload to-dos
        await loadToDos();

        // Add to timeline
        await addToTimeline({
          type: 'note',
          title: `Updated To-Do: ${task}`,
          description: `Updated to-do: ${task}`,
          related: related || 'To-Do Management',
          subtype: 'To-Do Updated'
        });
      }
    } catch (error) {
      console.error('Error updating to-do:', error);
    }
  }

  /**
   * Initialize Timeline feature
   * @private
   * @returns {Promise<void>}
   */
  async function initTimeline() {
    console.log('Initializing AI-Powered Timeline...');

    // Load existing timeline events
    await loadTimeline();

    // Set up timeline event form
    const addTimelineBtn = document.getElementById('add-timeline-btn');
    const timelineVoiceBtn = document.getElementById('timeline-voice-btn');

    if (timelineVoiceBtn && window.LeewayTech?.Voice) {
      timelineVoiceBtn.addEventListener('click', function() {
        const statusElement = document.getElementById('timeline-voice-status') || document.createElement('div');
        statusElement.id = 'timeline-voice-status';
        statusElement.className = 'mt-2 text-sm';

        if (!document.getElementById('timeline-voice-status')) {
          this.parentNode.appendChild(statusElement);
        }

        // Initialize dictation
        window.LeewayTech.Voice.initDictation({
          onStart: function() {
            statusElement.textContent = 'Listening...';
            timelineVoiceBtn.classList.add('bg-red-500');
            timelineVoiceBtn.classList.remove('bg-secondary');
          },
          onResult: function(text) {
            statusElement.textContent = text;
          },
          onFinalResult: async function(text) {
            // Process dictation with AI
            statusElement.textContent = 'Processing with AI...';

            try {
              // Fill timeline description with text
              const descriptionInput = document.getElementById('timeline-description');
              if (descriptionInput) descriptionInput.value = text;

              statusElement.textContent = 'Text added successfully!';
            } catch (error) {
              console.error('Error processing timeline text:', error);
              statusElement.textContent = 'Error processing text. Please try again.';
            }

            // Stop dictation
            window.LeewayTech.Voice.stopDictation();
            timelineVoiceBtn.classList.remove('bg-red-500');
            timelineVoiceBtn.classList.add('bg-secondary');
          },
          onError: function(error) {
            statusElement.textContent = `Error: ${error}`;
            timelineVoiceBtn.classList.remove('bg-red-500');
            timelineVoiceBtn.classList.add('bg-secondary');
          },
          onEnd: function() {
            if (!statusElement.textContent.includes('Processing')) {
              statusElement.textContent = 'Dictation ended';
            }
            timelineVoiceBtn.classList.remove('bg-red-500');
            timelineVoiceBtn.classList.add('bg-secondary');
          }
        });

        window.LeewayTech.Voice.startDictation();
      });
    }

    // Set up add timeline button
    if (addTimelineBtn) {
      addTimelineBtn.addEventListener('click', function() {
        const modal = document.getElementById('add-timeline-modal');
        if (modal) {
          modal.classList.remove('hidden');

          // Set default date to today
          const dateInput = document.getElementById('timeline-date');
          if (dateInput) {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');

            dateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
          }
        }
      });
    }

    // Set up timeline form submission
    const timelineForm = document.getElementById('timeline-form');
    if (timelineForm) {
      timelineForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addTimelineEvent();
      });
    }

    // Set up modal close buttons
    const closeTimelineModal = document.getElementById('close-timeline-modal');
    const cancelTimelineBtn = document.getElementById('cancel-timeline-btn');
    const timelineModalBackdrop = document.getElementById('timeline-modal-backdrop');

    [closeTimelineModal, cancelTimelineBtn, timelineModalBackdrop].forEach(element => {
      if (element) {
        element.addEventListener('click', function() {
          const modal = document.getElementById('add-timeline-modal');
          if (modal) {
            modal.classList.add('hidden');
          }
        });
      }
    });
  }

  /**
   * Add a timeline event
   */
  async function addTimelineEvent() {
    try {
      const typeSelect = document.getElementById('timeline-type');
      const dateInput = document.getElementById('timeline-date');
      const titleInput = document.getElementById('timeline-title');
      const descriptionInput = document.getElementById('timeline-description');
      const relatedInput = document.getElementById('timeline-related');

      if (!typeSelect || !dateInput || !titleInput || !descriptionInput) {
        console.error('Missing required form elements');
        return;
      }

      const type = typeSelect.value;
      const timestamp = dateInput.value ? new Date(dateInput.value).toISOString() : new Date().toISOString();
      const title = titleInput.value.trim();
      const description = descriptionInput.value.trim();
      const related = relatedInput ? relatedInput.value.trim() : '';

      if (!title) {
        alert('Please enter a title for the event');
        return;
      }

      // Create event object
      const event = {
        id: 'event_' + Date.now(),
        type,
        title,
        description,
        timestamp,
        related,
        subtype: getSubtypeForEventType(type)
      };

      // Add to timeline
      await addToTimeline(event);

      // Close modal
      const modal = document.getElementById('add-timeline-modal');
      if (modal) {
        modal.classList.add('hidden');
      }

      // Reset form
      if (titleInput) titleInput.value = '';
      if (descriptionInput) descriptionInput.value = '';
      if (relatedInput) relatedInput.value = '';

      // Reload timeline
      await loadTimeline();
    } catch (error) {
      console.error('Error adding timeline event:', error);
    }
  }

  /**
   * Get subtype for event type
   * @param {string} type - Event type
   * @returns {string} - Event subtype
   */
  function getSubtypeForEventType(type) {
    switch (type) {
      case 'call':
        return 'Outgoing Call';
      case 'email':
        return 'Outgoing Email';
      case 'meeting':
        return 'In-Person Meeting';
      case 'visit':
        return 'Store Visit';
      case 'note':
        return 'Note';
      default:
        return '';
    }
  }

  /**
   * Add an event to the timeline
   * @param {Object} event - The event to add
   * @returns {Promise<void>}
   */
  async function addToTimeline(event) {
    try {
      const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
      let timeline = await idbKeyval.get('timeline', dbPromise) || [];

      // Add timestamp if not provided
      if (!event.timestamp) {
        event.timestamp = new Date().toISOString();
      }

      // Add ID if not provided
      if (!event.id) {
        event.id = 'event_' + Date.now();
      }

      // Add to timeline
      timeline.push(event);

      // Save to IndexedDB
      await idbKeyval.set('timeline', timeline, dbPromise);

      console.log('Added to timeline:', event);

      // Update timeline UI if visible
      const timelineTab = document.getElementById('timeline-tab');
      if (timelineTab && !timelineTab.classList.contains('hidden')) {
        loadTimeline();
      }
    } catch (error) {
      console.error('Error adding to timeline:', error);
    }
  }

  /**
   * Load timeline events from IndexedDB
   * @returns {Promise<Array>} - Array of timeline events
   */
  async function loadTimeline() {
    try {
      const timelineEvents = document.getElementById('timeline-events');
      if (!timelineEvents) return [];

      // Show loading state
      timelineEvents.innerHTML = `
        <div class="animate-pulse space-y-6">
          <div class="flex">
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-dark-200 dark:bg-dark-600 flex items-center justify-center z-10"></div>
            <div class="ml-4 flex-grow">
              <div class="bg-white dark:bg-dark-700 rounded-xl p-4 shadow-sm">
                <div class="h-5 bg-dark-200 dark:bg-dark-600 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-dark-200 dark:bg-dark-600 rounded w-1/2 mb-2"></div>
                <div class="h-4 bg-dark-200 dark:bg-dark-600 rounded w-1/4"></div>
              </div>
            </div>
          </div>
          <div class="flex">
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-dark-200 dark:bg-dark-600 flex items-center justify-center z-10"></div>
            <div class="ml-4 flex-grow">
              <div class="bg-white dark:bg-dark-700 rounded-xl p-4 shadow-sm">
                <div class="h-5 bg-dark-200 dark:bg-dark-600 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-dark-200 dark:bg-dark-600 rounded w-1/2 mb-2"></div>
                <div class="h-4 bg-dark-200 dark:bg-dark-600 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Get timeline from IndexedDB
      const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
      let timeline = await idbKeyval.get('timeline', dbPromise) || [];

      // If no timeline exists, create sample timeline
      if (timeline.length === 0) {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(now);
        lastWeek.setDate(lastWeek.getDate() - 7);

        timeline = [
          {
            id: 'event_1',
            type: 'call',
            title: 'Call with Rushmor Records',
            description: 'Discussed new inventory needs and upcoming promotions',
            timestamp: yesterday.toISOString(),
            related: 'Rushmor Records',
            subtype: 'Outgoing Call'
          },
          {
            id: 'event_2',
            type: 'email',
            title: 'Sent catalog to Milwaukee Music Store',
            description: 'Shared updated product catalog with new guitar models',
            timestamp: lastWeek.toISOString(),
            related: 'Milwaukee Music Store',
            subtype: 'Outgoing Email'
          },
          {
            id: 'event_3',
            type: 'meeting',
            title: 'Meeting with Sarah Johnson',
            description: 'Discussed partnership opportunities for upcoming music festival',
            timestamp: lastWeek.toISOString(),
            related: 'Sarah Johnson',
            subtype: 'In-Person Meeting'
          }
        ];

        // Save sample timeline to IndexedDB
        await idbKeyval.set('timeline', timeline, dbPromise);
      }

      // Sort timeline by timestamp (newest first)
      timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      // Render timeline
      renderTimeline(timeline);

      return timeline;
    } catch (error) {
      console.error('Error loading timeline:', error);
      return [];
    }
  }

  /**
   * Render timeline in the UI
   * @param {Array} timeline - Array of timeline events
   */
  function renderTimeline(timeline) {
    const timelineEvents = document.getElementById('timeline-events');
    if (!timelineEvents) return;

    if (timeline.length === 0) {
      timelineEvents.innerHTML = `
        <div class="text-center p-6 text-dark-500 dark:text-dark-400">
          No timeline events found. Your activity will appear here.
        </div>
      `;
      return;
    }

    timelineEvents.innerHTML = '';

    // Group events by date
    const groupedEvents = groupEventsByDate(timeline);

    // Render each date group
    Object.keys(groupedEvents).forEach(dateKey => {
      const dateEvents = groupedEvents[dateKey];

      // Add date header
      const dateHeader = document.createElement('div');
      dateHeader.className = 'flex items-center mb-4 mt-8 first:mt-0';
      dateHeader.innerHTML = `
        <div class="flex-shrink-0 w-12 flex justify-center">
          <div class="w-3 h-3 bg-primary rounded-full z-10"></div>
        </div>
        <div class="ml-4">
          <h3 class="text-sm font-bold text-dark-700 dark:text-dark-300">${dateKey}</h3>
        </div>
      `;
      timelineEvents.appendChild(dateHeader);

      // Add events for this date
      dateEvents.forEach(event => {
        const eventElement = createTimelineEventElement(event);
        timelineEvents.appendChild(eventElement);
      });
    });
  }

  /**
   * Group timeline events by date
   * @param {Array} events - Array of timeline events
   * @returns {Object} - Object with dates as keys and arrays of events as values
   */
  function groupEventsByDate(events) {
    const grouped = {};

    events.forEach(event => {
      const date = new Date(event.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let dateKey;

      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      } else {
        dateKey = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(event);
    });

    return grouped;
  }

  /**
   * Create a timeline event element
   * @param {Object} event - The timeline event
   * @returns {HTMLElement} - The timeline event element
   */
  function createTimelineEventElement(event) {
    const eventElement = document.createElement('div');
    eventElement.className = 'flex mb-6 last:mb-0';
    eventElement.dataset.eventId = event.id;

    // Get icon and color based on event type
    const { icon, bgColor, textColor } = getEventTypeStyles(event.type);

    // Format time
    const eventTime = new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    eventElement.innerHTML = `
      <div class="flex-shrink-0 w-12 flex justify-center">
        <div class="w-10 h-10 rounded-full ${bgColor} flex items-center justify-center z-10">
          ${icon}
        </div>
      </div>
      <div class="ml-4 flex-grow">
        <div class="bg-white dark:bg-dark-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start mb-2">
            <h4 class="font-medium text-dark-900 dark:text-white">${event.title}</h4>
            <span class="text-xs text-dark-500 dark:text-dark-400">${eventTime}</span>
          </div>
          <p class="text-sm text-dark-700 dark:text-dark-300 mb-2">${event.description}</p>
          <div class="flex flex-wrap gap-2 mt-3">
            ${event.subtype ? `<span class="text-xs px-2 py-0.5 rounded-full ${textColor} ${bgColor}/20">${event.subtype}</span>` : ''}
            ${event.related ? `<span class="text-xs px-2 py-0.5 rounded-full bg-dark-100 dark:bg-dark-600 text-dark-700 dark:text-dark-300">Related to: ${event.related}</span>` : ''}
          </div>
        </div>
      </div>
    `;

    return eventElement;
  }

  /**
   * Get icon and color for event type
   * @param {string} type - The event type
   * @returns {Object} - Object with icon and color
   */
  function getEventTypeStyles(type) {
    switch (type.toLowerCase()) {
      case 'call':
        return {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>`,
          bgColor: 'bg-blue-500',
          textColor: 'text-blue-700 dark:text-blue-300'
        };
      case 'email':
        return {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>`,
          bgColor: 'bg-purple-500',
          textColor: 'text-purple-700 dark:text-purple-300'
        };
      case 'meeting':
        return {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>`,
          bgColor: 'bg-green-500',
          textColor: 'text-green-700 dark:text-green-300'
        };
      case 'visit':
        return {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>`,
          bgColor: 'bg-amber-500',
          textColor: 'text-amber-700 dark:text-amber-300'
        };
      case 'note':
        return {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>`,
          bgColor: 'bg-indigo-500',
          textColor: 'text-indigo-700 dark:text-indigo-300'
        };
      default:
        return {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>`,
          bgColor: 'bg-gray-500',
          textColor: 'text-gray-700 dark:text-gray-300'
        };
    }
  }

  /**
   * Initialize Timeline feature
   * @private
   * @returns {Promise<void>}
   */
  async function initTimeline() {
    console.log('Initializing AI-Powered Timeline...');

    // Load existing timeline events
    await loadTimeline();

    // Set up add event button
    const addEventBtn = document.getElementById('add-event-btn');
    if (addEventBtn) {
      addEventBtn.addEventListener('click', function() {
        const modal = document.getElementById('add-event-modal');
        if (modal) {
          modal.classList.remove('hidden');
        }
      });
    }

    // Set up event form submission
    const eventForm = document.getElementById('event-form');
    if (eventForm) {
      eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveTimelineEvent();
      });
    }

    // Set up event search
    const eventSearch = document.getElementById('timeline-search');
    if (eventSearch) {
      eventSearch.addEventListener('input', function() {
        filterTimelineEvents();
      });
    }

    // Set up event filter
    const eventFilter = document.getElementById('timeline-filter');
    if (eventFilter) {
      eventFilter.addEventListener('change', function() {
        filterTimelineEvents();
      });
    }

    // Set up modal close buttons
    const closeEventModal = document.getElementById('close-event-modal');
    const cancelEventBtn = document.getElementById('cancel-event-btn');
    const eventModalBackdrop = document.getElementById('event-modal-backdrop');

    [closeEventModal, cancelEventBtn, eventModalBackdrop].forEach(element => {
      if (element) {
        element.addEventListener('click', function() {
          const modal = document.getElementById('add-event-modal');
          if (modal) {
            modal.classList.add('hidden');
          }
        });
      }
    });

    // Set up voice input for event
    const eventVoiceBtn = document.getElementById('event-voice-btn');
    if (eventVoiceBtn && window.LeewayTech?.Voice) {
      eventVoiceBtn.addEventListener('click', function() {
        const statusElement = document.getElementById('event-voice-status') || document.createElement('div');
        statusElement.id = 'event-voice-status';
        statusElement.className = 'mt-2 text-sm';

        if (!document.getElementById('event-voice-status')) {
          this.parentNode.appendChild(statusElement);
        }

        // Initialize dictation
        window.LeewayTech.Voice.initDictation({
          onStart: function() {
            statusElement.textContent = 'Listening...';
            eventVoiceBtn.classList.add('bg-red-500');
            eventVoiceBtn.classList.remove('bg-secondary');
          },
          onResult: function(text) {
            statusElement.textContent = text;
          },
          onFinalResult: async function(text) {
            // Process dictation with AI
            statusElement.textContent = 'Processing with AI...';

            try {
              // Extract event from text
              const eventData = await extractEventFromText(text);

              // Fill form with extracted data
              const titleInput = document.getElementById('event-title');
              const descriptionInput = document.getElementById('event-description');
              const typeSelect = document.getElementById('event-type');
              const relatedInput = document.getElementById('event-related');

              if (titleInput && eventData.title) titleInput.value = eventData.title;
              if (descriptionInput && eventData.description) descriptionInput.value = eventData.description;
              if (typeSelect && eventData.type) typeSelect.value = eventData.type;
              if (relatedInput && eventData.related) relatedInput.value = eventData.related;

              statusElement.textContent = 'Event extracted successfully!';
            } catch (error) {
              console.error('Error processing event text:', error);

              // Just use the text as the description
              const descriptionInput = document.getElementById('event-description');
              if (descriptionInput) descriptionInput.value = text;

              statusElement.textContent = 'Text added as description.';
            }

            // Stop dictation
            window.LeewayTech.Voice.stopDictation();
            eventVoiceBtn.classList.remove('bg-red-500');
            eventVoiceBtn.classList.add('bg-secondary');
          },
          onError: function(error) {
            statusElement.textContent = `Error: ${error}`;
            eventVoiceBtn.classList.remove('bg-red-500');
            eventVoiceBtn.classList.add('bg-secondary');
          },
          onEnd: function() {
            if (!statusElement.textContent.includes('Processing')) {
              statusElement.textContent = 'Dictation ended';
            }
            eventVoiceBtn.classList.remove('bg-red-500');
            eventVoiceBtn.classList.add('bg-secondary');
          }
        });

        window.LeewayTech.Voice.startDictation();
      });
    }
  }

  /**
   * Save a timeline event
   */
  async function saveTimelineEvent() {
    try {
      const titleInput = document.getElementById('event-title');
      const descriptionInput = document.getElementById('event-description');
      const typeSelect = document.getElementById('event-type');
      const relatedInput = document.getElementById('event-related');
      const subtypeInput = document.getElementById('event-subtype');

      if (!titleInput || !descriptionInput || !typeSelect) {
        console.error('Missing required form elements');
        return;
      }

      const title = titleInput.value.trim();
      const description = descriptionInput.value.trim();
      const type = typeSelect.value;
      const related = relatedInput ? relatedInput.value.trim() : '';
      const subtype = subtypeInput ? subtypeInput.value.trim() : '';

      if (!title || !description) {
        alert('Please enter a title and description');
        return;
      }

      // Create event object
      const event = {
        id: 'event_' + Date.now(),
        title,
        description,
        type,
        related,
        subtype,
        timestamp: new Date().toISOString()
      };

      // Add to timeline
      await addToTimeline(event);

      // Close modal
      const modal = document.getElementById('add-event-modal');
      if (modal) {
        modal.classList.add('hidden');
      }

      // Reset form
      if (titleInput) titleInput.value = '';
      if (descriptionInput) descriptionInput.value = '';
      if (relatedInput) relatedInput.value = '';
      if (subtypeInput) subtypeInput.value = '';
    } catch (error) {
      console.error('Error saving timeline event:', error);
    }
  }

  /**
   * Filter timeline events based on search and filter
   */
  async function filterTimelineEvents() {
    try {
      const searchInput = document.getElementById('timeline-search');
      const filterSelect = document.getElementById('timeline-filter');

      if (!searchInput || !filterSelect) return;

      const searchTerm = searchInput.value.toLowerCase();
      const filterValue = filterSelect.value;

      // Get timeline from IndexedDB
      const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
      let timeline = await idbKeyval.get('timeline', dbPromise) || [];

      // Filter timeline
      let filteredEvents = timeline;

      // Apply type filter
      if (filterValue !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.type === filterValue);
      }

      // Apply search filter
      if (searchTerm) {
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm) ||
          (event.related && event.related.toLowerCase().includes(searchTerm))
        );
      }

      // Sort filtered events by timestamp (newest first)
      filteredEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      // Render filtered events
      renderTimeline(filteredEvents);
    } catch (error) {
      console.error('Error filtering timeline events:', error);
    }
  }

  /**
   * Extract event data from text using AI
   * @param {string} text - The text to extract event data from
   * @returns {Promise<Object>} - The extracted event data
   */
  async function extractEventFromText(text) {
    // Default event data
    const defaultEventData = {
      title: '',
      description: text,
      type: 'note',
      related: '',
      subtype: ''
    };

    // If AI is not available, return default
    if (!_aiProvider) {
      // Try to extract a title from the first sentence
      const firstSentence = text.split(/[.!?][\s\n]/)[0];
      if (firstSentence && firstSentence.length < 60) {
        defaultEventData.title = firstSentence;
        if (text.length > firstSentence.length + 1) {
          defaultEventData.description = text.substring(firstSentence.length + 1).trim();
        }
      }

      return defaultEventData;
    }

    try {
      // Use AI to extract event data
      const prompt = `Extract event information from the following text. Return a JSON object with title, description, type (one of: note, call, email, meeting, visit), related (person or entity related to the event), and subtype (specific category of the event type).

Text: ${text}

JSON:`;

      const response = await _aiProvider.generateText(prompt);
      const eventData = JSON.parse(response);

      return {
        title: eventData.title || defaultEventData.title,
        description: eventData.description || defaultEventData.description,
        type: eventData.type || defaultEventData.type,
        related: eventData.related || defaultEventData.related,
        subtype: eventData.subtype || defaultEventData.subtype
      };
    } catch (error) {
      console.error('Error extracting event data:', error);
      return defaultEventData;
    }
  }

  /**
   * Initialize Business Card feature
   * @private
   * @returns {Promise<void>}
   */
  async function initBusinessCard() {
    console.log('Initializing AI-Generated Business Card...');

    // Load business card data
    await loadBusinessCard();

    // Set up business card generation
    const generateCardBtn = document.getElementById('generate-card-btn');

    if (generateCardBtn) {
      generateCardBtn.addEventListener('click', generateBusinessCard);
    }

    // Set up save card button
    const saveCardBtn = document.getElementById('save-card-btn');
    if (saveCardBtn) {
      saveCardBtn.addEventListener('click', function() {
        const modal = document.getElementById('save-card-modal');
        if (modal) {
          modal.classList.remove('hidden');
        }
      });
    }

    // Set up save card form
    const saveCardForm = document.getElementById('save-card-form');
    if (saveCardForm) {
      saveCardForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveBusinessCard();
      });
    }

    // Set up modal close buttons
    const closeCardModal = document.getElementById('close-card-modal');
    const cancelSaveCardBtn = document.getElementById('cancel-save-card-btn');
    const cardModalBackdrop = document.getElementById('card-modal-backdrop');

    [closeCardModal, cancelSaveCardBtn, cardModalBackdrop].forEach(element => {
      if (element) {
        element.addEventListener('click', function() {
          const modal = document.getElementById('save-card-modal');
          if (modal) {
            modal.classList.add('hidden');
          }
        });
      }
    });
  }

  /**
   * Generate a business card
   */
  async function generateBusinessCard() {
    try {
      const cardPreview = document.getElementById('card-preview');
      const cardDetails = document.getElementById('card-details');
      const audienceSelect = document.getElementById('card-audience');

      if (!cardPreview || !cardDetails || !audienceSelect) {
        console.error('Missing required elements');
        return;
      }

      // Show loading state
      cardPreview.innerHTML = `
        <div class="absolute inset-0 bg-white dark:bg-dark-800 flex items-center justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      `;

      cardDetails.innerHTML = `
        <div class="animate-pulse space-y-4">
          <div class="h-6 bg-dark-200 dark:bg-dark-600 rounded w-3/4"></div>
          <div class="h-4 bg-dark-200 dark:bg-dark-600 rounded w-1/2"></div>
          <div class="h-4 bg-dark-200 dark:bg-dark-600 rounded w-2/3"></div>
          <div class="h-4 bg-dark-200 dark:bg-dark-600 rounded w-1/3"></div>
          <div class="h-4 bg-dark-200 dark:bg-dark-600 rounded w-1/2"></div>
        </div>
      `;

      // Get audience type
      const audience = audienceSelect.value;

      // Generate card data
      const cardData = await generateCardData(audience);

      // Render card
      renderBusinessCard(cardData);

      // Save current card data
      window.currentCardData = cardData;

    } catch (error) {
      console.error('Error generating business card:', error);
    }
  }

  /**
   * Generate business card data
   * @param {string} audience - Target audience
   * @returns {Promise<Object>} - Card data
   */
  async function generateCardData(audience) {
    // Default card data
    const defaultCardData = {
      name: 'Leonard Lee',
      title: 'Music Distribution Agent',
      tagline: 'Connecting Artists with Audiences',
      email: 'leonard@leemusicdistribution.com',
      phone: '414-555-1234',
      website: 'www.leemusicdistribution.com',
      colors: {
        primary: 'from-primary to-tertiary',
        text: 'text-white'
      },
      design: 'modern'
    };

    // If AI is not available, return default
    if (!_aiProvider) {
      return defaultCardData;
    }

    try {
      // Create different card data based on audience
      switch (audience) {
        case 'music_stores':
          return {
            ...defaultCardData,
            tagline: 'Supplying Quality Music Products to Retailers',
            colors: {
              primary: 'from-blue-500 to-indigo-600',
              text: 'text-white'
            },
            design: 'professional'
          };
        case 'artists':
          return {
            ...defaultCardData,
            title: 'Artist Relations Manager',
            tagline: 'Helping Musicians Reach Their Audience',
            colors: {
              primary: 'from-purple-500 to-pink-500',
              text: 'text-white'
            },
            design: 'creative'
          };
        case 'distributors':
          return {
            ...defaultCardData,
            title: 'Distribution Network Manager',
            tagline: 'Streamlining Music Supply Chains',
            colors: {
              primary: 'from-green-500 to-teal-500',
              text: 'text-white'
            },
            design: 'minimal'
          };
        default:
          return defaultCardData;
      }
    } catch (error) {
      console.error('Error generating card data:', error);
      return defaultCardData;
    }
  }

  /**
   * Render business card
   * @param {Object} cardData - Card data
   */
  function renderBusinessCard(cardData) {
    const cardPreview = document.getElementById('card-preview');
    const cardDetails = document.getElementById('card-details');

    if (!cardPreview || !cardDetails) return;

    // Render card preview
    cardPreview.innerHTML = `
      <div class="absolute inset-0 bg-gradient-to-br ${cardData.colors.primary} p-6 flex flex-col justify-between">
        <div>
          <h4 class="text-xl font-bold ${cardData.colors.text}">${cardData.name}</h4>
          <p class="${cardData.colors.text}/90">${cardData.title}</p>
          <p class="${cardData.colors.text}/80 text-sm mt-1 italic">${cardData.tagline}</p>
        </div>

        <div class="flex justify-between items-end">
          <div class="${cardData.colors.text}/90 text-sm space-y-0.5">
            <p>${cardData.email}</p>
            <p>${cardData.phone}</p>
          </div>

          <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <span class="text-2xl font-bold ${cardData.colors.text}">LL</span>
          </div>
        </div>
      </div>
    `;

    // Render card details
    cardDetails.innerHTML = `
      <div class="space-y-4">
        <div>
          <h4 class="text-lg font-bold text-dark-900 dark:text-white">Card Information</h4>
          <p class="text-sm text-dark-500 dark:text-dark-400">Designed for ${getAudienceName(document.getElementById('card-audience').value)}</p>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm text-dark-500 dark:text-dark-400">Name:</span>
            <span class="text-sm font-medium text-dark-900 dark:text-white">${cardData.name}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-dark-500 dark:text-dark-400">Title:</span>
            <span class="text-sm font-medium text-dark-900 dark:text-white">${cardData.title}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-dark-500 dark:text-dark-400">Tagline:</span>
            <span class="text-sm font-medium text-dark-900 dark:text-white">${cardData.tagline}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-dark-500 dark:text-dark-400">Email:</span>
            <span class="text-sm font-medium text-dark-900 dark:text-white">${cardData.email}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-dark-500 dark:text-dark-400">Phone:</span>
            <span class="text-sm font-medium text-dark-900 dark:text-white">${cardData.phone}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-dark-500 dark:text-dark-400">Design Style:</span>
            <span class="text-sm font-medium text-dark-900 dark:text-white capitalize">${cardData.design}</span>
          </div>
        </div>

        <div class="pt-4 flex justify-end">
          <button type="button" id="save-card-btn" class="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-600 transition-colors flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>Save Card</span>
          </button>
        </div>
      </div>
    `;

    // Re-attach event listener to save button
    const saveCardBtn = document.getElementById('save-card-btn');
    if (saveCardBtn) {
      saveCardBtn.addEventListener('click', function() {
        const modal = document.getElementById('save-card-modal');
        if (modal) {
          modal.classList.remove('hidden');
        }
      });
    }
  }

  /**
   * Get audience name
   * @param {string} audienceValue - Audience value
   * @returns {string} - Audience name
   */
  function getAudienceName(audienceValue) {
    switch (audienceValue) {
      case 'music_stores':
        return 'Music Stores';
      case 'artists':
        return 'Artists & Musicians';
      case 'distributors':
        return 'Distributors';
      case 'general':
        return 'General Business';
      default:
        return 'General Business';
    }
  }

  /**
   * Save business card
   */
  async function saveBusinessCard() {
    try {
      const nameInput = document.getElementById('card-name');
      const descriptionInput = document.getElementById('card-description');

      if (!nameInput || !descriptionInput) {
        console.error('Missing required form elements');
        return;
      }

      const name = nameInput.value.trim();
      const description = descriptionInput.value.trim();

      if (!name) {
        alert('Please enter a name for the card');
        return;
      }

      // Get current card data
      const cardData = window.currentCardData;

      if (!cardData) {
        console.error('No card data available');
        return;
      }

      // Create saved card object
      const savedCard = {
        id: 'card_' + Date.now(),
        name,
        description,
        cardData,
        createdAt: new Date().toISOString()
      };

      // Save to IndexedDB
      const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
      let savedCards = await idbKeyval.get('business-cards', dbPromise) || [];
      savedCards.push(savedCard);
      await idbKeyval.set('business-cards', savedCards, dbPromise);

      // Close modal
      const modal = document.getElementById('save-card-modal');
      if (modal) {
        modal.classList.add('hidden');
      }

      // Reset form
      if (nameInput) nameInput.value = '';
      if (descriptionInput) descriptionInput.value = '';

      // Reload saved cards
      loadSavedCards();

      // Show success message
      alert('Business card saved successfully!');
    } catch (error) {
      console.error('Error saving business card:', error);
    }
  }

  /**
   * Load saved business cards
   */
  async function loadSavedCards() {
    try {
      const savedCardsContainer = document.getElementById('saved-cards');
      if (!savedCardsContainer) return;

      // Get saved cards from IndexedDB
      const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
      const savedCards = await idbKeyval.get('business-cards', dbPromise) || [];

      if (savedCards.length === 0) {
        savedCardsContainer.innerHTML = `
          <div class="text-center p-6 text-dark-500 dark:text-dark-400 col-span-full">
            No saved cards found. Generate and save a card to see it here.
          </div>
        `;
        return;
      }

      // Sort cards by creation date (newest first)
      savedCards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Render saved cards
      savedCardsContainer.innerHTML = '';

      savedCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'bg-white dark:bg-dark-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow';
        cardElement.dataset.cardId = card.id;

        cardElement.innerHTML = `
          <div class="aspect-[1.75/1] bg-gradient-to-br ${card.cardData.colors.primary} relative">
            <div class="absolute inset-0 p-3 flex flex-col justify-between">
              <div>
                <h5 class="text-sm font-bold ${card.cardData.colors.text}">${card.cardData.name}</h5>
                <p class="${card.cardData.colors.text}/90 text-xs">${card.cardData.title}</p>
              </div>

              <div class="flex justify-between items-end">
                <div class="${card.cardData.colors.text}/90 text-xs">
                  <p>${card.cardData.phone}</p>
                </div>

                <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span class="text-sm font-bold ${card.cardData.colors.text}">LL</span>
                </div>
              </div>
            </div>
          </div>
          <div class="p-3">
            <h5 class="font-medium text-dark-900 dark:text-white text-sm">${card.name}</h5>
            ${card.description ? `<p class="text-dark-500 dark:text-dark-400 text-xs mt-1">${card.description}</p>` : ''}
          </div>
        `;

        // Add click event to load the card
        cardElement.addEventListener('click', function() {
          renderBusinessCard(card.cardData);
          window.currentCardData = card.cardData;
        });

        savedCardsContainer.appendChild(cardElement);
      });
    } catch (error) {
      console.error('Error loading saved cards:', error);
    }
  }

  /**
   * Load business card data
   * @returns {Promise<void>}
   */
  async function loadBusinessCard() {
    try {
      // Load default card
      const defaultCardData = {
        name: 'Leonard Lee',
        title: 'Music Distribution Agent',
        tagline: 'Connecting Artists with Audiences',
        email: 'leonard@leemusicdistribution.com',
        phone: '414-555-1234',
        website: 'www.leemusicdistribution.com',
        colors: {
          primary: 'from-primary to-tertiary',
          text: 'text-white'
        },
        design: 'modern'
      };

      // Render default card
      renderBusinessCard(defaultCardData);

      // Save current card data
      window.currentCardData = defaultCardData;

      // Load saved cards
      await loadSavedCards();

      // Initialize the business card map
      setTimeout(() => {
        if (typeof initializeBusinessCardMap === 'function') {
          initializeBusinessCardMap();
        }
      }, 500);
    } catch (error) {
      console.error('Error loading business card:', error);
    }
  }

  /**
   * Initialize Email Signature feature
   * @private
   * @returns {Promise<void>}
   */
  async function initEmailSignature() {
    console.log('Initializing AI-Optimized Email Signature...');

    // Load email signature data
    await loadEmailSignature();

    // Set up email signature generation
    const generateSignatureBtn = document.getElementById('generate-signature-btn');

    if (generateSignatureBtn) {
      generateSignatureBtn.addEventListener('click', generateEmailSignature);
    }

    // Set up copy signature button
    const copySignatureBtn = document.getElementById('copy-signature-btn');
    if (copySignatureBtn) {
      copySignatureBtn.addEventListener('click', copySignatureHTML);
    }

    // Set up save signature button
    const saveSignatureBtn = document.getElementById('save-signature-btn');
    if (saveSignatureBtn) {
      saveSignatureBtn.addEventListener('click', function() {
        const modal = document.getElementById('save-signature-modal');
        if (modal) {
          modal.classList.remove('hidden');
        }
      });
    }

    // Set up save signature form
    const saveSignatureForm = document.getElementById('save-signature-form');
    if (saveSignatureForm) {
      saveSignatureForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveEmailSignature();
      });
    }

    // Set up modal close buttons
    const closeSignatureModal = document.getElementById('close-signature-modal');
    const cancelSaveSignatureBtn = document.getElementById('cancel-save-signature-btn');
    const signatureModalBackdrop = document.getElementById('signature-modal-backdrop');

    [closeSignatureModal, cancelSaveSignatureBtn, signatureModalBackdrop].forEach(element => {
      if (element) {
        element.addEventListener('click', function() {
          const modal = document.getElementById('save-signature-modal');
          if (modal) {
            modal.classList.add('hidden');
          }
        });
      }
    });
  }

  /**
   * Generate an email signature
   */
  async function generateEmailSignature() {
    try {
      const signaturePreview = document.getElementById('signature-preview');
      const signatureCode = document.getElementById('signature-code');
      const styleSelect = document.getElementById('signature-style');
      const languageSelect = document.getElementById('signature-language');

      if (!signaturePreview || !signatureCode || !styleSelect || !languageSelect) {
        console.error('Missing required elements');
        return;
      }

      // Show loading state
      signaturePreview.innerHTML = `
        <div class="flex items-center justify-center h-full">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      `;

      signatureCode.innerHTML = `
        <div class="animate-pulse space-y-2">
          <div class="h-4 bg-dark-200 dark:bg-dark-600 rounded w-full"></div>
          <div class="h-4 bg-dark-200 dark:bg-dark-600 rounded w-3/4"></div>
          <div class="h-4 bg-dark-200 dark:bg-dark-600 rounded w-1/2"></div>
          <div class="h-4 bg-dark-200 dark:bg-dark-600 rounded w-2/3"></div>
          <div class="h-4 bg-dark-200 dark:bg-dark-600 rounded w-full"></div>
          <div class="h-4 bg-dark-200 dark:bg-dark-600 rounded w-3/4"></div>
        </div>
      `;

      // Get style and language
      const style = styleSelect.value;
      const language = languageSelect.value;

      // Generate signature data
      const signatureData = await generateSignatureData(style, language);

      // Render signature
      renderEmailSignature(signatureData);

      // Save current signature data
      window.currentSignatureData = signatureData;

    } catch (error) {
      console.error('Error generating email signature:', error);
    }
  }

  /**
   * Generate email signature data
   * @param {string} style - Signature style
   * @param {string} language - Signature language
   * @returns {Promise<Object>} - Signature data
   */
  async function generateSignatureData(style, language) {
    // Default signature data
    const defaultSignatureData = {
      name: 'Leonard Lee',
      title: 'Music Distribution Agent',
      tagline: 'Connecting Artists with Audiences',
      email: 'leonard@leemusicdistribution.com',
      phone: '414-555-1234',
      website: 'www.leemusicdistribution.com',
      style: 'professional',
      language: 'en'
    };

    // If AI is not available, return default
    if (!_aiProvider) {
      return defaultSignatureData;
    }

    try {
      // Create different signature data based on style and language
      let signatureData = { ...defaultSignatureData, style, language };

      // Translate based on language
      if (language !== 'en') {
        switch (language) {
          case 'es':
            signatureData.title = 'Agente de Distribución Musical';
            signatureData.tagline = 'Conectando Artistas con Audiencias';
            break;
          case 'fr':
            signatureData.title = 'Agent de Distribution Musicale';
            signatureData.tagline = 'Connecter les Artistes avec leur Public';
            break;
          case 'de':
            signatureData.title = 'Musikvertriebsagent';
            signatureData.tagline = 'Verbindung von Künstlern mit Publikum';
            break;
        }
      }

      return signatureData;
    } catch (error) {
      console.error('Error generating signature data:', error);
      return defaultSignatureData;
    }
  }

  /**
   * Render email signature
   * @param {Object} signatureData - Signature data
   */
  function renderEmailSignature(signatureData) {
    const signaturePreview = document.getElementById('signature-preview');
    const signatureCode = document.getElementById('signature-code');

    if (!signaturePreview || !signatureCode) return;

    // Generate HTML based on style
    let signatureHTML = '';

    switch (signatureData.style) {
      case 'professional':
        signatureHTML = `
          <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; color: #333333;">
            <tr>
              <td valign="top" width="100" style="padding-right: 15px;">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; text-align: center; line-height: 80px; font-size: 28px; font-weight: bold;">LL</div>
              </td>
              <td valign="top" style="border-left: 2px solid #e5e7eb; padding-left: 15px;">
                <p style="margin: 0; font-size: 18px; font-weight: bold; color: #111827;">${signatureData.name}</p>
                <p style="margin: 0; font-size: 14px; color: #4f46e5;">${signatureData.title}</p>
                <p style="margin: 5px 0 10px; font-size: 12px; color: #6b7280; font-style: italic;">${signatureData.tagline}</p>
                <p style="margin: 2px 0; font-size: 12px;">
                  <span style="color: #6b7280;">Email:</span>
                  <a href="mailto:${signatureData.email}" style="color: #4f46e5; text-decoration: none;">${signatureData.email}</a>
                </p>
                <p style="margin: 2px 0; font-size: 12px;">
                  <span style="color: #6b7280;">Phone:</span>
                  <a href="tel:${signatureData.phone}" style="color: #4f46e5; text-decoration: none;">${signatureData.phone}</a>
                </p>
                <p style="margin: 2px 0; font-size: 12px;">
                  <span style="color: #6b7280;">Website:</span>
                  <a href="https://${signatureData.website}" style="color: #4f46e5; text-decoration: none;">${signatureData.website}</a>
                </p>
              </td>
            </tr>
          </table>
        `;
        break;
      case 'creative':
        signatureHTML = `
          <table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Trebuchet MS', sans-serif; color: #333333; background: linear-gradient(to right, rgba(236, 72, 153, 0.1), rgba(167, 139, 250, 0.1)); padding: 15px; border-radius: 8px;">
            <tr>
              <td valign="middle" style="padding-bottom: 10px;">
                <p style="margin: 0; font-size: 24px; font-weight: bold; background: linear-gradient(to right, #ec4899, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${signatureData.name}</p>
                <p style="margin: 0; font-size: 16px; color: #6b7280;">${signatureData.title}</p>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 10px; border-top: 2px dashed #d1d5db;">
                <p style="margin: 0 0 10px; font-size: 14px; font-style: italic; color: #6b7280;">"${signatureData.tagline}"</p>
                <p style="margin: 2px 0; font-size: 12px;">
                  <span style="font-weight: bold;">Email:</span>
                  <a href="mailto:${signatureData.email}" style="color: #a78bfa; text-decoration: none;">${signatureData.email}</a>
                </p>
                <p style="margin: 2px 0; font-size: 12px;">
                  <span style="font-weight: bold;">Phone:</span>
                  <a href="tel:${signatureData.phone}" style="color: #a78bfa; text-decoration: none;">${signatureData.phone}</a>
                </p>
                <p style="margin: 2px 0; font-size: 12px;">
                  <span style="font-weight: bold;">Website:</span>
                  <a href="https://${signatureData.website}" style="color: #a78bfa; text-decoration: none;">${signatureData.website}</a>
                </p>
              </td>
            </tr>
          </table>
        `;
        break;
      case 'minimal':
        signatureHTML = `
          <table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333;">
            <tr>
              <td>
                <p style="margin: 0; font-size: 16px; font-weight: bold; color: #111827;">${signatureData.name}</p>
                <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">${signatureData.title}</p>
                <p style="margin: 0; font-size: 12px; color: #6b7280;">
                  <a href="mailto:${signatureData.email}" style="color: #6b7280; text-decoration: none;">${signatureData.email}</a> |
                  <a href="tel:${signatureData.phone}" style="color: #6b7280; text-decoration: none;">${signatureData.phone}</a> |
                  <a href="https://${signatureData.website}" style="color: #6b7280; text-decoration: none;">${signatureData.website}</a>
                </p>
              </td>
            </tr>
          </table>
        `;
        break;
      case 'detailed':
        signatureHTML = `
          <table cellpadding="0" cellspacing="0" border="0" style="font-family: Georgia, serif; color: #333333; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <tr>
              <td colspan="2" style="background: linear-gradient(to right, #1e40af, #3b82f6); padding: 10px; text-align: center;">
                <p style="margin: 0; font-size: 20px; font-weight: bold; color: white;">${signatureData.name}</p>
                <p style="margin: 0; font-size: 14px; color: rgba(255, 255, 255, 0.8);">${signatureData.title}</p>
              </td>
            </tr>
            <tr>
              <td valign="top" width="100" style="padding: 15px; background-color: #f3f4f6;">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; text-align: center; line-height: 80px; font-size: 28px; font-weight: bold;">LL</div>
              </td>
              <td valign="top" style="padding: 15px;">
                <p style="margin: 0 0 10px; font-size: 14px; font-style: italic; color: #6b7280;">"${signatureData.tagline}"</p>
                <table cellpadding="2" cellspacing="0" border="0">
                  <tr>
                    <td width="60" style="font-weight: bold; font-size: 12px;">Email:</td>
                    <td style="font-size: 12px;"><a href="mailto:${signatureData.email}" style="color: #3b82f6; text-decoration: none;">${signatureData.email}</a></td>
                  </tr>
                  <tr>
                    <td width="60" style="font-weight: bold; font-size: 12px;">Phone:</td>
                    <td style="font-size: 12px;"><a href="tel:${signatureData.phone}" style="color: #3b82f6; text-decoration: none;">${signatureData.phone}</a></td>
                  </tr>
                  <tr>
                    <td width="60" style="font-weight: bold; font-size: 12px;">Website:</td>
                    <td style="font-size: 12px;"><a href="https://${signatureData.website}" style="color: #3b82f6; text-decoration: none;">${signatureData.website}</a></td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        `;
        break;
      default:
        signatureHTML = `
          <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; color: #333333;">
            <tr>
              <td valign="top" width="100" style="padding-right: 15px;">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; text-align: center; line-height: 80px; font-size: 28px; font-weight: bold;">LL</div>
              </td>
              <td valign="top" style="border-left: 2px solid #e5e7eb; padding-left: 15px;">
                <p style="margin: 0; font-size: 18px; font-weight: bold; color: #111827;">${signatureData.name}</p>
                <p style="margin: 0; font-size: 14px; color: #4f46e5;">${signatureData.title}</p>
                <p style="margin: 5px 0 10px; font-size: 12px; color: #6b7280; font-style: italic;">${signatureData.tagline}</p>
                <p style="margin: 2px 0; font-size: 12px;">
                  <span style="color: #6b7280;">Email:</span>
                  <a href="mailto:${signatureData.email}" style="color: #4f46e5; text-decoration: none;">${signatureData.email}</a>
                </p>
                <p style="margin: 2px 0; font-size: 12px;">
                  <span style="color: #6b7280;">Phone:</span>
                  <a href="tel:${signatureData.phone}" style="color: #4f46e5; text-decoration: none;">${signatureData.phone}</a>
                </p>
                <p style="margin: 2px 0; font-size: 12px;">
                  <span style="color: #6b7280;">Website:</span>
                  <a href="https://${signatureData.website}" style="color: #4f46e5; text-decoration: none;">${signatureData.website}</a>
                </p>
              </td>
            </tr>
          </table>
        `;
    }

    // Render signature preview
    signaturePreview.innerHTML = signatureHTML;

    // Render signature code
    signatureCode.textContent = signatureHTML.trim();

    // Highlight code
    if (window.hljs) {
      window.hljs.highlightElement(signatureCode);
    }
  }

  /**
   * Copy signature HTML to clipboard
   */
  async function copySignatureHTML() {
    try {
      const signatureCode = document.getElementById('signature-code');

      if (!signatureCode) {
        console.error('Signature code element not found');
        return;
      }

      const html = signatureCode.textContent;

      // Copy to clipboard
      await navigator.clipboard.writeText(html);

      // Show success message
      const copyBtn = document.getElementById('copy-signature-btn');
      if (copyBtn) {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Copied!</span>
        `;

        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      }
    } catch (error) {
      console.error('Error copying signature HTML:', error);
      alert('Failed to copy. Please try again.');
    }
  }

  /**
   * Save email signature
   */
  async function saveEmailSignature() {
    try {
      const nameInput = document.getElementById('signature-name');
      const descriptionInput = document.getElementById('signature-description');

      if (!nameInput || !descriptionInput) {
        console.error('Missing required form elements');
        return;
      }

      const name = nameInput.value.trim();
      const description = descriptionInput.value.trim();

      if (!name) {
        alert('Please enter a name for the signature');
        return;
      }

      // Get current signature data
      const signatureData = window.currentSignatureData;

      if (!signatureData) {
        console.error('No signature data available');
        return;
      }

      // Create saved signature object
      const savedSignature = {
        id: 'signature_' + Date.now(),
        name,
        description,
        signatureData,
        html: document.getElementById('signature-code').textContent,
        createdAt: new Date().toISOString()
      };

      // Save to IndexedDB
      const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
      let savedSignatures = await idbKeyval.get('email-signatures', dbPromise) || [];
      savedSignatures.push(savedSignature);
      await idbKeyval.set('email-signatures', savedSignatures, dbPromise);

      // Close modal
      const modal = document.getElementById('save-signature-modal');
      if (modal) {
        modal.classList.add('hidden');
      }

      // Reset form
      if (nameInput) nameInput.value = '';
      if (descriptionInput) descriptionInput.value = '';

      // Reload saved signatures
      loadSavedSignatures();

      // Show success message
      alert('Email signature saved successfully!');
    } catch (error) {
      console.error('Error saving email signature:', error);
    }
  }

  /**
   * Load saved email signatures
   */
  async function loadSavedSignatures() {
    try {
      const savedSignaturesContainer = document.getElementById('saved-signatures');
      if (!savedSignaturesContainer) return;

      // Get saved signatures from IndexedDB
      const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
      const savedSignatures = await idbKeyval.get('email-signatures', dbPromise) || [];

      if (savedSignatures.length === 0) {
        savedSignaturesContainer.innerHTML = `
          <div class="text-center p-6 text-dark-500 dark:text-dark-400 col-span-full">
            No saved signatures found. Generate and save a signature to see it here.
          </div>
        `;
        return;
      }

      // Sort signatures by creation date (newest first)
      savedSignatures.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Render saved signatures
      savedSignaturesContainer.innerHTML = '';

      savedSignatures.forEach(signature => {
        const signatureElement = document.createElement('div');
        signatureElement.className = 'bg-white dark:bg-dark-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow';
        signatureElement.dataset.signatureId = signature.id;

        signatureElement.innerHTML = `
          <div class="h-24 p-3 bg-gray-50 dark:bg-dark-600 overflow-hidden">
            <div style="transform: scale(0.5); transform-origin: top left; pointer-events: none;">
              ${signature.html}
            </div>
          </div>
          <div class="p-3">
            <h5 class="font-medium text-dark-900 dark:text-white text-sm">${signature.name}</h5>
            ${signature.description ? `<p class="text-dark-500 dark:text-dark-400 text-xs mt-1">${signature.description}</p>` : ''}
          </div>
        `;

        // Add click event to load the signature
        signatureElement.addEventListener('click', function() {
          renderEmailSignature(signature.signatureData);
          window.currentSignatureData = signature.signatureData;

          // Update style and language selects
          const styleSelect = document.getElementById('signature-style');
          const languageSelect = document.getElementById('signature-language');

          if (styleSelect && signature.signatureData.style) {
            styleSelect.value = signature.signatureData.style;
          }

          if (languageSelect && signature.signatureData.language) {
            languageSelect.value = signature.signatureData.language;
          }
        });

        savedSignaturesContainer.appendChild(signatureElement);
      });
    } catch (error) {
      console.error('Error loading saved signatures:', error);
    }
  }

  /**
   * Load email signature data
   * @returns {Promise<void>}
   */
  async function loadEmailSignature() {
    try {
      // Load default signature
      const defaultSignatureData = {
        name: 'Leonard Lee',
        title: 'Music Distribution Agent',
        tagline: 'Connecting Artists with Audiences',
        email: 'leonard@leemusicdistribution.com',
        phone: '414-555-1234',
        website: 'www.leemusicdistribution.com',
        style: 'professional',
        language: 'en'
      };

      // Render default signature
      renderEmailSignature(defaultSignatureData);

      // Save current signature data
      window.currentSignatureData = defaultSignatureData;

      // Load saved signatures
      await loadSavedSignatures();
    } catch (error) {
      console.error('Error loading email signature:', error);
    }
  }

  /**
   * Add event listeners
   * @private
   */
  function _addEventListeners() {
    // Add event listeners for tab switching
    document.querySelectorAll('[data-tab="todos"]').forEach(function(element) {
      element.addEventListener('click', loadToDos);
    });

    document.querySelectorAll('[data-tab="timeline"]').forEach(function(element) {
      element.addEventListener('click', loadTimeline);
    });

    document.querySelectorAll('[data-tab="business-card"]').forEach(function(element) {
      element.addEventListener('click', loadBusinessCard);
    });

    document.querySelectorAll('[data-tab="email-signature"]').forEach(function(element) {
      element.addEventListener('click', loadEmailSignature);
    });
  }

  /**
   * Extract to-do data from text using AI
   * @param {string} text - Text to extract to-do from
   * @returns {Promise<Object>} - Extracted to-do data
   */
  async function extractTodoFromText(text) {
    // Default values
    const defaultTodo = {
      task: text,
      priority: 'Medium',
      dueDate: '',
      related: '',
      notes: ''
    };

    // If AI is not available, return default
    if (!_aiProvider) {
      return defaultTodo;
    }

    try {
      // Create prompt for AI
      const prompt = `
Extract a to-do task from the following text. Format the response as JSON with these fields:
- task: The main task to be done
- priority: "High", "Medium", or "Low"
- dueDate: Date in YYYY-MM-DD format, or empty if not specified
- related: Related contact or company, or empty if not specified
- notes: Any additional notes, or empty if not specified

Text: "${text}"

JSON Response:
`;

      // Get AI response
      const response = await _aiProvider.generateText(prompt);

      // Parse JSON response
      try {
        const parsedResponse = JSON.parse(response);

        // Validate and fill in defaults for missing fields
        return {
          task: parsedResponse.task || defaultTodo.task,
          priority: ['High', 'Medium', 'Low'].includes(parsedResponse.priority) ? parsedResponse.priority : defaultTodo.priority,
          dueDate: parsedResponse.dueDate || defaultTodo.dueDate,
          related: parsedResponse.related || defaultTodo.related,
          notes: parsedResponse.notes || defaultTodo.notes
        };
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);

        // Try to extract task using regex
        const taskMatch = response.match(/"task":\s*"([^"]+)"/);
        if (taskMatch && taskMatch[1]) {
          defaultTodo.task = taskMatch[1];
        }

        return defaultTodo;
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      return defaultTodo;
    }
  }

  /**
   * Load to-dos from IndexedDB
   * @returns {Promise<Array>} - Array of to-dos
   */
  async function loadToDos() {
    try {
      const todosList = document.getElementById('todos-list');
      if (!todosList) return [];

      // Show loading state
      todosList.innerHTML = `
        <div class="animate-pulse space-y-4">
          <div class="bg-white dark:bg-dark-700 rounded-xl p-4 shadow-sm">
            <div class="h-5 bg-dark-200 dark:bg-dark-600 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-dark-200 dark:bg-dark-600 rounded w-1/2 mb-2"></div>
            <div class="h-4 bg-dark-200 dark:bg-dark-600 rounded w-1/4"></div>
          </div>
          <div class="bg-white dark:bg-dark-700 rounded-xl p-4 shadow-sm">
            <div class="h-5 bg-dark-200 dark:bg-dark-600 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-dark-200 dark:bg-dark-600 rounded w-1/2 mb-2"></div>
            <div class="h-4 bg-dark-200 dark:bg-dark-600 rounded w-1/4"></div>
          </div>
        </div>
      `;

      // Get to-dos from IndexedDB
      const dbPromise = idbKeyval.createStore('agent-lee-crm', 'stores');
      let todos = await idbKeyval.get('todos', dbPromise) || [];

      // If no to-dos exist, create sample to-dos
      if (todos.length === 0) {
        todos = [
          {
            id: 'todo_1',
            task: 'Follow up with Rushmor Records',
            priority: 'High',
            dueDate: '2023-05-25',
            related: 'Rushmor Records',
            notes: 'Discuss new inventory needs',
            completed: false,
            createdAt: '2023-05-20T10:30:00'
          },
          {
            id: 'todo_2',
            task: 'Create marketing campaign for new album',
            priority: 'Medium',
            dueDate: '2023-06-01',
            related: '',
            notes: 'Focus on indie stores',
            completed: false,
            createdAt: '2023-05-21T14:15:00'
          },
          {
            id: 'todo_3',
            task: 'Update product catalog',
            priority: 'Low',
            dueDate: '2023-06-15',
            related: '',
            notes: 'Add new guitar models',
            completed: true,
            createdAt: '2023-05-18T09:45:00'
          }
        ];

        // Save sample to-dos to IndexedDB
        await idbKeyval.set('todos', todos, dbPromise);
      }

      // Sort to-dos by priority and due date
      todos.sort((a, b) => {
        // First sort by completion status
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }

        // Then sort by priority
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }

        // Then sort by due date
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }

        // If one has a due date and the other doesn't
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;

        // Finally sort by creation date
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      // Render to-dos
      renderToDos(todos);

      // Also update dashboard to-dos if on dashboard
      updateDashboardTodos(todos);

      return todos;
    } catch (error) {
      console.error('Error loading to-dos:', error);
      return [];
    }
  }

  /**
   * Update dashboard to-dos
   * @param {Array} todos - Array of to-dos
   */
  function updateDashboardTodos(todos) {
    const dashboardTodos = document.getElementById('dashboard-pending-todos');
    if (!dashboardTodos) return;

    // Filter for pending to-dos only
    const pendingTodos = todos.filter(todo => !todo.completed).slice(0, 5);

    if (pendingTodos.length === 0) {
      dashboardTodos.innerHTML = `
        <div class="text-center p-4 text-dark-500 dark:text-dark-400">
          No pending to-dos. Great job!
        </div>
      `;
      return;
    }

    dashboardTodos.innerHTML = '';

    pendingTodos.forEach(todo => {
      const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
      const formattedDueDate = dueDate ? dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
      const isOverdue = dueDate && dueDate < new Date();

      const priorityClass = getPriorityClass(todo.priority);

      const todoItem = document.createElement('div');
      todoItem.className = 'border-b border-dark-100 dark:border-dark-700 last:border-0 pb-3 last:pb-0 mb-3 last:mb-0';
      todoItem.innerHTML = `
        <div class="flex items-center justify-between">
          <h4 class="font-medium text-dark-900 dark:text-white text-sm">${todo.task}</h4>
          <span class="text-xs px-2 py-0.5 rounded-full ${priorityClass}">${todo.priority}</span>
        </div>
        ${formattedDueDate ? `
          <p class="text-xs ${isOverdue ? 'text-red-500 dark:text-red-400 font-medium' : 'text-dark-500 dark:text-dark-400'} mt-1">
            ${isOverdue ? '⚠️ Overdue: ' : 'Due: '}${formattedDueDate}
          </p>
        ` : ''}
      `;

      dashboardTodos.appendChild(todoItem);
    });
  }

  /**
   * Render to-dos in the UI
   * @param {Array} todos - Array of to-dos
   */
  function renderToDos(todos) {
    const todosList = document.getElementById('todos-list');
    if (!todosList) return;

    // Clear loading animation
    todosList.innerHTML = '';

    if (todos.length === 0) {
      todosList.innerHTML = `
        <div class="text-center p-6 text-dark-500 dark:text-dark-400">
          No to-dos found. Create your first to-do to get started.
        </div>
      `;
      return;
    }

    // Group to-dos by completion status
    const pendingTodos = todos.filter(todo => !todo.completed);
    const completedTodos = todos.filter(todo => todo.completed);

    // Render pending to-dos
    if (pendingTodos.length > 0) {
      const pendingSection = document.createElement('div');
      pendingSection.className = 'mb-6';
      pendingSection.innerHTML = `
        <h3 class="text-lg font-semibold mb-3 text-dark-900 dark:text-white">Pending Tasks (${pendingTodos.length})</h3>
        <div class="space-y-3" id="pending-todos-list"></div>
      `;
      todosList.appendChild(pendingSection);

      const pendingList = pendingSection.querySelector('#pending-todos-list');
      pendingTodos.forEach(todo => {
        pendingList.appendChild(createTodoCard(todo));
      });
    }

    // Render completed to-dos
    if (completedTodos.length > 0) {
      const completedSection = document.createElement('div');
      completedSection.className = 'mb-6';
      completedSection.innerHTML = `
        <h3 class="text-lg font-semibold mb-3 text-dark-900 dark:text-white">Completed Tasks (${completedTodos.length})</h3>
        <div class="space-y-3" id="completed-todos-list"></div>
      `;
      todosList.appendChild(completedSection);

      const completedList = completedSection.querySelector('#completed-todos-list');
      completedTodos.forEach(todo => {
        completedList.appendChild(createTodoCard(todo));
      });
    }
  }

  /**
   * Create a to-do card element
   * @param {Object} todo - To-do object
   * @returns {HTMLElement} - To-do card element
   */
  function createTodoCard(todo) {
    const card = document.createElement('div');
    card.className = `bg-white dark:bg-dark-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow ${todo.completed ? 'opacity-75' : ''}`;
    card.dataset.id = todo.id;

    // Get priority class
    const priorityClass = getPriorityClass(todo.priority);

    // Format due date
    const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
    const formattedDueDate = dueDate ? dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

    // Check if overdue
    const isOverdue = dueDate && dueDate < new Date() && !todo.completed;

    card.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 mt-1">
          <input type="checkbox" class="todo-checkbox w-5 h-5 rounded border-dark-300 dark:border-dark-600 text-primary focus:ring-primary" ${todo.completed ? 'checked' : ''}>
        </div>
        <div class="flex-grow min-w-0">
          <div class="flex flex-wrap items-start justify-between gap-2 mb-1">
            <h4 class="font-medium text-dark-900 dark:text-white ${todo.completed ? 'line-through' : ''}">${todo.task}</h4>
            <span class="text-xs px-2 py-0.5 rounded-full ${priorityClass}">${todo.priority}</span>
          </div>
          ${formattedDueDate ? `
            <p class="text-xs ${isOverdue ? 'text-red-500 dark:text-red-400 font-medium' : 'text-dark-500 dark:text-dark-400'} mt-1">
              ${isOverdue ? '⚠️ Overdue: ' : 'Due: '}${formattedDueDate}
            </p>
          ` : ''}
          ${todo.related ? `<p class="text-xs text-dark-500 dark:text-dark-400 mt-1">Related to: ${todo.related}</p>` : ''}
          ${todo.notes ? `<p class="text-sm text-dark-600 dark:text-dark-400 mt-2 border-t border-dark-100 dark:border-dark-600 pt-2">${todo.notes}</p>` : ''}
        </div>
        <div class="flex-shrink-0">
          <button type="button" class="todo-edit-btn p-1 text-dark-400 hover:text-dark-600 dark:text-dark-500 dark:hover:text-dark-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>
    `;

    // Add event listeners
    const checkbox = card.querySelector('.todo-checkbox');
    if (checkbox) {
      checkbox.addEventListener('change', function() {
        toggleTodoCompletion(todo.id, this.checked);
      });
    }

    const editBtn = card.querySelector('.todo-edit-btn');
    if (editBtn) {
      editBtn.addEventListener('click', function() {
        editTodo(todo.id);
      });
    }

    return card;
  }

  /**
   * Get priority class for styling
   * @param {string} priority - Priority level
   * @returns {string} - CSS class
   */
  function getPriorityClass(priority) {
    switch (priority) {
      case 'High':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
      case 'Medium':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200';
      case 'Low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      default:
        return 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300';
    }
  }

  // Public API
  return {
    init,
    loadToDos,
    loadTimeline,
    loadBusinessCard,
    loadEmailSignature,
    extractTodoFromText,
    extractEventFromText,
    addToTimeline,
    generateBusinessCard,
    generateEmailSignature,
    copySignatureHTML,
    saveToDo,
    filterToDos,
    toggleTodoCompletion,
    deleteTodo,
    editTodo,
    updateTodo,
    saveTimelineEvent,
    filterTimelineEvents
  };
})();

// Auto-initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    LeewayAIFeatures.init();
  }, 1500);
});
