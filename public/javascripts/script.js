
$(document).ready(function () {
  // jQuery selectors
  const chatMessages = $('#chatMessages');
  const messageInput = $('#messageInput');
  const sendButton = $('#sendButton');
  const todoList = $('#todoList');
  const todoInput = $('#todoInput');
  const addTodoButton = $('#addTodoButton');

  let todoCounter = 1;
  let isLoading = false;

  // Chat functions
  function addMessage(content, isUser = false) {
    const messageClass = isUser ? 'user-message' : 'bot-message';
    const messageHtml = `
      <div class="message ${messageClass}">
        <div class="message-content">${escapeHtml(content)}</div>
      </div>
    `;

    chatMessages.append(messageHtml);
    chatMessages.animate({ scrollTop: chatMessages[0].scrollHeight }, 300);
  }

  function escapeHtml(text) {
    text = text ? text.split("\n").join("<br>") : text;
    return $('<div>').html(text).html();
  }

  function showTypingIndicator() {
    const typingHtml = `
      <div class="message bot-message typing-indicator">
        <div class="message-content">
          <span class="typing-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
          Thinking...
        </div>
      </div>
    `;
    chatMessages.append(typingHtml);
    chatMessages.animate({ scrollTop: chatMessages[0].scrollHeight }, 300);
    return $('.typing-indicator').last();
  }

  function setLoadingState(loading) {
    isLoading = loading;
    sendButton.prop('disabled', loading).text(loading ? 'Sending...' : 'Send');
    messageInput.prop('disabled', loading);

    if (loading) {
      sendButton.addClass('loading');
    } else {
      sendButton.removeClass('loading');
    }
  }

  async function sendMessage() {
    const message = messageInput.val().trim();
    if (!message || isLoading) return;

    // Add user message
    addMessage(message, true);
    messageInput.val('');

    // Set loading state
    setLoadingState(true);

    // Show typing indicator
    const typingIndicator = showTypingIndicator();

    try {
      // Call smart-agent API with timeout

      const response = await fetch('http://localhost:3000/smart-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: message,
        }),
      });


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Remove typing indicator
      typingIndicator.fadeOut(200, function () {
        $(this).remove();
      });

      // Add bot response with delay for natural feel
      setTimeout(() => {
        addMessage(data.response || data.message || 'Sorry, I couldn\'t process that request.');
        loadTodos();
      }, 300);

    } catch (error) {
      console.error('API Error:', error);

      setTimeout(() => {
        addMessage("Something went wrong. Please try again.");
      }, 300);

    } finally {
      setLoadingState(false);
    }
  }

  // Todo functions
  function createTodoItem(text, id) {
    const todoHtml = `
      <div class="todo-item" data-id="${id}">
        <label for="todo${id}">#${id} ${escapeHtml(text)}</label>
        <button class="delete-btn" data-id="${id}" title="Delete todo">×</button>
      </div>
    `;
    return $(todoHtml);
  }

  async function addTodo() {
    await fetch('http://localhost:3000/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title: todoInput.val().trim(),
      }),
    });

    await loadTodos();

    todoInput.val('').focus();
  }

  async function deleteTodo(id) {
    console.log({ id });
    await fetch('http://localhost:3000/api/todos/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    loadTodos();
  }

  async function loadTodos() {
    const response = await fetch('http://localhost:3000/api/todos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const savedTodos = await response.json();

    if (savedTodos) {
      const todos = savedTodos.todos || [];
      todoList.empty();

      todos.forEach(todo => {
        const $todoItem = createTodoItem(todo.title, todo.id);
        if (todo.completed) {
          $todoItem.find('.todo-checkbox').prop('checked', true);
        }
        todoList.append($todoItem);
        todoCounter = Math.max(todoCounter, todo.id);
      });
    }
  }

  // Event handlers using jQuery
  sendButton.on('click', sendMessage);

  messageInput.on('keypress', function (e) {
    if (e.which === 13 && !e.shiftKey) { // Enter key without shift
      e.preventDefault();
      sendMessage();
    }
  });

  addTodoButton.on('click', addTodo);

  todoInput.on('keypress', function (e) {
    if (e.which === 13) {
      e.preventDefault();
      addTodo();
    }
  });

  // Event delegation for dynamic todo elements
  todoList.on('click', '.delete-btn', function () {
    deleteTodo($(this).data('id'));
  });

  // Auto-resize message input
  messageInput.on('input', function () {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });

  // Initialize app
  loadTodos();

  // Auto-focus on message input
  messageInput.focus();
});
