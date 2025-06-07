# Core JS Documentation

A lightweight, modern, and dependency-free JavaScript library that provides a familiar jQuery-like API for DOM manipulation, events, and AJAX. Built by [https://github.com/suwahas](https://github.com/suwahas).

Core JS embraces modern browser standards to provide a high-performance, minimal-footprint alternative to legacy libraries. It is designed to be fast, transparent, and easy to extend.

## Table of Contents

1.  [Why Core JS? The Modern Advantage](#why-core-js-the-modern-advantage)
2.  [Getting Started](#getting-started)
3.  [Core Concepts](#core-concepts)
    *   [The `J` Function](#the-j-function)
    *   [Chaining](#chaining)
4.  [API Reference](#api-reference)
    *   [DOM Traversal](#dom-traversal)
    *   [DOM Manipulation (Optimized)](#dom-manipulation-optimized)
    *   [CSS, Attributes & Data](#css-attributes--data)
    *   [Event Handling](#event-handling)
    *   [Form Handling](#form-handling)
    *   [AJAX](#ajax)
    *   [Utilities](#utilities)
5.  [Extending Core JS with Plugins](#extending-core-js-with-plugins)
6.  [Complete Example: Fetch and Display Data](#complete-example-fetch-and-display-data)
7.  [License](#license)

## Why Core JS? The Modern Advantage

Core JS is not just another jQuery clone; it's a re-imagining of what a utility library should be in the modern browser era.

| Feature | Core JS (`J`) | jQuery (`$`) | The Modern Advantage |
| :--- | :--- | :--- | :--- |
| **Core Philosophy** | **Convenience Wrapper** | **Normalization Layer** | Core JS enhances standard APIs, while jQuery had to create its own to hide browser flaws. |
| **Performance** | **Extremely High** | **Good, but with overhead** | Core JS maps directly to fast, native browser functions and uses advanced techniques like **`DocumentFragment` batching** for DOM updates, making it significantly faster for list rendering. |
| **Size** | **Tiny (~10 KB)** | **Large (~85 KB)** | Faster page loads, less JavaScript to parse and execute. |
| **Event System** | Native `addEventListener` & `CustomEvent` | Proprietary Synthetic Events | Core JS events are standard and **interoperable** with any other JS code or framework. |
| **Async** | **Promise-first (native)** | `Deferred` objects (historically) | Core JS aligns perfectly with modern `async/await` syntax and native Promises. |
| **Transparency** | **High** | **Low ("Magic")** | The Core JS source is simple, readable, and easy to debug, making it a great learning tool. |

In short, **Core JS gives you the ergonomic, chainable syntax you love, without the weight and overhead of supporting legacy browsers.** It is the ideal choice for new projects where performance and adherence to web standards are a priority.

## Getting Started

Simply include the `core.js` file in your HTML using a `<script>` tag before your own application scripts.

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Awesome Page</title>
</head>
<body>
    <!-- Your HTML content -->

    <script src="path/to/core.js"></script>
    <script src="path/to/my-app.js"></script>
</body>
</html>
```

## Core Concepts

### The `J` Function

The `J` function is the entry point for everything.

**1. Selecting Elements:**
Pass a CSS selector to select elements from the DOM.

```javascript
// Select all elements with the class 'card'
const cards = J('.card');
```

**2. Creating New Elements:**
Pass a string of HTML to create new DOM elements in memory.

```javascript
// Create a new paragraph element
const newParagraph = J('<p class="new-item">This is a new paragraph.</p>');
```

### Chaining

Most methods return the `J` object itself, allowing you to "chain" multiple actions together in a single, fluent statement.

```javascript
J('.alert-message')
  .addClass('active')        // Add a class
  .css({ color: 'darkred' }) // Set some CSS
  .text('Warning: Please review your entry.')
  .on('click', function() {  // Add a click event
    J(this).remove();
  });
```

## API Reference

### DOM Traversal

#### `find(selector)`
Gets the descendant elements of each element in the current set, filtered by a selector.
*   **Returns**: A new `J` instance containing the found elements.
```javascript
J('#main-content').find('p.highlight').css('background', 'yellow');
```

#### `children([selector])`
Gets the direct children of each element, optionally filtered by a selector.
*   **Returns**: A new `J` instance containing the children.
```javascript
J('#list').children('li:nth-child(even)').addClass('striped');
```

#### `parent()`
Gets the direct parent of each element in the set.
*   **Returns**: A new `J` instance containing the unique parent elements.
```javascript
J('.icon').parent().addClass('has-icon');
```

#### `closest(selector)`
Travels up the DOM tree from each element to find the first ancestor that matches the selector.
*   **Returns**: A new `J` instance containing the found ancestors.
```javascript
// A common pattern in event handlers:
J(event.target).closest('.list-item').remove();
```

---
### DOM Manipulation (Optimized)

All DOM insertion methods in Core JS are highly optimized. When you provide multiple elements to insert, they automatically use a `DocumentFragment` to batch the DOM updates into a single operation, resulting in significantly better performance for list rendering.



#### `append(content)`
Inserts content to the end of each element in the set.
*   **`content`** (String | Node | `J` instance): Content to insert.
```javascript
J('#list').append('<li>New final item</li>');
```

#### `prepend(content)`
Inserts content to the beginning of each element in the set.
*   **`content`** (String | Node | `J` instance): Content to insert.
```javascript
J('#list').prepend('<li>New first item</li>');
```

#### `before(content)`
Inserts content before each element in the set.
*   **`content`** (String | Node | `J` instance): Content to insert.
```javascript
J('.post').before('<hr class="post-divider">');
```

#### `after(content)`
Inserts content after each element in the set.
*   **`content`** (String | Node | `J` instance): Content to insert.
```javascript
J('.post-title').after('<p class="author">By Core JS</p>');
```

#### `clone()`
Creates a deep copy of the set of matched elements.
*   **Returns**: A new `J` instance containing the cloned elements.
```html
<div class="card-template" style="display:none;"><h2>Card Title</h2></div>
```
```javascript
const newCard = J('.card-template').clone();
newCard.removeClass('card-template').css('display', 'block');
J('#container').append(newCard);
```

#### `remove()`
Removes the elements from the DOM.
```javascript
J('.temporary-message').remove();
```

#### `empty()`
Removes all child nodes from the set of matched elements.
```javascript
J('#results').empty();
```

#### `html([htmlString])`
Gets the HTML contents of the first element, or sets the HTML contents of every element.
```javascript
// Get
const content = J('#main').html();
// Set
J('#main').html('<h2>New Title</h2><p>New content.</p>');
```

#### `text([textString])`
Gets the combined text contents of elements, or sets the text content of every element.
```javascript
// Get
const headerText = J('h1').text();
// Set
J('h1').text('A Simpler Title');
```

---
### CSS, Attributes & Data

#### `addClass(classNames)`
Adds one or more space-separated classes to each element.
```javascript
J('.card').addClass('active highlighted');
```

#### `removeClass(classNames)`
Removes one or more space-separated classes from each element.
```javascript
J('.card').removeClass('disabled');
```

#### `toggleClass(classNames)`
Toggles one or more space-separated classes for each element.
```javascript
J('#nav').toggleClass('is-open');
```

#### `attr(name, [value])`
Gets an attribute value, or sets an attribute for every element.
```javascript
// Get
const linkUrl = J('a').attr('href');
// Set
J('img').attr('alt', 'A descriptive image caption');
```

#### `css(prop, [value])`
Gets a computed style property, or sets one or more CSS properties.
```javascript
// Get
const fontSize = J('p').css('font-size');
// Set multiple
J('.box').css({ backgroundColor: '#f0f0f0', padding: '1rem' });
```

#### `data(key, [value])`
Gets or sets a `data-*` attribute value. Use camelCase for keys (e.g., `userId` for `data-user-id`).
```html
<div id="user" data-user-id="123"></div>
```
```javascript
// Get
const userId = J('#user').data('userId'); // "123"
// Set
J('#user').data('lastLogin', '2023-10-28'); // Sets data-last-login
```

---
### Event Handling

#### `on(eventType, [selector], handler)`
Attaches an event handler for direct or delegated events.
*   **`eventType`** (String): An event name like `click`.
*   **`selector`** (String, optional): A selector for event delegation.
*   **`handler`** (Function): The function to execute.
```javascript
// Direct event
J('.save-button').on('click', () => console.log('Saved!'));
// Delegated event
J('#user-list').on('click', '.delete-btn', function() {
  J(this).closest('li').remove();
});
```

#### `off(eventType, [handler])`
Removes an event handler. If `handler` is omitted, all handlers for that event type are removed.
```javascript
function onFirstClick() { /* ... */ }
J('.btn').on('click', onFirstClick);
// Remove a specific handler
J('.btn').off('click', onFirstClick);
// Remove all click handlers
J('.btn').off('click');
```

#### `trigger(eventType, [data])`
Programmatically executes all handlers for a given event. Use `event.detail` to access passed `data`.
```javascript
// Listen for a custom event
J(document).on('user:login', (e) => {
    console.log(`User ${e.detail.username} logged in!`);
});
// Trigger it from somewhere else
J(document).trigger('user:login', { username: 'Alex' });
```

---
### Form Handling

#### `serialize()`
Encodes a set of form elements as a string for submission.
*   **Returns**: (String) A URL-encoded string (e.g., `name=value&other=value2`).
```html
<form id="register-form">
    <input type="text" name="username" value="Alex">
    <input type="email" name="email" value="alex@example.com">
</form>
```
```javascript
J('#register-form').on('submit', function(e) {
  e.preventDefault();
  const formData = J(this).serialize(); // "username=Alex&email=alex%40example.com"
  console.log(formData);
});
```

---
### AJAX

All AJAX methods return a native Promise for easy chaining with `.then()`/`.catch()` and `async/await`.

#### `J.ajax(options)`
Performs a customizable AJAX request.
```javascript
J.ajax({
  url: 'https://api.example.com/data',
  method: 'POST',
  data: { id: 1, name: 'Core JS' },
  headers: { 'X-CUSTOM-HEADER': 'MyValue' }
})
.then(response => console.log(response))
.catch(error => console.error(error));
```

#### `J.get(url, [data], [success])`
A shortcut for a GET request.
```javascript
J.get('https://api.example.com/posts', { category: 'news' })
  .then(posts => console.log('Fetched posts:', posts));
```

#### `J.post(url, [data], [success])`
A shortcut for a POST request.
```javascript
const newUser = { name: 'Jane Doe', email: 'jane@example.com' };
J.post('https://api.example.com/users', newUser)
  .then(response => console.log('User created:', response));
```

---
### Utilities

#### `J.ready(handler)`
Executes a function when the DOM is fully loaded and parsed.
```javascript
J.ready(() => {
  console.log('Document is ready!');
});
```

#### `each(callback)`
Iterates over the set of matched elements, executing a function for each one.
```javascript
J('li').each(function(index, element) {
  console.log(`Item ${index}: ${J(this).text()}`);
});
```

---
## Complete Example: Fetch and Display Data

This example demonstrates how to use several library features together.

### HTML

```html
<h1>User List</h1>
<button id="load-users">Load Users</button>
<ul id="user-list"></ul>
```

### JavaScript (`my-app.js`)

```javascript
J.ready(() => {
    const userList = J('#user-list');
    const loadButton = J('#load-users');

    loadButton.on('click', async function() {
        // Disable the button and show a loading message
        J(this).attr('disabled', true).text('Loading...');

        try {
            const users = await J.get('https://jsonplaceholder.typicode.com/users');
            
            // Clear any existing list items before adding new ones
            userList.empty();

            // Iterate and append users
            users.forEach(user => {
                const listItem = J(`
                    <li>
                        <strong>${user.name}</strong> (${user.email})
                        <p>Website: ${user.website}</p>
                    </li>
                `);
                userList.append(listItem);
            });

            // We are done, so remove the button
            loadButton.remove();

        } catch (err) {
            userList.html('<li>Error loading users. Please try again.</li>');
            console.error('AJAX Error:', err);
            // Re-enable the button in case of an error
            loadButton.attr('disabled', null).text('Load Users');
        }
    });
});
```

---
## Extending Core JS with Plugins

Core JS is designed to be easily extensible. You can add your own methods to the `J.fn` prototype to create reusable plugins.

**Pattern:**
```javascript
J.fn.myPlugin = function(options) {
  // `this` refers to the Core JS object (the collection of elements)
  return this.each(function() {
    // `this` inside `each` is the raw DOM element
    J(this).css('color', options.color || 'orange');
  });
};

// Usage:
J('.special').myPlugin({ color: 'purple' });
```

For a complete, real-world example of this pattern, see the documentation for our official **Core Select** plugin, a powerful, modern select box replacement.

---

## License

Core JS is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).
