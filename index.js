
// books.html
document.addEventListener('DOMContentLoaded', () => {
    loadBooks();

    const searchInput = document.getElementById('searchMain');
    if (searchInput) {
        searchInput.addEventListener('keyup', function () {
            let filter = this.value.toLowerCase();
            let rows = document.querySelectorAll('#mainBooksTable tbody tr');
            let regex = new RegExp(filter, 'gi');

            rows.forEach(row => {
                let cells = row.querySelectorAll('td');
                let matchFound = false;

                cells.forEach((cell, index) => {
                    if (index < 4) {
                        let text = cell.textContent;
                        if (filter && text.toLowerCase().includes(filter)) {
                            matchFound = true;
                            cell.innerHTML = text.replace(regex, match => `<span class="highlight">${match}</span>`);
                        } else {
                            cell.innerHTML = text;
                        }
                    }
                });

                row.style.display = matchFound || filter === '' ? '' : 'none';
            });
        });
    }

    let sortDirectionMain = true;
    window.sortMainBooks = function (columnIndex) {
        let tableBody = document.querySelector('#mainBooksTable tbody');
        if (!tableBody) return;
        let rows = Array.from(tableBody.querySelectorAll('tr'));

        rows.sort((a, b) => {
            let valA = a.querySelectorAll('td')[columnIndex].innerText.trim().toLowerCase();
            let valB = b.querySelectorAll('td')[columnIndex].innerText.trim().toLowerCase();
            if (!isNaN(valA) && !isNaN(valB)) {
                return sortDirectionMain ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
            }
            return sortDirectionMain ? valA.localeCompare(valB) : valB.localeCompare(valA);
        });

        sortDirectionMain = !sortDirectionMain;
        rows.forEach(row => tableBody.appendChild(row));
    };

    const addBookForm = document.getElementById('addBookForm');
    if (addBookForm) {
        addBookForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let title = document.getElementById('bookTitle').value.trim();
            let author = document.getElementById('bookAuthor').value.trim();
            let publisher = document.getElementById('bookPublisher').value.trim();
            let count = document.getElementById('bookCount').value.trim();

            if (title && author && publisher && count >= 0) {
                saveBook(title, author, publisher, count);
                this.reset();
                window.location.href = 'books.html';
            } else {
                alert('Заповніть усі поля коректно!');
            }
        });
    }
});

function loadBooks() {
    let books = JSON.parse(localStorage.getItem('books')) || [];

    let tableBodyMain = document.querySelector('#mainBooksTable tbody');
    let tableBodyBooks = document.querySelector('#booksTable tbody');

    if (tableBodyMain) {
        tableBodyMain.innerHTML = '';
        books.forEach(book => {
            let row = createRow(book);
            tableBodyMain.appendChild(row);
        });
    }

    if (tableBodyBooks) {
        tableBodyBooks.innerHTML = '';
        if (books.length === 0) {
            tableBodyBooks.innerHTML = '<tr><td colspan="5">Немає доданих книг</td></tr>';
            return;
        }
        books.forEach(book => {
            let row = createRow(book);
            tableBodyBooks.appendChild(row);
        });
    }
}

function createRow(book) {
    let row = document.createElement('tr');
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.publisher}</td>
        <td>${book.count}</td>
        <td>
            <button class="edit-btn">Редагувати</button>
            <button class="delete-btn">Видалити</button>
        </td>
    `;

    row.querySelector('.delete-btn').addEventListener('click', () => {
        deleteBook(book.title);
        row.remove();
    });

    row.querySelector('.edit-btn').addEventListener('click', () => {
        editBook(book.title, row);
    });

    return row;
}

function saveBook(title, author, publisher, count) {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    books.push({ title, author, publisher, count });
    localStorage.setItem('books', JSON.stringify(books));
}

function deleteBook(title) {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    books = books.filter(b => b.title !== title);
    localStorage.setItem('books', JSON.stringify(books));
}

function editBook(oldTitle, row) {
    let cells = row.querySelectorAll('td');
    let newTitle = prompt('Нова назва:', cells[0].innerText);
    let newAuthor = prompt('Новий автор:', cells[1].innerText);
    let newPublisher = prompt('Нове видавництво:', cells[2].innerText);
    let newCount = prompt('Нова кількість:', cells[3].innerText);

    if (newTitle && newAuthor && newPublisher && newCount >= 0) {
        cells[0].innerText = newTitle;
        cells[1].innerText = newAuthor;
        cells[2].innerText = newPublisher;
        cells[3].innerText = newCount;

        let books = JSON.parse(localStorage.getItem('books')) || [];
        let index = books.findIndex(b => b.title === oldTitle);
        if (index !== -1) {
            books[index] = { title: newTitle, author: newAuthor, publisher: newPublisher, count: newCount };
            localStorage.setItem('books', JSON.stringify(books));
        }
    } else {
        alert('Некоректні дані!');
    }
}





