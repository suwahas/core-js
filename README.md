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
*   **`content`** (String | Node | Node[] | `J` instance): Content to insert.
```javascript
const newItems = ['<li>Apple</li>', '<li>Orange</li>'];
// This is highly optimized, even though it looks simple:
J('#fruit-list').append(newItems.join(''));
```

#### `prepend(content)`
Inserts content to the beginning of each element in the set.
```javascript
J('#task-list').prepend('<div class="list-header">Today\'s Tasks</div>');
```

#### `before(content)`
Inserts content before each element in the set.
```javascript
J('.post').before('<hr>');
```

#### `after(content)`
Inserts content after each element in the set.
```javascript
J('.post-title').after('<p class="author">By Core JS</p>');
```

#### `clone()`
Creates a deep copy of the set of matched elements.
*   **Returns**: A new `J` instance containing the cloned elements.
```javascript
const template = J('#item-template').clone();
template.removeClass('template').text('New Item');
J('#container').append(template);
```

#### `remove()`
Removes the elements from the DOM.
```javascript
J('.old-banner').remove();
```

#### `empty()`
Removes all child nodes from the set of matched elements.
```javascript
J('#search-results').empty();
```

#### `html([htmlString])`
Gets the HTML contents of the first element, or sets the HTML contents of every element.
```javascript
// Get
const content = J('#main').html();
// Set
J('#main').html('<h2>New Content</h2>');
```

#### `text([textString])`
Gets the combined text contents of elements, or sets the text content of every element.
```javascript
// Get
const headerText = J('h1').text();
// Set
J('h1').text('Welcome to Core JS');
```

---
### CSS, Attributes & Data

#### `addClass(classNames)`
Adds one or more space-separated classes.
```javascript
J('.card').addClass('active highlighted');
```

#### `removeClass(classNames)`
Removes one or more space-separated classes.
```javascript
J('.card').removeClass('disabled');
```

#### `toggleClass(classNames)`
Toggles one or more space-separated classes.
```javascript
J('#nav').toggleClass('is-open');
```

#### `attr(name, [value])`
Gets an attribute value, or sets an attribute.
```javascript
J('img').attr('alt', 'A descriptive image caption');
```

#### `css(prop, [value])`
Gets a computed style property, or sets one or more CSS properties.
```javascript
J('.box').css({ backgroundColor: '#f0f0f0', padding: '1rem' });
```

#### `data(key, [value])`
Gets or sets a `data-*` attribute value. Use camelCase for keys (e.g., `userId` for `data-user-id`).
```javascript
const userId = J('#user-profile').data('userId');
```

---
### Event Handling

#### `on(eventType, [selector], handler)`
Attaches an event handler for direct or delegated events.
```javascript
// Direct event
J('.save-button').on('click', () => console.log('Saved!'));
// Delegated event (more performant for lists)
J('#task-list').on('click', '.delete-btn', function() {
  J(this).closest('li').remove();
});
```

#### `off(eventType, [handler])`
Removes an event handler.
```javascript
J('.btn').off('click'); // Removes all click handlers
```

#### `trigger(eventType, [data])`
Programmatically executes all handlers for a given event. Use `event.detail` to access passed `data`.
```javascript
J(document).trigger('user:login', { username: 'Alex' });
```

---
### Form Handling

#### `serialize()`
Encodes a set of form elements as a string for submission.
*   **Returns**: (String) A URL-encoded string.
```javascript
const formData = J('#register-form').serialize();
// formData -> "username=Alex&email=alex%40example.com"
```

---
### AJAX

All AJAX methods return a native Promise for easy chaining with `.then()`/`.catch()` and `async/await`.

#### `J.ajax(options)`
Performs a customizable AJAX request.

#### `J.get(url, [data])`
A shortcut for a GET request.

#### `J.post(url, [data])`
A shortcut for a POST request.

---
### Utilities

#### `J.ready(handler)`
Executes a function when the DOM is fully loaded and parsed.
```javascript
J.ready(() => {
  console.log('Document is ready! Let\'s go!');
});
```

#### `each(callback)`
Iterates over the set of matched elements.
```javascript
J('li').each(function(index, element) {
  J(this).text(`Item #${index + 1}`);
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
## Complete Example: Fetch and Display Data

This example demonstrates how to use several library features together to fetch a list of users and display them on the page.

### HTML

```html
<h1>User List</h1>
<button id="load-users">Load Users</button>
<div id="user-list"></div>
```

### JavaScript

```javascript
J.ready(() => {
    const userList = J('#user-list');
    const loadButton = J('#load-users');

    loadButton.on('click', async function() {
        J(this).attr('disabled', true).text('Loading...');

        try {
            const users = await J.get('https://jsonplaceholder.typicode.com/users');
            
            userList.empty();

            // Create an array of HTML strings
            const userHtml = users.map(user => `
                <div class="user-card">
                    <strong>${user.name}</strong> (${user.email})
                </div>
            `);
            
            // Append all users at once with our optimized .append() method
            userList.append(userHtml.join(''));

            loadButton.remove();
        } catch (err) {
            userList.html('<p class="error">Error loading users. Please try again.</p>');
            J(this).attr('disabled', null).text('Load Users');
        }
    });
});
```

## License

Core JS is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).
