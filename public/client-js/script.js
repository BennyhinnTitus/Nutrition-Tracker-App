// document.getElementById('User-TargetForm').addEventListener('submit', async (e) => {
//     e.preventDefault(); 

//     console.log('User-Target Data Submitted');

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
//       const res = await fetch('/api/user/user-target-data', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             name: data.name,
//             email: data.email,
//             height: data.height,
//             weight: data.weight,
//             age: data.age,
//             target_water_intake: data.target_water_intake,
//             target_body_weight: data.target_body_weight,
//             target_cal_intake: data.target_cal_intake,
//             target_cal_burn: data.target_cal_burn,
//         })
//       });
      
//       const result = await res.json();
//       const id = result.id;
//       localStorage.setItem("userId", id);
//       console.log(result.message);
//     }
//     catch (error) {
//       console.error('Error submitting user data:', error);
//       alert('Something went wrong. Please try again.');
//     }
//   });






 const userBox = document.getElementById("userDetailsBox");
    const email = localStorage.getItem("userEmail");
    
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
        userBox.innerHTML = `
        <p><strong>Name:</strong> ${userData.user_name}</p>
        <p><strong>Email:</strong> ${userData.user_email}</p>
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





const showProgessBox = document.getElementById("showProgressBox");
showProgessBox.innerText = 'Update Your Stats To See Progress!';





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
        <h4>1. Water Goal (${daily.water} / ${targetData.target_water_intake})</h4>
        <p>Achieved ${Math.round((daily.water / targetData.target_water_intake) * 100)}%</p>
        <h4>2. Calorie Burns (${daily.cal_burn} / ${targetData.target_cal_burn})</h4>
        <p>Achieved ${Math.round((daily.cal_burn / targetData.target_cal_burn) * 100)}%</p>
        <h4>3. Calorie Intakes (${daily.cal_intake} / ${targetData.target_cal_intake})</h4>
        <p>Reached ${Math.round((daily.cal_intake / targetData.target_cal_intake) * 100)}%</p>
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


