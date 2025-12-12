document.addEventListener('DOMContentLoaded', () => {
    const reportBooksBtn = document.getElementById('reportBooks');
    const reportVisitorsBtn = document.getElementById('reportVisitors');
    const reportTransactionsBtn = document.getElementById('reportTransactions');
    const reportResult = document.getElementById('reportResult');

    reportBooksBtn.addEventListener('click', () => {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        if (books.length === 0) {
            reportResult.innerHTML = '<p>Немає даних про книги.</p>';
            return;
        }

        let totalBooks = books.length;
        let totalCount = books.reduce((sum, book) => sum + parseInt(book.count), 0);

        reportResult.innerHTML = `
            <h3>Звіт по книгах</h3>
            <p>Кількість назв книг: <strong>${totalBooks}</strong></p>
            <p>Загальна кількість примірників: <strong>${totalCount}</strong></p>
            <table>
                <thead><tr><th>Назва</th><th>Автор</th><th>Кількість</th></tr></thead>
                <tbody>
                    ${books.map(b => `<tr><td>${b.title}</td><td>${b.author}</td><td>${b.count}</td></tr>`).join('')}
                </tbody>
            </table>
        `;
    });
    reportVisitorsBtn.addEventListener('click', () => {
        let visitors = JSON.parse(localStorage.getItem('visitors')) || [];
        if (visitors.length === 0) {
            reportResult.innerHTML = '<p>Немає даних про відвідувачів.</p>';
            return;
        }

        reportResult.innerHTML = `
            <h3>Звіт по відвідувачах</h3>
            <p>Кількість відвідувачів: <strong>${visitors.length}</strong></p>
            <table>
                <thead><tr><th>Ім’я</th><th>Телефон</th><th>Мета</th></tr></thead>
                <tbody>
                    ${visitors.map(v => `<tr><td>${v.name}</td><td>${v.phone}</td><td>${v.purpose}</td></tr>`).join('')}
                </tbody>
            </table>
        `;
    });

    reportTransactionsBtn.addEventListener('click', () => {
        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        if (transactions.length === 0) {
            reportResult.innerHTML = '<p>Немає даних про операції.</p>';
            return;
        }

        let totalIssues = transactions.filter(t => t.action === 'issue').length;
        let totalReturns = transactions.filter(t => t.action === 'return').length;

        reportResult.innerHTML = `
            <h3>Звіт по операціях</h3>
            <p>Видач: <strong>${totalIssues}</strong></p>
            <p>Повернень: <strong>${totalReturns}</strong></p>
            <table>
                <thead><tr><th>Відвідувач</th><th>Книга</th><th>Дія</th><th>Дата</th></tr></thead>
                <tbody>
                    ${transactions.map(t => `
                        <tr>
                            <td>${t.visitor}</td>
                            <td>${t.book}</td>
                            <td>${t.action === 'issue' ? 'Видача' : 'Повернення'}</td>
                            <td>${t.date}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    });
});
