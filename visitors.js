
document.addEventListener('DOMContentLoaded', () => {
    loadVisitors();

    const addVisitorForm = document.getElementById('addVisitorForm');
    if (addVisitorForm) {
        addVisitorForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let name = document.getElementById('visitorName').value.trim();
            let phone = document.getElementById('visitorPhone').value.trim();
            let purpose = document.getElementById('visitorPurpose').value.trim();

            // Перевірка номера телефону (тільки цифри, довжина 10-13 символів)
            const phoneRegex = /^\+?\d{10,13}$/;

            if (!name || !phone || !purpose) {
                alert('Заповніть усі поля!');
                return;
            }

            if (!phoneRegex.test(phone)) {
                alert('Некоректний номер телефону! Введіть 10-13 цифр, можна з + на початку.');
                return;
            }

            saveVisitor(name, phone, purpose);
            this.reset();
            loadVisitors();
        });
    }

    const searchVisitor = document.getElementById('searchVisitor');
    if (searchVisitor) {
        searchVisitor.addEventListener('keyup', function () {
            let filter = this.value.toLowerCase();
            let rows = document.querySelectorAll('#visitorsTable tbody tr');
            let regex = new RegExp(filter, 'gi');

            rows.forEach(row => {
                let cells = row.querySelectorAll('td');
                let matchFound = false;

                cells.forEach((cell, index) => {
                    if (index < 3) {
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
});

function saveVisitor(name, phone, purpose) {
    let visitors = JSON.parse(localStorage.getItem('visitors')) || [];
    visitors.push({ name, phone, purpose });
    localStorage.setItem('visitors', JSON.stringify(visitors));
}

function loadVisitors() {
    let visitors = JSON.parse(localStorage.getItem('visitors')) || [];
    let tableBody = document.querySelector('#visitorsTable tbody');
    tableBody.innerHTML = '';

    if (visitors.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">Немає відвідувачів</td></tr>';
        return;
    }

    visitors.forEach(visitor => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${visitor.name}</td>
            <td>${visitor.phone}</td>
            <td>${visitor.purpose}</td>
            <td>
                <button class="edit-btn">Редагувати</button>
                <button class="delete-btn">Видалити</button>
            </td>
        `;

        row.querySelector('.delete-btn').addEventListener('click', () => {
            deleteVisitor(visitor.name);
            row.remove();
        });

        row.querySelector('.edit-btn').addEventListener('click', () => {
            editVisitor(visitor.name, row);
        });

        tableBody.appendChild(row);
    });
}

function deleteVisitor(name) {
    let visitors = JSON.parse(localStorage.getItem('visitors')) || [];
    visitors = visitors.filter(v => v.name !== name);
    localStorage.setItem('visitors', JSON.stringify(visitors));
}

function editVisitor(oldName, row) {
    let cells = row.querySelectorAll('td');
    let newName = prompt("Нове ім'я:", cells[0].innerText);
    let newPhone = prompt("Новий телефон:", cells[1].innerText);
    let newPurpose = prompt("Нова мета:", cells[2].innerText);

    const phoneRegex = /^\+?\d{10,13}$/;

    if (newName && newPhone && newPurpose) {
        if (!phoneRegex.test(newPhone)) {
            alert('Некоректний номер телефону! Введіть 10-13 цифр, можна з + на початку.');
            return;
        }

        cells[0].innerText = newName;
        cells[1].innerText = newPhone;
        cells[2].innerText = newPurpose;

        let visitors = JSON.parse(localStorage.getItem('visitors')) || [];
        let index = visitors.findIndex(v => v.name === oldName);
        if (index !== -1) {
            visitors[index] = { name: newName, phone: newPhone, purpose: newPurpose };
            localStorage.setItem('visitors', JSON.stringify(visitors));
        }
    } else {
        alert('Некоректні дані!');
    }
}
