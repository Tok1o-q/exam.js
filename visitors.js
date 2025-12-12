document.addEventListener('DOMContentLoaded', () => {
    loadVisitors();

    const addVisitorForm = document.getElementById('addVisitorForm');
    if (addVisitorForm) {
        addVisitorForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let name = document.getElementById('visitorName').value.trim();
            let phone = document.getElementById('visitorPhone').value.trim();
            let purpose = document.getElementById('visitorPurpose').value.trim();

            if (name && phone && purpose) {
                saveVisitor(name, phone, purpose);
                this.reset();
                loadVisitors();
            } else {
                alert('Заповніть усі поля!');
            }
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

    if (newName && newPhone && newPurpose) {
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