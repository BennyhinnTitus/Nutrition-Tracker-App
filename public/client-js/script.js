// document.getElementById('userDataForm').addEventListener('submit', async (e) => {
//     e.preventDefault(); 

//     console.log('🚀 User Data Form Submitted');

//     const formData = new FormData(e.target);
//     const data = Object.fromEntries(formData.entries());

//     for (const [key, value] of Object.entries(data)) {
//       console.log(`${key}: ${value}`); 
//       if (!value.trim()) {
//         alert(`Please fill in the ${key} field.`);
//         return;
//       }
//     }

//     try {
//       const res = await fetch('/api/user/user-fitness-data', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/client-json' },
//         body: JSON.stringify({
//             name: data.name,
//             email: data.email,
//             height: data.height,
//             weight: data.weight,
//             age: data.age
//         })
//       });

//       const result = await res.json();
//       alert(result.message);

//       window.location.href = "targetdata.html";
//     }
//     catch (error) {
//       console.error('Error submitting user data:', error);
//       alert('Something went wrong. Please try again.');
//     }
//   });


// document.getElementById('targetDataForm').addEventListener('submit', async (e) => {
//       e.preventDefault();

//         console.log('🚀 Target Data Form Submitted');

//       const formData = new FormData(e.target);
//       const data = Object.fromEntries(formData.entries());

//       for (const [key, value] of Object.entries(data)) {
//       console.log(`${key}: ${value}`);

//         if (!value.trim()) {
//           alert(`Please fill in the ${key} field`);
//           return;
//         }
//       }

//       try {
//         const res = await fetch('/api/user/user-target', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/client-json' },
//           body: JSON.stringify({
//             water_intake: data.target_water_intake,
//             body_weight: data.target_body_weight,
//             calorie_intake: data.target_calorie_intake,
//             calorie_burn: data.target_calorie_burn,
//           }),
//         });

//         const result = await res.json();
//         alert(result.message);

//         window.location.href = 'index.html';
//       }

//       catch (error) {
//         console.error('Error submitting you data: ', error);
//         alert("Oops! Something went wrong, please try again later.");
//       }
//     });


 const userBox = document.getElementById("userDetailsBox");
    const email = localStorage.getItem("userEmail");
    async function fetchUserData() {
    console.log("Email used in fetch:", email);

      if (!email) {
        userBox.innerHTML = "No user email found in localStorage!";
        return;
      }
    try {
      const res = await fetch(` /api/user/user-index/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/client-json',
      },
    });

    const result = await res.json();
   
      if (result.success) {
        const userData = result.data;
        userBox.innerHTML = `
        <p><strong>Name:</strong> ${userData.name}</p>
        <p><strong>Email:</strong> ${userData.email}</p>
        <p><strong>Weight:</strong> ${userData.weight} kg</p>
        <p><strong>Height:</strong> ${userData.height} cm</p>
        <p><strong>Age:</strong> ${userData.age}</p>
      `;
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
  fetchUserData();
//   END OF USERDATA

document.getElementById('dailyStatForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    let daily = JSON.parse(localStorage.getItem("dailyProgress")) || {
      water: 0,
      weight: 75,
      cal_intake: 0,
      cal_burn: 0,
    };


    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    console.log('🚀 Submitted Form Data:');

    if (!data.water.trim() && !data.intake.trim() && !data.burn.trim() && !data.weight.trim()) {
      alert('You did nothing...');
      return;
    }

    daily.water += Number(data.water);
    daily.weight = Number(data.weight); 
    daily.cal_intake += Number(data.intake);
    daily.cal_burn += Number(data.burn);

    localStorage.setItem("dailyProgress", JSON.stringify(daily));


    try {
      const res = await fetch('/api/progress/daily-progress', {
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
      console.log('🚀 Response from server:', result);

      if (result.success) {
          const target = {
            water: 4000,
            weight: 68,
            cal_intake: 2000,
            cal_burn: 500
        };

        const showProgessBox = document.getElementById("showProgressBox");
        showProgessBox.innerHTML = `
        <h4>1. Water Goal (${daily.water} / ${target.water})</h4>
        <p>Achieved ${Math.round((daily.water / target.water) * 100)}%</p>
        <h4>2. Calorie Burns (${daily.cal_burn} / ${target.cal_burn})</h4>
        <p>Achieved ${Math.round((daily.cal_burn / target.cal_burn) * 100)}%</p>
        <h4>3. Calorie Intakes (${daily.cal_intake} / ${target.cal_intake})</h4>
        <p>Reached ${Math.round((daily.cal_intake / target.cal_intake) * 100)}%</p>
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

// END OF DAILY STATISTICS AND PROGRESS