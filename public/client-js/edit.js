const editGoalsForm = document.getElementById('editGoalsForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log(toString(data))

    if (!data.target_water_intake || !data.target_body_weight || !data.target_cal_intake || !data.target_cal_burn) {
      alert('Please fill-in all the fields');
      return;
    }

    try {
      console.log("Executing try block");  
      const id = JSON.parse(localStorage.getItem("userId"));
      const res = await fetch('/api/user/edit-target-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: id,
          target_water_intake: data.target_water_intake,
          target_body_weight: data.target_body_weight,
          target_cal_intake: data.target_cal_intake,
          target_cal_burn: data.target_cal_burn
        })
      });

      const result = await res.json();
      if (result.success) {
        console.log("Response success");  
        const newTargetData = {
          target_water_intake: data.target_water_intake,
          target_body_weight: data.target_body_weight,
          target_cal_intake: data.target_cal_intake,
          target_cal_burn: data.target_cal_burn
        };
        localStorage.setItem("targetData", JSON.stringify(newTargetData));
        window.location.href = '/';
        alert('New Goals All Set!');

      }
      else {
        console.log("Failed: ", result.message);
      }
    }

    catch (err) {
      console.error("Error in 'editGoalsForm' client JS: ", err);
      alert("Failed to submit the new goals!");
      return
    }
});