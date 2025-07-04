const userTargetForm = document.getElementById('User-TargetForm');
if (userTargetForm) {
    userTargetForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        console.log('User-Target Data Submitted');

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

    for (const [key, value] of Object.entries(data)) {
      console.log(`${key}: ${value}`); 
      if (!value.trim()) {
        alert(`Please fill in the ${key} field.`);
        return;
      }
    }

    try {
      const res = await fetch('/api/user/user-target-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: data.name,
            email: data.email,
            height: data.height,
            weight: data.weight,
            age: data.age,
            target_water_intake: data.target_water_intake,
            target_body_weight: data.target_body_weight,
            target_cal_intake: data.target_cal_intake,
            target_cal_burn: data.target_cal_burn,
        })
      });
      
      const result = await res.json();
      const id = result.id;
      localStorage.setItem("userId", id);
      console.log(result.message);
      window.location.href = '/';
    }
    catch (error) {
      console.error('Error submitting user data:', error);
      alert('Something went wrong. Please try again.');
    }
  });
}






 const userBox = document.getElementById("user-icon-id");
    const email = localStorage.getItem("userEmail");
    let isUserDataVisible = false;
    
    async function fetchUserData() {
      if (!email) {
        
        userBox.innerHTML = "No user email found in localStorage!";
        return;
      }
    try {
      const res = await fetch(`/api/user/user-index/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await res.json();
   
      if (result.success) {
        const userData = result.user;
      if (!isUserDataVisible) {
        // Show user info
        userBox.innerHTML = `

          <div id="user-data">
            <button id="user-icon-button" onclick="fetchUserData()">
              <i class="fa-solid fa-user fa-xl" style="color: #ffffff;"></i>
            </button>
            <p><span>Name   :</span> ${userData.user_name}</p>
            <p><span>Email  :</span> ${userData.user_email}</p>
            <p><span>Weight :</span> ${userData.weight} kg</p>
            <p><span>Height :</span> ${userData.height} cm</p>
            <p><span>Age    :</span> ${userData.age}</p>
          </div>
        `;
        isUserDataVisible = true;
      } else {
        // Hide user info (show only icon)
        userBox.innerHTML = `
          <button id="user-icon-button" onclick="fetchUserData()">
            <i class="fa-solid fa-user fa-xl" style="color: #ffffff;"></i>
          </button>
        `;
        isUserDataVisible = false;
      }
      }
      else {
        userBox.innerHTML = "User data not found!";
      }
      
    }
    
    catch (err) {
      console.error(err);
      userBox.innerHTML = "Error fetching user data!";
    }
  }
  





const showProgessBox = document.getElementById("showProgressBox");
// showProgessBox.innerText = 'Update Your Stats To See Progress!';

document.getElementById('dailyStatForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log('🚀 Submitted Form Data:');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (!data.water.trim() && !data.intake.trim() && !data.burn.trim() && !data.weight.trim()) {
      alert('You did nothing...');
      return;
    }

    try {
      const email = localStorage.getItem("userEmail");
      console.log('🚀 Email from localStorage:', email);

      const res = await fetch(`/api/progress/daily-progress/${email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // email: localStorage.getItem("userEmail"),
        water: data.water,
        intake: data.intake,
        burn: data.burn,
        weight: data.weight
      }),
    });

      const result = await res.json();
      console.log('🚀 Response from server:', result.message);

      if (result.success) {
        const daily = result.dailyData;
        const targetData = result.target;

        const showProgessBox = document.getElementById("showProgressBox");
        showProgessBox.innerHTML = `
        <div class="div" id="div_1">
          <strong>Water Intake</strong>
          <p><span>${daily.water}</span> of ${targetData.target_water_intake} ml</p>
        </div>

        <div class="div" id="div_2">
          <strong>Calorie Burn</strong>
          <p><span>${daily.cal_burn}</span> of ${targetData.target_cal_burn} cal</p>
        </div>

        <div class="div" id="div_3">
          <strong>Calorie Intake</strong>
          <p><span>${daily.cal_intake}</span> of ${targetData.target_cal_intake} cal</p>
        </div>
        `;

        alert('Your progress has been successfully submitted!');
      } else {
        alert('Failed to submit your progress. Please try again.');
      }
  
    }

    catch (err) {
      console.error('Error submitting form:', err);
      alert('Failed to submit your progress. Please try again later.');
      return;
    }
});





async function fetchHistoryData() {
    const id = localStorage.getItem("userId");
    console.log('🚀 ID from localStorage:', id);
 if (id) {    
  try {
      const res = await fetch(`/api/progress/history/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();
      console.log('🚀 Response from server:', result.message);

      if (result.success) {
        const rows = result.data;
        console.log('🚀 History Data:', rows);

        const showHistoryBox = document.getElementById("showHistoryBox");
        // showHistoryBox.innerHTML = 'Your History';

      // Create table
      const table = document.createElement("table");
      table.border = "1";
      table.style.borderCollapse = "collapse";
      table.style.marginTop = "10px";
      table.style.width = "100%";

      // Header
      const headerRow = document.createElement("tr");
      Object.keys(rows[0]).forEach(col => {
        const th = document.createElement("th");
        th.textContent = col.replace(/_/g, " ").toUpperCase();
        th.style.padding = "8px";
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);

      // Rows
      rows.forEach(entry => {
        const row = document.createElement("tr");
        Object.values(entry).forEach(val => {
          const td = document.createElement("td");
          // if (typeof val === "string" && val.includes("T")) {
          //   td.textContent = new Date(val).toISOString().split("T")[0];
          // } else {
          //   td.textContent = val;
          // }
          td.textContent = val;
          td.style.padding = "6px";
          td.style.textAlign = "center";
          row.appendChild(td);
        });
        table.appendChild(row);
      });

      // Append table
      showHistoryBox.appendChild(table);

      } else {
        const showHistoryBox = document.getElementById("showHistoryBox");
        showHistoryBox.innerHTML = 'Make Your First Entry To See History!';
      }
    } catch (err) {
      console.error('Error fetching history data:', err);
      alert('Failed to fetch history data. Please try again later.');
    }}
    else {

    }
  }
document.addEventListener('DOMContentLoaded', fetchHistoryData);



function logout() {   
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    window.location.href = '/signup';
}
