document.addEventListener('DOMContentLoaded', () => {
    loadTransactionData();
    populateSelects();

    const form = document.getElementById('transactionForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            let visitor = document.getElementById('visitorSelect').value;
            let book = document.getElementById('bookSelect').value;
            let action = document.getElementById('actionType').value;
            let date = new Date().toLocaleString();

            if (visitor && book && action) {
                saveTransaction(visitor, book, action, date);
                updateVisitorPurpose(visitor, action, book);
                updateBookCount(book, action);
                this.reset();
                loadTransactionData();
            } else {
                alert('Заповніть усі поля!');
            }
        });
    }
});

function populateSelects() {
    let visitors = JSON.parse(localStorage.getItem('visitors')) || [];
    let books = JSON.parse(localStorage.getItem('books')) || [];

    let visitorSelect = document.getElementById('visitorSelect');
    let bookSelect = document.getElementById('bookSelect');

    visitorSelect.innerHTML = '';
    bookSelect.innerHTML = '';

    visitors.forEach(v => {
        let option = document.createElement('option');
        option.value = v.name;
        option.textContent = v.name;
        visitorSelect.appendChild(option);
    });

    books.forEach(b => {
        let option = document.createElement('option');
        option.value = b.title;
        option.textContent = b.title;
        bookSelect.appendChild(option);
    });
}

function saveTransaction(visitor, book, action, date) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push({ visitor, book, action, date });
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadTransactionData() {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let tableBody = document.querySelector('#transactionsTable tbody');
    tableBody.innerHTML = '';

    if (transactions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">Немає операцій</td></tr>';
        return;
    }

    transactions.forEach((t, index) => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${t.visitor}</td>
            <td>${t.book}</td>
            <td>${t.action === 'issue' ? 'Видача' : 'Повернення'}</td>
            <td>${t.date}</td>
            <td><button class="delete-transaction">Видалити</button></td>
        `;

        row.querySelector('.delete-transaction').addEventListener('click', () => {
            deleteTransaction(index);
        });

        tableBody.appendChild(row);
    });
}

function deleteTransaction(index) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    loadTransactionData();
}

function updateVisitorPurpose(visitorName, action, bookTitle) {
    let visitors = JSON.parse(localStorage.getItem('visitors')) || [];
    let index = visitors.findIndex(v => v.name === visitorName);
    if (index !== -1) {
        let currentPurpose = visitors[index].purpose || '';
        let newPurpose = `${currentPurpose} | ${action === 'issue' ? 'Видано' : 'Повернено'}: ${bookTitle}`;
        visitors[index].purpose = newPurpose;
        localStorage.setItem('visitors', JSON.stringify(visitors));
    }
}

function updateBookCount(bookTitle, action) {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    let index = books.findIndex(b => b.title === bookTitle);
    if (index !== -1) {
        let count = parseInt(books[index].count);
        if (action === 'issue' && count > 0) {
            books[index].count = count - 1;
        } else if (action === 'return') {
            books[index].count = count + 1;
        }
        localStorage.setItem('books', JSON.stringify(books));
    }
}

if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', function () {
        let titleFilter = document.getElementById('searchTitle').value.toLowerCase();
        let authorFilter = document.getElementById('searchAuthor').value.toLowerCase();
        let publisherFilter = document.getElementById('searchPublisher').value.toLowerCase();
        let minCount = parseInt(document.getElementById('minCount').value) || 0;
        let maxCount = parseInt(document.getElementById('maxCount').value) || Infinity;

        let rows = document.querySelectorAll('#booksTable tbody tr');

        rows.forEach(row => {
            let cells = row.querySelectorAll('td');
            if (cells.length < 4) return;

            let title = cells[0].textContent.toLowerCase();
            let author = cells[1].textContent.toLowerCase();
            let publisher = cells[2].textContent.toLowerCase();
            let count = parseInt(cells[3].textContent);

            let matchTitle = !titleFilter || title.includes(titleFilter);
            let matchAuthor = !authorFilter || author.includes(authorFilter);
            let matchPublisher = !publisherFilter || publisher.includes(publisherFilter);
            let matchCount = count >= minCount && count <= maxCount;

            if (matchTitle && matchAuthor && matchPublisher && matchCount) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function () {
            let titleFilter = document.getElementById('searchTitle').value.toLowerCase();
            let authorFilter = document.getElementById('searchAuthor').value.toLowerCase();
            let publisherFilter = document.getElementById('searchPublisher').value.toLowerCase();
            let minCount = parseInt(document.getElementById('minCount').value) || 0;
            let maxCount = parseInt(document.getElementById('maxCount').value) || Infinity;

            let rows = document.querySelectorAll('#booksTable tbody tr');

            rows.forEach(row => {
                let cells = row.querySelectorAll('td');
                if (cells.length < 4) return;

                let title = cells[0].textContent.toLowerCase();
                let author = cells[1].textContent.toLowerCase();
                let publisher = cells[2].textContent.toLowerCase();
                let count = parseInt(cells[3].textContent);

                let matchTitle = !titleFilter || title.includes(titleFilter);
                let matchAuthor = !authorFilter || author.includes(authorFilter);
                let matchPublisher = !publisherFilter || publisher.includes(publisherFilter);
                let matchCount = count >= minCount && count <= maxCount;

                if (matchTitle && matchAuthor && matchPublisher && matchCount) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function () {
            document.getElementById('searchTitle').value = '';
            document.getElementById('searchAuthor').value = '';
            document.getElementById('searchPublisher').value = '';
            document.getElementById('minCount').value = '';
            document.getElementById('maxCount').value = '';

            let rows = document.querySelectorAll('#booksTable tbody tr');
            rows.forEach(row => row.style.display = '');
        });
    }
});