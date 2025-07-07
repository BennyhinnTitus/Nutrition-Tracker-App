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
        userBox.innerHTML = `

          <div id="user-data">
          <div class="super">
            <div class="icon1" id="logout-icon-id">
              <button id="logoutButton" onclick="logout()" title="Click to logout"><i class="fa-solid fa-right-from-bracket fa-flip-horizontal fa-xl" style="color: #ffffff;"></i></button>
            </div>

            <div class="edit">
              <button id="edit_button" title="Edit your goals" onclick="window.location.href='/editGoals'"><i class="fa-solid fa-pen-to-square fa-xl" style="color: #ffffff;"></i></button>
            </div>

            <div class="icon3">
              <button onclick="fetchUserData()" id="close" title="Close"><i class="fa-solid fa-xmark fa-xl" style="color: #ffffff;"></i></button>
            </div>
          </div>
            <p><span>Name   :</span> ${userData.user_name}</p>
            <p><span>Email  :</span> ${userData.user_email}</p>
            <p><span>Weight :</span> ${userData.weight} kg</p>
            <p><span>Height :</span> ${userData.height} cm</p>
            <p><span>Age    :</span> ${userData.age}</p>
          </div>
        `;
        isUserDataVisible = true;
      } else {
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
const targetData = JSON.parse(localStorage.getItem("targetData"));


showProgessBox.innerHTML =  `
        <div class="div" id="div_1">
          <strong>Water Intake</strong>
          <p><span>0</span> of ${targetData.target_water_intake} ml</p>
          <div class="outter">
            <div class="inner" style="color: white">
            .
            </div>
          </div>
          <p class="percentage">0%</p>
        </div>

        <div class="div" id="div_2">
          <strong>Calorie Burn</strong>
          <p><span>0</span> of ${targetData.target_cal_burn} cal</p>
          <div class="outter">
            <div class="inner" style="color: white">
            .
            </div>
          </div>
          <p class="percentage">0%</p>
        </div>

        <div class="div" id="div_3">
          <strong>Calorie Intake</strong>
          <p><span>0</span> of ${targetData.target_cal_intake} cal</p>
          <div class="outter">
            <div class="inner" style="color: white">
            .
            </div>
          </div>
          <p class="percentage">0%</p>
        </div>

        <div class="div" id="div_4">
          <strong>Daily Weight</strong>
          <p><span>0</span> of ${targetData.target_body_weight} kg</p>
          <div class="outter">
            <div class="inner" style="color: white">
            .
            </div>
          </div>
          <p class="percentage">0%</p>
        </div>
        `;

const dailyStat = document.getElementById('dailyStatForm')
if(dailyStat){
dailyStat.addEventListener('submit', async (e) => {
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
        // const targetData = result.target;
        const targetData = JSON.parse(localStorage.getItem("targetData"));

        const showProgessBox = document.getElementById("showProgressBox");
        const water_percent = Math.round((daily.water / targetData.target_water_intake) * 100);
        const cal_burn_percent = Math.round((daily.cal_burn / targetData.target_cal_burn) * 100);
        const cal_intake_percent = Math.round((daily.cal_intake / targetData.target_cal_intake) * 100);
        const weight_percent = Math.round((daily.weight / targetData.target_body_weight) * 100);

        showProgessBox.innerHTML = `
        <div class="div" id="div_1">
          <strong>Water Intake</strong>
          <p><span>${daily.water}</span> of ${targetData.target_water_intake} ml</p>
          
          <div class="outter">
            <div class="inner" style="width: ${water_percent}%; color: teal;">
              .
            </div>
          </div>
          
          <p class="percentage">${water_percent}%</p>
        </div>

        <div class="div" id="div_2">
          <strong>Calorie Burn</strong>
          <p><span>${daily.cal_burn}</span> of ${targetData.target_cal_burn} cal</p>
          <div class="outter">
            <div class="inner" style="width: ${cal_burn_percent}%; color: teal;">
              .
            </div>
          </div>
          
          <p class="percentage">${cal_burn_percent}%</p>
        </div>

        <div class="div" id="div_3">
          <strong>Calorie Intake</strong>
          <p><span>${daily.cal_intake}</span> of ${targetData.target_cal_intake} cal</p>
          <div class="outter">
            <div class="inner" style="width: ${cal_intake_percent}%; color: teal;">
              .
            </div>
          </div>
          
          <p class="percentage">${cal_intake_percent}%</p>
        </div>

        <div class="div" id="div_4">
          <strong>Daily Weight</strong>
          <p><span>${daily.weight}</span> of ${targetData.target_body_weight} kg</p>
          <div class="outter">
            <div class="inner" style="width: ${weight_percent}%; color: teal;">
              .
            </div>
          </div>
          
          <p class="percentage">${weight_percent}%</p>
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

}





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
  }
document.addEventListener('DOMContentLoaded', fetchHistoryData);





function logout() {   
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    window.location.href = '/signup';
}


