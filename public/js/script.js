// index.html

 const userBox = document.getElementById("userDetailsBox");
    const email = localStorage.getItem("userEmail");
    async function fetchUserData() {
    console.log("Email used in fetch:", email);

      if (!email) {
        userBox.innerHTML = "No user email found in localStorage!";
        return;
      }
    try {
      const res = await fetch(`http://localhost:3000/api/user/user-index/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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

    // let dailyData = {
    //   currentWeight: userData.weight,
    //   calorieIntake: 0,
    //   calorieBurn: 0,
    //   waterIntake: 0
    // };

document.getElementById('dailyStatForm').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    console.log('🚀 Submitted Form Data:');
    for (const [key, value] of Object.entries(data)) {
      console.log(`${key}: ${value}`);
      if (!value.trim()) {
        alert(`Please fill in the ${key} field.`);
        return;
      }
    }

    try {
          const res = await fetch('http://localhost:3000/api/progress/daily-progress', {
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
    function pushProgress() {
      const water = document.getElementById("water").value;
      const intake = document.getElementById("intake").value;
      const burn = document.getElementById("burn").value;
      const weight = document.getElementById("weight").value;

      if (!water && !intake && !burn && !weight) {
        alert("You did nothing...");
        return;
      }

      if (water) {
        dailyData.waterIntake += parseInt(water);
      }

      if (intake) {
        dailyData.calorieIntake += parseInt(intake);
      }

      if (burn) {
        dailyData.calorieBurn += parseInt(burn);
      }

      if (weight) {
        dailyData.currentWeight = parseFloat(weight);
      }
      updateProgress();
    }

    const targetData = JSON.parse(localStorage.getItem("targetData"));
    
    const showProgessBox = document.getElementById("showProgressBox");
    showProgessBox.innerHTML = `
    <h4>1. Water Goal (${dailyData.waterIntake} / ${targetData.water})</h4>
    <p>Achieved ${Math.round((dailyData.waterIntake / targetData.water) * 100)}%</p>
    <h4>2. Calorie Burns (${dailyData.calorieBurn} / ${targetData.burn})</h4>
    <p>Achieved ${Math.round((dailyData.calorieBurn / targetData.burn) * 100)}%</p>
    <h4>3. Calorie Intakes (${dailyData.calorieIntake} / ${targetData.intake})</h4>
    <p>Reached ${Math.round((dailyData.calorieIntake / targetData.intake) * 100)}%</p>
    <h4>4. Weight Loss (${dailyData.currentWeight} / ${userData.weight - targetData.target_weight})</h4>
    <p>Progressed ${Math.round((dailyData.currentWeight / targetData.target_weight) * 100)}%</p>
    `;

    function updateProgress() {
  const initialWeight = userData.weight;
  const targetWeight = targetData.target_weight;
  const weightGoal = initialWeight - targetWeight;

  let weightLost = 0;
  let weightProgress = 0;

  weightLost = initialWeight - dailyData.currentWeight;
  weightProgress = Math.round((weightLost / weightGoal) * 100);

  showProgessBox.innerHTML = `
    <h4>1. Water Goal (${dailyData.waterIntake} / ${targetData.water})</h4>
    <p>Achieved ${Math.round((dailyData.waterIntake / targetData.water) * 100)}%</p>

    <h4>2. Calorie Burns (${dailyData.calorieBurn} / ${targetData.burn})</h4>
    <p>Achieved ${Math.round((dailyData.calorieBurn / targetData.burn) * 100)}%</p>
    
    <h4>3. Calorie Intakes (${dailyData.calorieIntake} / ${targetData.intake})</h4>
    <p>Reached ${Math.round((dailyData.calorieIntake / targetData.intake) * 100)}%</p>

    <h4>4. Weight Loss (${weightLost} / ${weightGoal} kg)</h4>
    <p>Progressed ${weightProgress}%</p>
  `;
}

// userdata.html

document.getElementById('userDataForm').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    console.log('🚀 Submitted Form Data:');
    for (const [key, value] of Object.entries(data)) {
      console.log(`${key}: ${value}`);
      if (!value.trim()) {
        alert(`Please fill in the ${key} field.`);
        return;
      }
    }

    try {
      const res = await fetch('http://localhost:3000/api/user/user-fitness-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      alert(result.message);

      window.location.href = "targetdata.html";
    }
    catch (error) {
      console.error('Error submitting user data:', error);
      alert('Something went wrong. Please try again.');
    }
  });


//   targetdata.html

document.getElementById('targetDataForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      for (const [key, value] of Object.entries(data)) {
        if (!value.trim()) {
          alert(`Please fill in the ${key} field`);
          return;
        }
      }

      try {
        const res = await fetch('/user-target', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await res.json();
        alert(result.message);

        window.location.href = 'index.html';
      }

      catch (error) {
        console.error('Error submitting you data: ', error);
        alert("Oops! Something went wrong, please try again later.");
      }
    });


    // signup-login.html

      async function handleCredentialResponse(response) {
        const token = response.credential;
        console.log("Encoded JWT ID token: " + token);

        try {
          const res = await fetch("http://localhost:3000/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: token })
          });

          const data = await res.json();

          if (data.success) {
            const email = data.user.email;
            localStorage.setItem("userEmail", email);

            const isNewUser = !localStorage.getItem(email);
            window.location.href = isNewUser ? "userdata.html" : "index.html";
          } else {
            alert("Google token verification failed.");
          }
        } catch (err) {
          console.error("Auth error:", err);
          alert("Login failed due to a server error.");
        }
      }

      function func() {
        console.log("Button clicked!");
      }