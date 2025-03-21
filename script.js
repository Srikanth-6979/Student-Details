document.addEventListener("DOMContentLoaded", function () {
    let students = [];

    function renderTable() {
        const tbody = document.querySelector("#studentTable tbody");
        tbody.innerHTML = "";

        students.forEach((student, index) => {
            const row = `<tr>
                <td>${student.name}</td>
                <td>${student.rollNumber}</td>
                <td>${student.branch}</td>
                <td>${student.year}</td>
                <td class="actions">
                    <button onClick="editStudent(${index})">Edit</button>
                    <button onClick="deleteStudent(${index})">Delete</button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });

        updateYearDropdown();
    }

    function updateYearDropdown() {
        const filterYearDropdown = document.getElementById("filterYear");
        filterYearDropdown.innerHTML = `<option value="">Select Year</option>`;
        
        const years = [...new Set(students.map(student => student.year))].sort();
        years.forEach(year => {
            const option = `<option value="${year}">${year}</option>`;
            filterYearDropdown.innerHTML += option;
        });
    }

    const originalSubmitFunction = document.getElementById("studentForm").onsubmit;

    document.getElementById("studentForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const rollNumber = document.getElementById("rollNumber").value;
        const branch = document.getElementById("branch").value;
        const year = parseInt(document.getElementById("year").value);

        if (name && rollNumber && branch && year) {
            students.push({ name, rollNumber, branch, year });
            renderTable();
            this.reset();
        } else {
            alert("Please fill in all fields before adding.");
        }
    });

    window.deleteStudent = function (index) {
        students.splice(index, 1);
        renderTable();
    };

    window.editStudent = function (index) {
        const student = students[index];
        document.getElementById("name").value = student.name;
        document.getElementById("rollNumber").value = student.rollNumber;
        document.getElementById("branch").value = student.branch;
        document.getElementById("year").value = student.year;

        document.getElementById("studentForm").onsubmit = function (e) {
            e.preventDefault();
            students[index] = {
                name: document.getElementById("name").value,
                rollNumber: document.getElementById("rollNumber").value,
                branch: document.getElementById("branch").value,
                year: parseInt(document.getElementById("year").value)
            };
            renderTable();
            this.reset();
            this.onsubmit = originalSubmitFunction;
        };
    };

    window.searchData = function () {
        const searchYear = document.getElementById("searchYear").value;
        const searchBranch = document.getElementById("searchBranch").value.toLowerCase();

        const filteredStudents = students.filter(student => {
            return (!searchYear || student.year == searchYear) && 
                   (!searchBranch || student.branch.toLowerCase().includes(searchBranch));
        });

        const tbody = document.querySelector("#studentTable tbody");
        tbody.innerHTML = "";
        filteredStudents.forEach((student) => {
            const originalIndex = students.indexOf(student);
            const row = `<tr>
                <td>${student.name}</td>
                <td>${student.rollNumber}</td>
                <td>${student.branch}</td>
                <td>${student.year}</td>
                <td class="actions">
                    <button onClick="editStudent(${originalIndex})">Edit</button>
                    <button onClick="deleteStudent(${originalIndex})">Delete</button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });
    };

    window.resetSearch = function () {
        document.getElementById("searchYear").value = "";
        document.getElementById("searchBranch").value = "";
        renderTable();
    };

    window.filterByYear = function () {
        const year = document.getElementById("filterYear").value;
        document.getElementById("searchYear").value = year;
        searchData();
    };

    renderTable();
});
