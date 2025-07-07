const userTargetForm = document.getElementById('User-TargetForm');
let t_Data = {};
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

    t_Data = {
      target_water_intake: data.target_water_intake,
      target_body_weight: data.target_body_weight,
      target_cal_intake: data.target_cal_intake,
      target_cal_burn: data.target_cal_burn,
    }

    localStorage.setItem("targetData", JSON.stringify(t_Data));

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