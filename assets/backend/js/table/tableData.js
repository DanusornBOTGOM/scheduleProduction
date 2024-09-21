// ตัวแปรสำหรับเก็บวันที่และข้อมูลทั้งหมด
let selectedDate = null;
let allData = [];

// ฟังก์ชันสำหรับดึงข้อมูลจาก API
async function fetchData() {
    try {
        const url = 'http://192.168.1.42:5050/backend/showproduct';
        const response = await fetch(url);
        allData = await response.json();
        filterAndPopulateTables();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// ฟังก์ชันสำหรับกรองข้อมูลและแสดงในตาราง
function filterAndPopulateTables() {
    let filteredData = allData;
    if (selectedDate) {
        filteredData = allData.filter(item => {
            const itemDate = new Date(item.PrintTime).toISOString().split('T')[0];
            return itemDate === selectedDate;
        });
    }
    populateBarChartTable(filteredData);
    populateNCRTable(filteredData);
}

// ฟังก์ชันสำหรับเพิ่มข้อมูลลงในตาราง Bar Chart
function populateBarChartTable(data) {
    const tableBody = document.querySelector('#barChartTable tbody');
    tableBody.innerHTML = ''; // ล้างข้อมูลเดิมในตาราง
    data.forEach(item => {
        const row = `<tr>
            <td>${item.DocNo}</td>
            <td>${item.Productionquantity}</td>
            <td>${item.WOut}</td>
            <td>${item.MachineCode2}</td>
            <td><div contenteditable="true" class="note-div" data-docno="${item.DocNo}">${item.Note || ''}</div></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
    addNoteEventListeners('barChart');
}

// ฟังก์ชันสำหรับเพิ่มข้อมูลลงในตาราง NCR
function populateNCRTable(data) {
    const tableBody = document.querySelector('#ncrTable tbody');
    tableBody.innerHTML = ''; // ล้างข้อมูลเดิมในตาราง
    data.forEach(item => {
        const row = `<tr>
            <td>${item.DocNo}</td>
            <td>${item.MachineCode2}</td>
            <td>${item.NC}</td>
            <td><div contenteditable="true" class="note-div" data-docno="${item.DocNo}">${item.Note || ''}</div></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
    addNoteEventListeners('ncr');
}

// ฟังก์ชันเพิ่ม event listeners สำหรับช่องหมายเหตุ
function addNoteEventListeners(tableType) {
    const noteDivs = document.querySelectorAll(`#${tableType}Table .note-div`);
    noteDivs.forEach(div => {
        div.addEventListener('blur', function() {
            const docNo = this.getAttribute('data-docno');
            const newNote = this.textContent;
            updateNote(tableType, docNo, newNote);
        });
    });
}

// ฟังก์ชันอัพเดทหมายเหตุ
async function updateNote(tableType, docNo, newNote) {
    try {
        const response = await fetch(`http://192.168.1.42:5000/backend/updatenote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tableType, docNo, newNote }),
        });
        if (!response.ok) {
            throw new Error('Failed to update note');
        }
        console.log('Note updated successfully');
    } catch (error) {
        console.error('Error updating note:', error);
    }
}

// ฟังก์ชันสำหรับกรองข้อมูลตามวันที่
function filterData() {
    selectedDate = document.getElementById('selectedDate').value;
    filterAndPopulateTables();
}

// เพิ่ม event listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchData(); // โหลดข้อมูลเริ่มต้น
    document.getElementById('filterButton').addEventListener('click', filterData);
});