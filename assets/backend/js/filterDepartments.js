function filterDepartments() {
    const checkboxes = document.querySelectorAll(
      'input[name="department"]:checked'
    );
    const departments = Array.from(checkboxes).map((cb) => cb.value);

    console.log("Filtering for departments:", departments);

    fetch(`/backend/production/schedule?departments=${departments.join(",")}`, {
        headers: {
          Accept: "application/json",
        },
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Received data:", data);
        updateScheduleTable(data.schedule);
        document.getElementById("currentDepartment").textContent =
          data.departments.join(", ");
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById("scheduleTable").innerHTML =
          '<tr><td colspan="9">Error loading data</td></tr>';
      });
  }

  // เพิ่มฟังก์ชันนี้เพื่อเรียก filterDepartments เมื่อโหลดหน้า
  window.onload = filterDepartments;

  function updateScheduleTable(schedule) {
    console.log("Updating table with schedule:", schedule);
    const tableBody = document.querySelector("#scheduleTable tbody");
    if (!schedule || schedule.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="10">No data available for selected departments</td></tr>';
      return;
    }
    tableBody.innerHTML = schedule
      .map(
        (item) => `
  <tr>
    <td>${item.department}</td>
    <td>${item.product}</td>
    <td>${item.quantity}</td>
    <td>${new Date(item.startTime).toLocaleString()}</td>
    <td>${new Date(item.endTime).toLocaleString()}</td>
    <td>${item.status}</td>
    <td>
      <div class="progress">
        <div id="progress-${item.id}" class="progress-bar" role="progressbar"
          style="width: ${item.progress}%" aria-valuenow="${item.progress}" aria-valuemin="0"
          aria-valuemax="100">
          ${item.progress}%
        </div>
      </div>
    </td>
    <td>${item.timeLeft}</td>
    <td>
      <button class="btn btn-sm btn-primary" onclick="updateStatus('${item.id}')">
        <i class="fas fa-sync-alt"></i> Update
      </button>
    </td>
    <td>
      <input type="text" class="form-control" id="remark-${item.id}" name="remark" value="${item.remark || ''}">
    </td>
  </tr>
`
      )
      .join("");
  }

  function updateStatus(id) {
    const newStatus = prompt(
      "Enter new status (รอดำเนินการ, กำลังผลิต, เสร็จสิ้น):"
    );
    const newProgress = prompt("Enter new progress (0-100):");
    const newRemark = document.getElementById(`remark-${id}`).value;
    if (newStatus && newProgress) {
      fetch("/backend/production-schedule/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            status: newStatus,
            progress: newProgress,
            remark: newRemark
          }),
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            alert("Status updated successfully");
            filterDepartments(); // Update the table instead of reloading
          } else {
            alert("Failed to update status: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to update status: " + error.message);
        });
    }
  }

  function updateProgress() {
    fetch("/backend/production-metrics")
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("overallProgress").textContent =
          data.overallProgress;
        document.getElementById("progressBar").value = data.overallProgress;

        data.items.forEach((item) => {
          const progressElement = document.querySelector(
            `#progress-${item.id}`
          );
          if (progressElement) {
            progressElement.value = item.progress;
            progressElement.nextElementSibling.textContent = `${item.progress}%`;
          }
        });
      })
      .catch((error) => console.error("Error updating progress:", error));
  }

  // เรียกใช้ฟังก์ชันทุก 30 วินาที
  setInterval(updateProgress, 30000);

  // เรียกใช้ฟังก์ชันทันทีเมื่อโหลดหน้า
  window.onload = function () {
    filterDepartments();
    updateProgress();
  };